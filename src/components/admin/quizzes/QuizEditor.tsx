"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Quiz, QuizFormData } from "@/types/quiz";
import { createQuiz, updateQuiz, deleteQuiz } from "@/app/actions/quiz";
import { uploadImage } from "@/app/admin/actions";
import { QuizProfilesManager } from "@/components/admin/quizzes/QuizProfilesManager";
import { QuizQuestionsManager } from "@/components/admin/quizzes/QuizQuestionsManager";
import { AdminIcon } from "@/components/admin/AdminIcon";

interface QuizEditorProps {
    quiz?: Quiz;
}

export function QuizEditor({ quiz }: QuizEditorProps) {
    const router = useRouter();
    const isEditing = !!quiz;
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'config' | 'profiles' | 'questions'>('config');

    // Form States
    const [formData, setFormData] = useState<QuizFormData>({
        title: quiz?.title || "",
        slug: quiz?.slug || "",
        description: quiz?.description || "",
        long_description: quiz?.long_description || "",
        is_active: quiz?.is_active || false,
        image_url: quiz?.image_url || "",
        background_image_url: quiz?.background_image_url || "",
        is_premium: quiz?.is_premium || false,
        limit_enabled: quiz?.limit_enabled || false,
        limit_count: quiz?.limit_count || 1,
        published_at: quiz?.published_at || null,
        btn_label: quiz?.btn_label || "Commencer le quiz",
        btn_icon: quiz?.btn_icon || "mdi:play-circle-outline"
    });

    const hasChanges = !quiz ? true : (
        formData.title !== quiz.title ||
        formData.slug !== quiz.slug ||
        formData.description !== (quiz.description || "") ||
        formData.long_description !== (quiz.long_description || "") ||
        formData.is_active !== quiz.is_active ||
        formData.image_url !== (quiz.image_url || "") ||
        formData.background_image_url !== (quiz.background_image_url || "") ||
        formData.is_premium !== (quiz.is_premium || false) ||
        formData.limit_enabled !== (quiz.limit_enabled || false) ||
        formData.limit_count !== (quiz.limit_count || 1) ||
        formData.published_at !== (quiz.published_at || null) ||
        formData.btn_label !== (quiz.btn_label || "Commencer le quiz") ||
        formData.btn_icon !== (quiz.btn_icon || "mdi:play-circle-outline")
    );

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setLoading(true);
        try {
            if (isEditing && quiz) {
                // Apply default created_at if published_at is empty/null, or keep it if explicitly set
                // Actually, if it's null, we might want to leave it null or set it.
                // Request says: "par défaut, c'est la date de création. Mais c'est une donnée modifiable."
                // Currently if null, front logic might use createdAll. Backend storage should probably just store what's given.
                await updateQuiz(quiz.id, formData);
                router.refresh();
                alert("Modifications enregistrées");
            } else {
                // On creation, we can set published_at to now or created_at default
                // Let's set it to null initially, and rely on logic
                const newQuiz = await createQuiz({
                    ...formData,
                    published_at: formData.published_at || new Date().toISOString() // Default to now for new quizzes if not set
                });
                router.push(`/admin/quizzes/${newQuiz.id}`);
            }
        } catch (err: any) {
            console.error(err);
            alert("Erreur: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!quiz) return;
        if (!confirm("Êtes-vous sûr de vouloir supprimer ce quiz ? Cette action est irréversible.")) return;

        setLoading(true);
        try {
            await deleteQuiz(quiz.id);
            router.push('/admin/quizzes');
        } catch (err: any) {
            console.error(err);
            alert("Erreur lors de la suppression: " + err.message);
            setLoading(false);
        }
    };

    const compressToWebP = async (file: File): Promise<File> => {
        if (file.type === 'image/svg+xml') return file;
        return new Promise((resolve) => {
            const img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                if (!ctx) { resolve(file); return; }
                ctx.drawImage(img, 0, 0);
                canvas.toBlob((blob) => {
                    if (!blob) { resolve(file); return; }
                    const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".webp", { type: "image/webp" });
                    resolve(newFile);
                }, "image/webp", 0.85);
            };
            img.onerror = () => resolve(file);
        });
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'image_url' | 'background_image_url') => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const compressed = await compressToWebP(file);
            const fd = new FormData();
            fd.append('file', compressed);
            const url = await uploadImage(fd);
            setFormData(prev => ({ ...prev, [field]: url }));
        } catch (err: any) {
            alert("Erreur upload: " + err.message);
        }
    };

    const ToggleActive = () => (
        <button
            type="button"
            onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
            className="flex items-center gap-3 group focus:outline-none"
        >
            <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 relative ${formData.is_active ? "bg-green-500" : "bg-slate-600"}`}>
                <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${formData.is_active ? "translate-x-6" : "translate-x-0"}`} />
            </div>
            <span className={`text-sm font-medium transition-colors ${formData.is_active ? "text-green-400" : "text-slate-400"}`}>
                {formData.is_active ? "Publié" : "Brouillon"}
            </span>
        </button>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-700">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="text-slate-400 hover:text-white transition-colors">
                        <AdminIcon icon="mdi:arrow-left" width="24" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-white">
                            {isEditing ? formData.title : "Nouveau Quiz"}
                        </h1>
                        {isEditing && (
                            <div className="flex gap-2 mt-1">
                                <div className="text-xs font-mono text-slate-500 bg-slate-900 px-2 py-1 rounded inline-block">
                                    {formData.slug}
                                </div>
                                {quiz && (
                                    <div className="text-xs text-slate-500 flex items-center bg-slate-900 px-2 py-1 rounded">
                                        Modifié le {new Date(quiz.updated_at).toLocaleDateString()}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <ToggleActive />
                    <button
                        onClick={() => handleSubmit()}
                        disabled={loading || !hasChanges}
                        className={`px-6 py-2 rounded text-sm font-medium transition-colors ${hasChanges && !loading
                            ? "bg-blue-600 hover:bg-blue-500 text-white"
                            : "bg-slate-700 text-slate-400 cursor-not-allowed"
                            }`}
                    >
                        {loading ? "Sauvegarde..." : "Enregistrer"}
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-8 border-b border-slate-700 overflow-x-auto">
                <button onClick={() => setActiveTab('config')} className={`pb-4 text-sm font-medium border-b-2 transition-colors duration-200 whitespace-nowrap ${activeTab === 'config' ? 'border-blue-500 text-white' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>Général</button>
                <button onClick={() => setActiveTab('profiles')} disabled={!isEditing} className={`pb-4 text-sm font-medium border-b-2 transition-colors duration-200 whitespace-nowrap ${activeTab === 'profiles' ? 'border-blue-500 text-white' : 'border-transparent text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed'}`}>Profils</button>
                <button onClick={() => setActiveTab('questions')} disabled={!isEditing} className={`pb-4 text-sm font-medium border-b-2 transition-colors duration-200 whitespace-nowrap ${activeTab === 'questions' ? 'border-blue-500 text-white' : 'border-transparent text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed'}`}>Questions</button>
            </div>

            {/* Config Tab Content */}
            {activeTab === 'config' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">

                    {/* Basic Info */}
                    <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                        <h2 className="text-lg font-medium text-white border-b border-slate-700 pb-2 mb-4">Informations Principales</h2>
                        <div className="space-y-4 max-w-3xl">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Titre du Quiz</label>
                                <input type="text" required className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white outline-none focus:border-blue-500 transition-colors" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Slug (URL)</label>
                                <input type="text" required className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white font-mono text-sm outline-none focus:border-blue-500 transition-colors" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Description courte (Liste)</label>
                                <textarea rows={2} className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white outline-none focus:border-blue-500 transition-colors" value={formData.description || ""} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Description affichée dans la liste des quiz..." />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Description longue (Lancement)</label>
                                <textarea rows={4} className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white outline-none focus:border-blue-500 transition-colors" value={formData.long_description || ""} onChange={(e) => setFormData({ ...formData, long_description: e.target.value })} placeholder="Texte détaillé affiché sur l'écran d'introduction du quiz. (Optionnel, sinon la description courte est utilisée)" />
                            </div>
                        </div>
                    </div>

                    {/* Visuels */}
                    <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                        <h2 className="text-lg font-medium text-white border-b border-slate-700 pb-2 mb-4">Visuels</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Thumbnail */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Thumbnail (Liste)</label>
                                <div className="flex gap-4 items-start">
                                    <div className="w-24 h-24 bg-slate-900 border border-slate-600 rounded-lg overflow-hidden flex items-center justify-center relative group">
                                        {formData.image_url ? (
                                            <img src={formData.image_url} alt="Thumbnail" className="w-full h-full object-cover" />
                                        ) : (
                                            <AdminIcon icon="mdi:image-off" className="text-slate-600 w-8 h-8" />
                                        )}
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <label className="cursor-pointer p-2 rounded-full bg-slate-700 hover:bg-slate-600 text-white">
                                                <AdminIcon icon="mdi:upload" width="20" />
                                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'image_url')} />
                                            </label>
                                        </div>
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <input type="text" placeholder="URL de l'image" className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-xs text-white outline-none" value={formData.image_url || ''} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} />
                                        <p className="text-xs text-slate-500">Image carrée recommandée (ex: 400x400).</p>
                                    </div>
                                </div>
                            </div>

                            {/* Background */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Image de fond (Background)</label>
                                <div className="flex gap-4 items-start">
                                    <div className="w-40 h-24 bg-slate-900 border border-slate-600 rounded-lg overflow-hidden flex items-center justify-center relative group">
                                        {formData.background_image_url ? (
                                            <img src={formData.background_image_url} alt="Background" className="w-full h-full object-cover" />
                                        ) : (
                                            <AdminIcon icon="mdi:image-off" className="text-slate-600 w-8 h-8" />
                                        )}
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <label className="cursor-pointer p-2 rounded-full bg-slate-700 hover:bg-slate-600 text-white">
                                                <AdminIcon icon="mdi:upload" width="20" />
                                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'background_image_url')} />
                                            </label>
                                        </div>
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <input type="text" placeholder="URL de l'image" className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-xs text-white outline-none" value={formData.background_image_url || ''} onChange={(e) => setFormData({ ...formData, background_image_url: e.target.value })} />
                                        <p className="text-xs text-slate-500">Image large recommandée (ex: 1920x1080).</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Configuration des Boutons (Style Tirages) */}
                    <div className="space-y-4 pt-4 border-t border-slate-700">
                        <h2 className="text-lg font-medium text-white pb-2">Configuration de l'Action</h2>

                        <div className="p-4 bg-slate-900 rounded-lg space-y-4 border border-slate-700">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Lancement du Quiz</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs text-slate-500">Label du bouton</label>
                                    <input
                                        type="text"
                                        value={formData.btn_label || ""}
                                        onChange={(e) => setFormData({ ...formData, btn_label: e.target.value })}
                                        className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-sm text-white"
                                        placeholder="Commencer le quiz"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-slate-500 flex items-center gap-2">
                                        Icône <a href="https://icon-sets.iconify.design/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300"><AdminIcon icon="mdi:open-in-new" className="w-3 h-3" /></a>
                                    </label>
                                    <div className="flex gap-2">
                                        <div className="w-10 h-10 bg-slate-800 border border-slate-600 rounded flex items-center justify-center text-white">
                                            <AdminIcon icon={formData.btn_icon || "mdi:help"} />
                                        </div>
                                        <input
                                            type="text"
                                            value={formData.btn_icon || ""}
                                            onChange={(e) => setFormData({ ...formData, btn_icon: e.target.value })}
                                            className="flex-1 bg-slate-800 border border-slate-600 rounded px-3 py-2 text-sm text-white"
                                            placeholder="mdi:play-circle-outline"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Option Premium */}
                            <div className="flex items-center gap-2 mt-2">
                                <input
                                    type="checkbox"
                                    id="is_premium"
                                    checked={formData.is_premium}
                                    onChange={(e) => setFormData({ ...formData, is_premium: e.target.checked })}
                                    className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-blue-500/50"
                                />
                                <label htmlFor="is_premium" className="text-sm text-slate-300 select-none cursor-pointer">
                                    Option Premium (Réservé aux membres)
                                </label>
                            </div>

                            {/* Limiter */}
                            <div className="flex items-center gap-4 mt-2 pt-2 border-t border-slate-800">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="limit_enabled"
                                        checked={formData.limit_enabled}
                                        onChange={(e) => setFormData({ ...formData, limit_enabled: e.target.checked })}
                                        className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-blue-500/50"
                                    />
                                    <label htmlFor="limit_enabled" className="text-sm text-slate-300 select-none cursor-pointer">
                                        Limiter la fréquence
                                    </label>
                                </div>

                                {formData.limit_enabled && (
                                    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2">
                                        <input
                                            type="number"
                                            min="1"
                                            value={formData.limit_count}
                                            onChange={(e) => setFormData({ ...formData, limit_count: parseInt(e.target.value) || 1 })}
                                            className="w-16 bg-slate-800 border border-slate-600 rounded px-2 py-1 text-sm text-white text-center"
                                        />
                                        <span className="text-xs text-slate-500">fois / jour</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Publication Date */}
                    <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                        <h2 className="text-lg font-medium text-white border-b border-slate-700 pb-2 mb-4">Publication</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Publié le</label>
                                <input
                                    type="datetime-local"
                                    className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white outline-none focus:border-blue-500 [color-scheme:dark]"
                                    value={formData.published_at ? new Date(formData.published_at).toISOString().slice(0, 16) : ""}
                                    onChange={(e) => setFormData({ ...formData, published_at: e.target.value ? new Date(e.target.value).toISOString() : null })}
                                />
                                <p className="text-xs text-slate-500 mt-1">
                                    Par défaut : date de création. {formData.published_at ? `Actuellement : ${new Date(formData.published_at).toLocaleDateString()}` : "Non défini (prendra la date de création)"}
                                    <br />Utilisé pour le badge "Nouveau" (visible 30 jours).
                                </p>
                            </div>
                        </div>     {/* Delete Zone */}
                        {isEditing && (
                            <div className="mt-8 pt-6 border-t border-slate-700">
                                <h3 className="text-red-500 font-bold mb-2">Zone de danger</h3>
                                <p className="text-sm text-slate-400 mb-4">La suppression est définitive et effacera toutes les données associées (questions, réponses, résultats).</p>
                                <button
                                    onClick={handleDelete}
                                    disabled={loading}
                                    className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/50 px-4 py-2 rounded text-sm font-medium transition-colors"
                                >
                                    Supprimer ce quiz
                                </button>
                            </div>
                        )}
                    </div>

                </div>
            )}

            {/* Profiles Tab */}
            {activeTab === 'profiles' && isEditing && quiz && <QuizProfilesManager quizId={quiz.id} />}
            {/* Questions Tab */}
            {activeTab === 'questions' && isEditing && quiz && <QuizQuestionsManager quizId={quiz.id} />}
        </div>
    );
}
