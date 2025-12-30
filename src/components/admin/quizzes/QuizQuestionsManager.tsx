"use client";

import { useState, useEffect, useCallback } from "react";
import { QuizQuestion, QuizProfile, QuizAnswer } from "@/types/quiz";
import {
    getQuizQuestions, createQuizQuestion, updateQuizQuestion, deleteQuizQuestion,
    getQuizProfiles, createQuizAnswer, updateQuizAnswer, deleteQuizAnswer, upsertAnswerInfluence
} from "@/app/actions/quiz";
import { AdminIcon } from "@/components/admin/AdminIcon";

export function QuizQuestionsManager({ quizId }: { quizId: string }) {
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [profiles, setProfiles] = useState<QuizProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const [qs, ps] = await Promise.all([
                getQuizQuestions(quizId),
                getQuizProfiles(quizId)
            ]);
            setQuestions(qs);
            setProfiles(ps);
        } catch (error) {
            console.error(error);
            setQuestions([]);
        } finally {
            setLoading(false);
        }
    }, [quizId]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleDelete = async (id: string) => {
        if (!confirm("Supprimer la question et toutes ses réponses ?")) return;
        try {
            await deleteQuizQuestion(id);
            loadData();
        } catch (e: any) {
            alert(e.message);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-between items-center">
                <div className="text-sm text-slate-400">
                    Définissez les questions ({questions.length}) et les influences de chaque réponse.
                </div>
                <button
                    onClick={() => setIsCreating(true)}
                    className="flex items-center gap-2 text-sm bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded transition-colors"
                >
                    <AdminIcon icon="mdi:plus" /> Ajouter une Question
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-8 text-slate-500">
                    <AdminIcon icon="eos-icons:loading" className="animate-spin mr-2" /> Chargement...
                </div>
            ) : questions.length === 0 ? (
                <div className="p-8 border-2 border-dashed border-slate-700/50 bg-slate-800/30 rounded text-center">
                    <div className="text-slate-400 mb-2">Aucune question définie</div>
                    <p className="text-xs text-slate-500">Ajoutez des questions pour construire votre quiz.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {questions.map((q) => (
                        <div key={q.id} className="bg-slate-900 border border-slate-700 p-4 rounded-lg flex items-center justify-between group hover:border-slate-500 transition-colors">
                            <div className="flex items-center gap-4 overflow-hidden">
                                <span className="flex-shrink-0 w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-sm font-bold border border-slate-700 text-slate-400">{q.order}</span>
                                <div className="truncate">
                                    <h4 className="font-medium text-white truncate max-w-md">{q.question_text}</h4>
                                    <div className="text-xs text-slate-500 flex gap-3 mt-0.5">
                                        <span className="flex items-center gap-1"><AdminIcon icon="mdi:format-list-bulleted" width="12" /> {q.answers?.length || 0} Réponses</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => setEditingQuestion(q)} className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded transition-colors"><AdminIcon icon="mdi:pencil" width="18" /></button>
                                <button onClick={() => handleDelete(q.id)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded transition-colors"><AdminIcon icon="mdi:trash-can" width="18" /></button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {(isCreating || editingQuestion) && (
                <QuestionEditorModal
                    quizId={quizId}
                    question={editingQuestion}
                    profiles={profiles}
                    onClose={() => { setIsCreating(false); setEditingQuestion(null); }}
                    onSuccess={() => { setIsCreating(false); setEditingQuestion(null); loadData(); }}
                />
            )}
        </div>
    );
}

// --- Question Editor Modal ---

function QuestionEditorModal({ quizId, question, profiles, onClose, onSuccess }: { quizId: string, question: QuizQuestion | null, profiles: QuizProfile[], onClose: () => void, onSuccess: () => void }) {
    // Si question est null, on est en mode création
    const [qData, setQData] = useState({
        question_text: question?.question_text || "",
        order: question?.order || 10,
        is_active: true // Toujours actif par défaut forced
    });

    const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(question?.id || null);

    // Réponses
    const [answers, setAnswers] = useState<QuizAnswer[]>(question?.answers || []);
    const [saving, setSaving] = useState(false);

    // Fonction pour sauver la question (création ou update)
    const saveQuestion = async () => {
        setSaving(true);
        try {
            if (currentQuestionId) {
                await updateQuizQuestion(currentQuestionId, qData);
            } else {
                const newQ = await createQuizQuestion(quizId, qData);
                setCurrentQuestionId(newQ.id); // Passe en mode édition
            }
        } catch (e: any) {
            alert(e.message);
        } finally {
            setSaving(false);
        }
    };

    const handleCreateAnswer = async () => {
        if (!currentQuestionId) return;
        try {
            const newA = await createQuizAnswer(currentQuestionId, {
                answer_text: "", // Empty by default
                order: (answers.length + 1) * 10
            });
            setAnswers([...answers, newA]);
        } catch (e: any) {
            alert(e.message);
        }
    };

    const handleDeleteAnswer = async (id: string) => {
        if (!confirm("Supprimer cette réponse ?")) return;
        try {
            await deleteQuizAnswer(id);
            setAnswers(answers.filter(a => a.id !== id));
        } catch (e: any) {
            alert(e.message);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800">
                    <h3 className="font-bold text-white text-lg flex items-center gap-2">
                        {currentQuestionId ? "Éditer la Question" : "Nouvelle Question"}
                    </h3>
                    <div className="flex gap-2">
                        <button onClick={onClose} className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors">Fermer</button>
                        <button
                            onClick={() => { saveQuestion().then(onSuccess); }}
                            className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded text-sm font-bold flex items-center gap-2"
                        >
                            <AdminIcon icon="mdi:check" /> Terminer
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">

                    {/* Question Form */}
                    <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 flex gap-4">
                        <div className="flex-1">
                            <label className="block text-xs uppercase font-bold text-slate-500 mb-1">Intitulé de la question</label>
                            <input
                                className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white placeholder-slate-600 focus:border-blue-500 outline-none transition-colors"
                                value={qData.question_text}
                                onChange={e => setQData({ ...qData, question_text: e.target.value })}
                                onBlur={saveQuestion}
                                placeholder="Posez votre question..."
                                autoFocus={!currentQuestionId}
                            />
                        </div>
                        <div className="w-24">
                            <label className="block text-xs uppercase font-bold text-slate-500 mb-1">Ordre</label>
                            <input
                                type="number"
                                className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white focus:border-blue-500 outline-none text-center"
                                value={qData.order}
                                onChange={e => setQData({ ...qData, order: parseInt(e.target.value) })}
                                onBlur={saveQuestion}
                            />
                        </div>
                        {/* Status Checkbox Removed */}
                    </div>

                    {/* Answers Section */}
                    {currentQuestionId ? (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                                <h4 className="text-white font-bold text-md flex items-center gap-2">
                                    <AdminIcon icon="mdi:playlist-check" /> Réponses & Influences
                                </h4>
                                <button
                                    onClick={handleCreateAnswer}
                                    className="text-xs bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded transition-colors flex items-center gap-1"
                                >
                                    <AdminIcon icon="mdi:plus" /> Ajouter Réponse
                                </button>
                            </div>

                            {/* Answers List / Grid */}
                            <div className="overflow-x-auto pb-20">
                                <table className="w-full text-left text-sm border-collapse">
                                    <thead>
                                        <tr>
                                            <th className="p-2 w-12 text-center text-slate-500">N°</th>
                                            <th className="p-2 min-w-[250px] text-slate-500">Réponse</th>
                                            {/* Profile Headers */}
                                            {profiles.map(p => (
                                                <th key={p.id} className="p-2 w-24 text-center text-slate-400 border-l border-slate-800" title={p.description_result || ""}>
                                                    <div className="truncate w-20 mx-auto text-xs font-medium text-slate-300">{p.name}</div>
                                                </th>
                                            ))}
                                            <th className="p-2 w-10"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800">
                                        {answers.map(answer => (
                                            <AnswerRow
                                                key={answer.id}
                                                answer={answer}
                                                profiles={profiles}
                                                onDelete={() => handleDeleteAnswer(answer.id)}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                                {answers.length === 0 && (
                                    <div className="text-center py-6 text-slate-500 italic">Aucune réponse pour le moment.</div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12 text-slate-500 animate-pulse">
                            Enregistrez la question pour ajouter des réponses.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Sub-component for performance and state isolation per row
function AnswerRow({ answer, profiles, onDelete }: { answer: QuizAnswer, profiles: QuizProfile[], onDelete: () => void }) {
    const [text, setText] = useState(answer.answer_text);
    const [order, setOrder] = useState(answer.order);

    // Influences Map: { [profileId]: weight }
    const [influences, setInfluences] = useState<Record<string, number>>(() => {
        const map: Record<string, number> = {};
        answer.influences?.forEach(inf => {
            map[inf.profile_id] = inf.weight;
        });
        return map;
    });

    const handleSaveInfo = async () => {
        if (text !== answer.answer_text || order !== answer.order) {
            await updateQuizAnswer(answer.id, { answer_text: text, order });
        }
    };

    const handleWeightChange = async (profileId: string, val: string) => {
        const weight = parseInt(val) || 0;
        setInfluences(prev => ({ ...prev, [profileId]: weight }));
        // Auto-save influence
        await upsertAnswerInfluence(answer.id, profileId, weight);
    };

    return (
        <tr className="hover:bg-slate-800/30 transition-colors group">
            <td className="p-2">
                <input
                    type="number"
                    className="w-12 bg-transparent text-center text-slate-400 focus:text-white border border-transparent focus:border-slate-600 rounded p-1 outline-none text-xs"
                    value={order}
                    onChange={e => setOrder(parseInt(e.target.value))}
                    onBlur={handleSaveInfo}
                />
            </td>
            <td className="p-2">
                <input
                    type="text"
                    className="w-full bg-transparent text-white border border-transparent focus:border-slate-600 rounded px-2 py-1 outline-none placeholder-slate-700"
                    value={text}
                    onChange={e => setText(e.target.value)}
                    onBlur={handleSaveInfo}
                    placeholder="Texte de la réponse..."
                    autoFocus={text === ""} // Auto-focus if empty (new answer)
                />
            </td>
            {profiles.map(p => (
                <td key={p.id} className="p-2 text-center border-l border-slate-800">
                    <input
                        type="number"
                        className={`w-12 text-center rounded p-1 outline-none border border-slate-700 focus:border-blue-500 transition-colors ${(influences[p.id] || 0) > 0 ? 'bg-blue-900/20 text-blue-400 font-bold' :
                                (influences[p.id] || 0) < 0 ? 'bg-red-900/20 text-red-400 font-bold' :
                                    'bg-slate-800/50 text-slate-500'
                            }`}
                        value={influences[p.id] || 0}
                        onChange={e => handleWeightChange(p.id, e.target.value)}
                        onFocus={e => e.target.select()}
                    />
                </td>
            ))}
            <td className="p-2 text-right">
                <button onClick={onDelete} className="text-slate-600 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <AdminIcon icon="mdi:close" />
                </button>
            </td>
        </tr>
    );
}
