'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { createBrowserClient } from '@supabase/ssr';
import { ZodiacSignPlanetRuler, ZodiacPlanet } from '@/types/zodiac-enrichment';
import Image from 'next/image';

interface SignWithRuler {
    sign_slug: string;
    sign_name: string;
    ruler: (ZodiacSignPlanetRuler & { planet?: ZodiacPlanet }) | null;
}

export default function MasterPlanetManagementPage() {
    const [signsWithRulers, setSignsWithRulers] = useState<SignWithRuler[]>([]);
    const [planets, setPlanets] = useState<ZodiacPlanet[]>([]);
    const [loading, setLoading] = useState(true);
    const [editedSigns, setEditedSigns] = useState<Set<string>>(new Set());

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const SIGNS = [
        { slug: 'aries', name: 'Bélier' },
        { slug: 'taurus', name: 'Taureau' },
        { slug: 'gemini', name: 'Gémeaux' },
        { slug: 'cancer', name: 'Cancer' },
        { slug: 'leo', name: 'Lion' },
        { slug: 'virgo', name: 'Vierge' },
        { slug: 'libra', name: 'Balance' },
        { slug: 'scorpio', name: 'Scorpion' },
        { slug: 'sagittarius', name: 'Sagittaire' },
        { slug: 'capricorn', name: 'Capricorne' },
        { slug: 'aquarius', name: 'Verseau' },
        { slug: 'pisces', name: 'Poissons' },
    ];

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        setLoading(true);
        setEditedSigns(new Set());

        // Charger les planètes
        const { data: planetsData } = await supabase
            .from('zodiac_planets')
            .select('*')
            .order('name_fr');

        if (planetsData) setPlanets(planetsData);

        // Charger les maîtres pour chaque signe
        const { data: rulersData } = await supabase
            .from('zodiac_sign_planet_rulers')
            .select('*, planet:zodiac_planets(*)')
            .order('sign_slug');

        if (rulersData) {
            const grouped = SIGNS.map(sign => ({
                sign_slug: sign.slug,
                sign_name: sign.name,
                ruler: rulersData.find((r: any) => r.sign_slug === sign.slug) || null,
            }));
            setSignsWithRulers(grouped);
        }

        setLoading(false);
    }

    async function handleUpdateRuler(
        signSlug: string,
        planetSlug: string,
        description: string,
        iconImageUrl: string
    ) {
        // Vérifier si le maître existe déjà
        const { data: existing } = await supabase
            .from('zodiac_sign_planet_rulers')
            .select('id')
            .eq('sign_slug', signSlug)
            .single();

        if (existing) {
            // Update
            await supabase
                .from('zodiac_sign_planet_rulers')
                .update({
                    planet_slug: planetSlug,
                    description,
                    icon_image_url: iconImageUrl,
                })
                .eq('id', existing.id);
        } else {
            // Insert
            await supabase
                .from('zodiac_sign_planet_rulers')
                .insert({
                    sign_slug: signSlug,
                    planet_slug: planetSlug,
                    description,
                    icon_image_url: iconImageUrl,
                });
        }

        await loadData();
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
                    <h1 className="text-3xl font-bold text-white">Planète Maîtresse</h1>
                </div>
                <p className="text-slate-400 pl-14">Association de la planète maîtresse pour chaque signe.</p>
            </header>

            <div className="space-y-4">
                {signsWithRulers.map((sign) => (
                    <RulerRow
                        key={sign.sign_slug}
                        signSlug={sign.sign_slug}
                        signName={sign.sign_name}
                        ruler={sign.ruler}
                        planets={planets}
                        onUpdate={handleUpdateRuler}
                        onEdit={() => setEditedSigns(prev => new Set(prev).add(sign.sign_slug))}
                        hasEdits={editedSigns.has(sign.sign_slug)}
                    />
                ))}
            </div>
        </div>
    );
}

function RulerRow({
    signSlug,
    signName,
    ruler,
    planets,
    onUpdate,
    onEdit,
    hasEdits,
}: {
    signSlug: string;
    signName: string;
    ruler: (ZodiacSignPlanetRuler & { planet?: ZodiacPlanet }) | null;
    planets: ZodiacPlanet[];
    onUpdate: (signSlug: string, planetSlug: string, description: string, iconImageUrl: string) => void;
    onEdit: () => void;
    hasEdits: boolean;
}) {
    const [planetSlug, setPlanetSlug] = useState(ruler?.planet_slug || '');
    const [description, setDescription] = useState(ruler?.description || '');
    const [iconImageUrl, setIconImageUrl] = useState(ruler?.icon_image_url || '');

    const handleSave = () => {
        onUpdate(signSlug, planetSlug, description, iconImageUrl);
    };

    return (
        <div className="p-6 bg-slate-800 rounded-lg border border-slate-700">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">{signName}</h3>
                {hasEdits && (
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors text-sm"
                    >
                        Enregistrer
                    </button>
                )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        Planète Maîtresse
                    </label>
                    <select
                        value={planetSlug}
                        onChange={(e) => {
                            setPlanetSlug(e.target.value);
                            onEdit();
                        }}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-white focus:outline-none focus:border-blue-500"
                    >
                        <option value="">Sélectionner...</option>
                        {planets.map(p => (
                            <option key={p.slug} value={p.slug}>
                                {p.name_fr}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">URL Icône</label>
                    <input
                        type="text"
                        value={iconImageUrl}
                        onChange={(e) => {
                            setIconImageUrl(e.target.value);
                            onEdit();
                        }}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                        placeholder="https://..."
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => {
                            setDescription(e.target.value);
                            onEdit();
                        }}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                        rows={2}
                        placeholder="Ex: Maître du courage et de l'action"
                    />
                </div>

                {iconImageUrl && (
                    <div className="md:col-span-2 flex items-center gap-2">
                        <span className="text-sm text-slate-400">Aperçu :</span>
                        <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center border border-yellow-500/30 shadow-[0_0_20px_rgba(255,215,0,0.2)] overflow-hidden relative">
                            <Image
                                src={iconImageUrl}
                                alt="Icon Preview"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
