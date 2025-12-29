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
                is_active: false, // Force Draft on creation
            };

            // @ts-ignore
            const newType = await createDrawType(rawData);
            router.push(`/admin/draw-types/${newType.id}`);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Une erreur est survenue");
            setLoading(false); // Only stop loading on error, otherwise we are redirecting
        }
    }

    return (
        <div id="admin-new-type-page" className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/draw-types" className="text-slate-400 hover:text-white transition-colors">
                    <Icon icon="mdi:arrow-left" className="w-6 h-6" />
                </Link>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-white">Nouveau Type de Tirage</h1>
                    <p className="text-slate-400 text-sm">Commencez par nommer votre tirage. Vous pourrez configurer tous les détails ensuite.</p>
                </div>
            </div>

            <form id="admin-new-type-form" action={handleSubmit} className="bg-slate-800 p-6 rounded-lg border border-slate-700 space-y-6">

                {/* --- Main Info --- */}
                <div id="section-general-info" className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="title" className="block text-sm font-medium text-slate-300">Titre (Requis)</label>
                        <input
                            type="text" name="title" id="title" required
                            placeholder="Ex: Oracle des Runes"
                            onChange={(e) => {
                                const val = e.target.value;
                                const slugInput = document.getElementById('slug') as HTMLInputElement;
                                if (slugInput && !slugInput.value) {
                                    slugInput.value = val.toLowerCase().trim()
                                        .replace(/[^\w\s-]/g, '')
                                        .replace(/[\s_-]+/g, '-')
                                        .replace(/^-+|-+$/g, '');
                                }
                            }}
                            className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="slug" className="block text-sm font-medium text-slate-300">Slug (Unique - URL)</label>
                        <input
                            type="text" name="slug" id="slug" required
                            className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>
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
                        className="px-6 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {loading ? 'Création...' : 'Créer et Configurer'} <Icon icon="mdi:arrow-right" />
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
