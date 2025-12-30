"use client";

import { useState, useEffect, useCallback } from "react";
import { QuizProfile, QuizProfileFormData } from "@/types/quiz";
import { getQuizProfiles, createQuizProfile, updateQuizProfile, deleteQuizProfile } from "@/app/actions/quiz";
import { AdminIcon } from "@/components/admin/AdminIcon";

export function QuizProfilesManager({ quizId }: { quizId: string }) {
    const [profiles, setProfiles] = useState<QuizProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingProfile, setEditingProfile] = useState<QuizProfile | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    const loadProfiles = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getQuizProfiles(quizId);
            setProfiles(data);
        } catch (error) {
            console.error("Failed to load profiles", error);
            setProfiles([]);
        } finally {
            setLoading(false);
        }
    }, [quizId]);

    useEffect(() => {
        loadProfiles();
    }, [loadProfiles]);

    const handleDelete = async (id: string) => {
        if (!confirm("Supprimer ce profil ? Cela cassera les influences liées.")) return;
        try {
            await deleteQuizProfile(id);
            loadProfiles();
        } catch (e) {
            alert("Erreur suppression");
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div className="text-sm text-slate-400">
                    Définissez les résultats possibles (archétypes, éléments, etc.)
                </div>
                <button
                    onClick={() => setIsCreating(true)}
                    className="flex items-center gap-2 text-sm bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded transition-colors"
                >
                    <AdminIcon icon="mdi:plus" /> Ajouter un Profil
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-8 text-slate-500">
                    <AdminIcon icon="eos-icons:loading" className="animate-spin mr-2" /> Chargement...
                </div>
            ) : profiles.length === 0 ? (
                <div className="p-8 border-2 border-dashed border-slate-700/50 bg-slate-800/30 rounded text-center">
                    <div className="text-slate-400 mb-2">Aucun profil défini</div>
                    <p className="text-xs text-slate-500">Créez au moins 2 profils pour que le quiz fonctionne.</p>
                </div>
            ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                    {profiles.map(profile => (
                        <div key={profile.id} className="bg-slate-900 border border-slate-700 p-4 rounded-lg flex flex-col justify-between group hover:border-slate-500 transition-colors">
                            <div className="mb-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-white flex items-center gap-2 truncate pr-2">
                                        <span className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs text-slate-500 border border-slate-700">{profile.order}</span>
                                        {profile.name}
                                    </h4>
                                </div>
                                <div className="text-sm text-slate-400 line-clamp-3 bg-slate-950/30 p-2 rounded">
                                    {profile.description_result || <i className="opacity-50">Aucune description</i>}
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800 opacity-60 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => setEditingProfile(profile)} className="text-xs flex items-center gap-1 text-slate-400 hover:text-blue-400 px-2 py-1 rounded hover:bg-slate-800 transition-colors">
                                    <AdminIcon icon="mdi:pencil" width="14" /> Modifier
                                </button>
                                <button onClick={() => handleDelete(profile.id)} className="text-xs flex items-center gap-1 text-slate-400 hover:text-red-400 px-2 py-1 rounded hover:bg-slate-800 transition-colors">
                                    <AdminIcon icon="mdi:trash-can" width="14" /> Supprimer
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal/Form Overlay for Edit/Create */}
            {(isCreating || editingProfile) && (
                <ProfileForm
                    quizId={quizId}
                    profile={editingProfile}
                    onClose={() => { setIsCreating(false); setEditingProfile(null); }}
                    onSuccess={() => { setIsCreating(false); setEditingProfile(null); loadProfiles(); }}
                />
            )}
        </div>
    );
}

function ProfileForm({ quizId, profile, onClose, onSuccess }: { quizId: string, profile: QuizProfile | null, onClose: () => void, onSuccess: () => void }) {
    const [formData, setFormData] = useState<QuizProfileFormData>({
        name: profile?.name || "",
        description_result: profile?.description_result || "",
        is_active: true, // Toujours actif
        order: profile?.order || 10
    });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (profile) {
                await updateQuizProfile(profile.id, formData);
            } else {
                await createQuizProfile(quizId, formData);
            }
            onSuccess();
        } catch (e: any) {
            alert(e.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-900">
                    <h3 className="font-bold text-white text-lg">{profile ? "Éditer le Profil" : "Nouveau Profil"}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors"><AdminIcon icon="mdi:close" width="24" /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
                    <div className="grid grid-cols-4 gap-4">
                        <div className="col-span-3">
                            <label className="block text-xs uppercase font-bold text-slate-500 mb-1">Nom du Profil</label>
                            <input
                                required
                                autoFocus
                                className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-600"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                placeholder="ex: Le Sage"
                            />
                        </div>
                        <div className="col-span-1">
                            <label className="block text-xs uppercase font-bold text-slate-500 mb-1">N°</label>
                            <input
                                type="number"
                                className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                value={formData.order}
                                onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs uppercase font-bold text-slate-500 mb-1">Description du Résultat</label>
                        <p className="text-xs text-slate-400 mb-2">Ce texte sera affiché à l&apos;utilisateur s&apos;il obtient ce profil.</p>
                        <textarea
                            className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none min-h-[120px] transition-all"
                            value={formData.description_result || ""}
                            onChange={e => setFormData({ ...formData, description_result: e.target.value })}
                            placeholder="Vous êtes une personne..."
                        />
                    </div>

                    <div className="flex items-center justify-end pt-2 gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors font-medium">Annuler</button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-md text-sm font-bold shadow-lg shadow-blue-900/20 transition-all transform active:scale-95 disabled:opacity-70 disabled:scale-100 flex items-center gap-2"
                        >
                            {saving && <AdminIcon icon="eos-icons:loading" className="animate-spin" />}
                            {saving ? "Enregistrement..." : "Enregistrer"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
