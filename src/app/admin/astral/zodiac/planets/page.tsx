'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { createBrowserClient } from '@supabase/ssr';
import { ZodiacPlanet } from '@/types/zodiac-enrichment';
import Image from 'next/image';

export default function MasterPlanetsManagementPage() {
    const [planets, setPlanets] = useState<ZodiacPlanet[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<ZodiacPlanet>>({});

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        loadPlanets();
    }, []);

    async function loadPlanets() {
        setLoading(true);
        const { data, error } = await supabase
            .from('zodiac_planets')
            .select('*')
            .order('name_fr');

        if (!error && data) {
            setPlanets(data);
        }
        setLoading(false);
    }

    async function handleSave(planetData: Partial<ZodiacPlanet>) {
        if (editingId) {
            // Update
            const { error } = await supabase
                .from('zodiac_planets')
                .update(planetData)
                .eq('id', editingId);

            if (!error) {
                await loadPlanets();
                setEditingId(null);
                setFormData({});
            }
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Supprimer cette planète maîtresse ?')) return;

        const { error } = await supabase
            .from('zodiac_planets')
            .delete()
            .eq('id', id);

        if (!error) {
            await loadPlanets();
        }
    }

    function startEdit(planet: ZodiacPlanet) {
        setEditingId(planet.id);
        setFormData(planet);
    }

    function cancelEdit() {
        setEditingId(null);
        setFormData({});
    }

    if (loading) return (
        <div className="max-w-5xl mx-auto">
            <p className="text-slate-400">Chargement...</p>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto">
            <header className="mb-8">
                <div className="flex items-center gap-4 mb-2">
                    <Link href="/admin/astral/zodiac" className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors">
                        <Icon icon="mdi:arrow-left" width={24} />
                    </Link>
                    <h1 className="text-3xl font-bold text-white">Planètes Maîtresses</h1>
                </div>
                <p className="text-slate-400 pl-14">Gérez les planètes maîtresses et leurs icônes.</p>
            </header>

            <div className="space-y-4">
                {planets.map((planet) => (
                    <div
                        key={planet.id}
                        className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden"
                    >
                        {editingId === planet.id ? (
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-white mb-4">Modifier {planet.name_fr}</h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1">Nom</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name_fr || ''}
                                            onChange={(e) => setFormData({ ...formData, name_fr: e.target.value })}
                                            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1">URL Icône (avec glow effect)</label>
                                        <input
                                            type="text"
                                            value={formData.icon_image_url || ''}
                                            onChange={(e) => setFormData({ ...formData, icon_image_url: e.target.value })}
                                            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                                            placeholder="https://..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                                        <textarea
                                            value={formData.description || ''}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                                            rows={3}
                                            placeholder="Planète de l'action et du courage"
                                        />
                                    </div>

                                    {formData.icon_image_url && (
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-slate-400">Aperçu :</span>
                                            <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center border border-yellow-500/30 shadow-[0_0_20px_rgba(255,215,0,0.2)] overflow-hidden relative">
                                                <Image
                                                    src={formData.icon_image_url}
                                                    alt="Icon Preview"
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-2 mt-6">
                                    <button
                                        onClick={() => handleSave(formData)}
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                                    >
                                        Enregistrer
                                    </button>
                                    <button
                                        onClick={cancelEdit}
                                        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors"
                                    >
                                        Annuler
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-4">
                                    {planet.icon_image_url ? (
                                        <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center border border-yellow-500/30 shadow-[0_0_20px_rgba(255,215,0,0.2)] overflow-hidden relative">
                                            <Image
                                                src={planet.icon_image_url}
                                                alt={planet.name_fr}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center border border-slate-700">
                                            <Icon icon="mdi:star" width={24} className="text-slate-500" />
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="font-semibold text-white">{planet.name_fr}</h3>
                                        {planet.description && (
                                            <p className="text-sm text-slate-400 mt-1">{planet.description}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => startEdit(planet)}
                                        className="px-3 py-1.5 text-sm bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors"
                                    >
                                        Modifier
                                    </button>
                                    <button
                                        onClick={() => handleDelete(planet.id)}
                                        className="px-3 py-1.5 text-sm bg-red-900/20 hover:bg-red-900/40 text-red-400 border border-red-900/50 rounded transition-colors"
                                    >
                                        Supprimer
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
