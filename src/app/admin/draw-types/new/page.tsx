'use client';

import { createDrawType } from "../../actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";

export default function NewDrawTypePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError(null);

        try {
            const rawData = {
                title: formData.get('title') as string,
                slug: formData.get('slug') as string,
                description: formData.get('description') as string,
                image_url: formData.get('image_url') as string,
                intro_title: formData.get('intro_title') as string,
                intro_subtitle: formData.get('intro_subtitle') as string,
                is_active: formData.get('is_active') === 'on',
            };

            await createDrawType(rawData);
            router.push('/admin/draw-types');
        } catch (e) {
            setError(e instanceof Error ? e.message : "Une erreur est survenue");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div id="admin-new-type-page" className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/draw-types" className="text-slate-400 hover:text-white transition-colors">
                    <Icon icon="mdi:arrow-left" className="w-6 h-6" />
                </Link>
                <h1 className="text-2xl font-bold text-white">Nouveau Type de Tirage</h1>
            </div>

            <form id="admin-new-type-form" action={handleSubmit} className="bg-slate-800 p-6 rounded-lg border border-slate-700 space-y-6">

                {/* --- Main Info --- */}
                <div id="section-general-info" className="space-y-4">
                    <h2 className="text-lg font-medium text-white border-b border-slate-700 pb-2">Informations Générales</h2>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="title" className="block text-sm font-medium text-slate-300">Titre (Requis)</label>
                            <input
                                type="text" name="title" id="title" required
                                className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="slug" className="block text-sm font-medium text-slate-300">Slug (Unique)</label>
                            <input
                                type="text" name="slug" id="slug" required
                                className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="description" className="block text-sm font-medium text-slate-300">Description (Interne)</label>
                        <textarea
                            name="description" id="description" rows={3}
                            className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="image_url" className="block text-sm font-medium text-slate-300">Image URL (Thumbnail)</label>
                        <input
                            type="text" name="image_url" id="image_url" placeholder="/backgrounds/journal.png"
                            className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>
                </div>

                {/* --- Intro Content --- */}
                <div id="section-intro-content" className="space-y-4 pt-4">
                    <h2 className="text-lg font-medium text-white border-b border-slate-700 pb-2">Contenu Intro</h2>

                    <div className="space-y-2">
                        <label htmlFor="intro_title" className="block text-sm font-medium text-slate-300">Titre Intro</label>
                        <input
                            type="text" name="intro_title" id="intro_title"
                            className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="intro_subtitle" className="block text-sm font-medium text-slate-300">Sous-titre Intro</label>
                        <input
                            type="text" name="intro_subtitle" id="intro_subtitle"
                            className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>
                </div>

                {/* --- Status --- */}
                <div className="pt-4 flex items-center gap-3">
                    <input
                        type="checkbox" name="is_active" id="is_active"
                        defaultChecked
                        className="w-5 h-5 rounded border-slate-600 bg-slate-900 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="is_active" className="text-sm font-medium text-slate-300">Actif (Visible dans l'app)</label>
                </div>

                {/* --- Actions --- */}
                <div className="pt-6 border-t border-slate-700 flex justify-end gap-3">
                    <Link
                        href="/admin/draw-types"
                        className="px-4 py-2 rounded text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                    >
                        Annuler
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Création...' : 'Créer le Type'}
                    </button>
                </div>

                {error && (
                    <div className="p-4 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                        {error}
                    </div>
                )}
            </form>
        </div>
    );
}
