'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { createBrowserClient } from '@supabase/ssr';
import { ZodiacSignDecan, ZodiacPlanet } from '@/types/zodiac-enrichment';
import Image from 'next/image';

interface SignWithDecans {
    sign_slug: string;
    sign_name: string;
    decans: (ZodiacSignDecan & { planet?: ZodiacPlanet })[];
}

export default function DecansManagementPage() {
    const [signsWithDecans, setSignsWithDecans] = useState<SignWithDecans[]>([]);
    const [planets, setPlanets] = useState<ZodiacPlanet[]>([]);
    const [loading, setLoading] = useState(true);
    const [editedDecans, setEditedDecans] = useState<Set<string>>(new Set());

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
        setEditedDecans(new Set());

        // Charger les planètes
        const { data: planetsData } = await supabase
            .from('zodiac_planets')
            .select('*')
            .order('name_fr');

        if (planetsData) setPlanets(planetsData);

        // Charger les décans
        const { data: decansData } = await supabase
            .from('zodiac_sign_decans')
            .select('*, planet:zodiac_planets(*)')
            .order('sign_slug, decan');

        if (decansData) {
            const grouped = SIGNS.map(sign => ({
                sign_slug: sign.slug,
                sign_name: sign.name,
                decans: [1, 2, 3].map(decanNum => {
                    const existing = decansData.find(
                        (d: any) => d.sign_slug === sign.slug && d.decan === decanNum
                    );
                    return existing || {
                        id: `temp-${sign.slug}-${decanNum}`,
                        sign_slug: sign.slug,
                        decan: decanNum,
                        planet_slug: '',
                        description: '',
                        icon_image_url: '',
                    };
                }),
            }));
            setSignsWithDecans(grouped);
        }

        setLoading(false);
    }

    async function handleUpdateDecan(
        signSlug: string,
        decan: number,
        description: string,
        iconImageUrl: string
    ) {
        // Vérifier si le décan existe déjà
        const { data: existing } = await supabase
            .from('zodiac_sign_decans')
            .select('id')
            .eq('sign_slug', signSlug)
            .eq('decan', decan)
            .single();

        if (existing) {
            // Update
            await supabase
                .from('zodiac_sign_decans')
                .update({
                    description,
                    icon_image_url: iconImageUrl,
                })
                .eq('id', existing.id);
        } else {
            // Insert (ne devrait pas arriver car les données sont pré-créées)
            await supabase
                .from('zodiac_sign_decans')
                .insert({
                    sign_slug: signSlug,
                    decan,
                    // planet_slug doit être défini lors de la création initiale
                    description,
                    icon_image_url: iconImageUrl,
                });
        }

        await loadData();
    }

    function markAsEdited(signSlug: string, decan: number) {
        setEditedDecans(prev => new Set(prev).add(`${signSlug}-${decan}`));
    }

    function hasEdits(signSlug: string, decan: number) {
        return editedDecans.has(`${signSlug}-${decan}`);
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
                    <h1 className="text-3xl font-bold text-white">Décans</h1>
                </div>
                <p className="text-slate-400 pl-14">Configuration des 3 décans pour chaque signe (36 entrées).</p>
            </header>

            <div className="space-y-6">
                {signsWithDecans.map((sign) => (
                    <div key={sign.sign_slug} className="bg-slate-800 rounded-lg border border-slate-700 p-6">
                        <h2 className="text-xl font-semibold text-white mb-4">{sign.sign_name}</h2>

                        <div className="space-y-3">
                            {sign.decans.map((decan) => (
                                <DecanRow
                                    key={`${sign.sign_slug}-${decan.decan}`}
                                    signSlug={sign.sign_slug}
                                    decan={decan}
                                    onUpdate={handleUpdateDecan}
                                    onEdit={() => markAsEdited(sign.sign_slug, decan.decan)}
                                    hasEdits={hasEdits(sign.sign_slug, decan.decan)}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function DecanRow({
    signSlug,
    decan,
    onUpdate,
    onEdit,
    hasEdits,
}: {
    signSlug: string;
    decan: ZodiacSignDecan & { planet?: ZodiacPlanet };
    onUpdate: (signSlug: string, decan: number, description: string, iconImageUrl: string) => void;
    onEdit: () => void;
    hasEdits: boolean;
}) {
    const [description, setDescription] = useState(decan.description || '');
    const [iconImageUrl, setIconImageUrl] = useState(decan.icon_image_url || '');

    const handleSave = () => {
        onUpdate(signSlug, decan.decan, description, iconImageUrl);
    };

    const handleDescriptionChange = (value: string) => {
        setDescription(value);
        onEdit();
    };

    const handleIconChange = (value: string) => {
        setIconImageUrl(value);
        onEdit();
    };

    return (
        <div className="grid grid-cols-12 gap-4 items-start p-4 bg-slate-900 rounded">
            <div className="col-span-1 font-semibold text-slate-400 flex items-center">
                D{decan.decan}
            </div>

            <div className="col-span-3">
                <label className="block text-xs text-slate-500 mb-1">Planète (lecture seule)</label>
                <div className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded text-slate-400 text-sm">
                    {decan.planet?.name_fr || 'Non défini'}
                </div>
            </div>

            <div className="col-span-3">
                <label className="block text-xs text-slate-500 mb-1">URL Icône</label>
                <input
                    type="text"
                    value={iconImageUrl}
                    onChange={(e) => handleIconChange(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white text-sm focus:outline-none focus:border-blue-500"
                    placeholder="https://..."
                />
            </div>

            <div className="col-span-4">
                <label className="block text-xs text-slate-500 mb-1">Description</label>
                <textarea
                    value={description}
                    onChange={(e) => handleDescriptionChange(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white text-sm focus:outline-none focus:border-blue-500"
                    placeholder="Ex: Énergie pure et initiative"
                    rows={2}
                />
            </div>

            <div className="col-span-1 flex items-end">
                {hasEdits && (
                    <button
                        onClick={handleSave}
                        className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                        title="Enregistrer"
                    >
                        <Icon icon="mdi:check" width={16} />
                    </button>
                )}
            </div>
        </div>
    );
}
