'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { createBrowserClient } from '@supabase/ssr';
import { ZodiacSignSeason } from '@/types/zodiac-enrichment';
import Image from 'next/image';

interface SignWithSeason {
    sign_slug: string;
    sign_name: string;
    season: ZodiacSignSeason | null;
}

export default function SeasonsManagementPage() {
    const [signsWithSeasons, setSignsWithSeasons] = useState<SignWithSeason[]>([]);
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

        const { data: seasonsData } = await supabase
            .from('zodiac_sign_seasons')
            .select('*')
            .order('sign_slug');

        if (seasonsData) {
            const grouped = SIGNS.map(sign => ({
                sign_slug: sign.slug,
                sign_name: sign.name,
                season: seasonsData.find((s: any) => s.sign_slug === sign.slug) || null,
            }));
            setSignsWithSeasons(grouped);
        }

        setLoading(false);
    }

    async function handleUpdateSeason(
        signSlug: string,
        titleFr: string,
        content: string,
        iconImageUrl: string
    ) {
        // Vérifier si la saison existe déjà
        const { data: existing } = await supabase
            .from('zodiac_sign_seasons')
            .select('id')
            .eq('sign_slug', signSlug)
            .single();

        if (existing) {
            // Update
            await supabase
                .from('zodiac_sign_seasons')
                .update({
                    title_fr: titleFr,
                    content,
                    icon_image_url: iconImageUrl,
                })
                .eq('id', existing.id);
        } else {
            // Insert
            await supabase
                .from('zodiac_sign_seasons')
                .insert({
                    sign_slug: signSlug,
                    title_fr: titleFr,
                    content,
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
                    <h1 className="text-3xl font-bold text-white">Saisons Astrologiques</h1>
                </div>
                <p className="text-slate-400 pl-14">Configuration des saisons pour chaque signe.</p>
            </header>

            <div className="space-y-4">
                {signsWithSeasons.map((sign) => (
                    <SeasonRow
                        key={sign.sign_slug}
                        signSlug={sign.sign_slug}
                        signName={sign.sign_name}
                        season={sign.season}
                        onUpdate={handleUpdateSeason}
                        onEdit={() => setEditedSigns(prev => new Set(prev).add(sign.sign_slug))}
                        hasEdits={editedSigns.has(sign.sign_slug)}
                    />
                ))}
            </div>
        </div>
    );
}

function SeasonRow({
    signSlug,
    signName,
    season,
    onUpdate,
    onEdit,
    hasEdits,
}: {
    signSlug: string;
    signName: string;
    season: ZodiacSignSeason | null;
    onUpdate: (signSlug: string, title: string, content: string, iconImageUrl: string) => void;
    onEdit: () => void;
    hasEdits: boolean;
}) {
    const [titleFr, setTitleFr] = useState(season?.title_fr || '');
    const [content, setContent] = useState(season?.content || '');
    const [iconImageUrl, setIconImageUrl] = useState(season?.icon_image_url || '');

    const handleSave = () => {
        onUpdate(signSlug, titleFr, content, iconImageUrl);
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
                    <label className="block text-sm font-medium text-slate-300 mb-1">Titre affiché</label>
                    <input
                        type="text"
                        value={titleFr}
                        onChange={(e) => {
                            setTitleFr(e.target.value);
                            onEdit();
                        }}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                        placeholder="Ex: Début du printemps"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">URL Icône</label>
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
                    <label className="block text-sm font-medium text-slate-300 mb-1">Contenu</label>
                    <textarea
                        value={content}
                        onChange={(e) => {
                            setContent(e.target.value);
                            onEdit();
                        }}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                        placeholder="Ex: Renaissance et nouveaux départs"
                        rows={2}
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
