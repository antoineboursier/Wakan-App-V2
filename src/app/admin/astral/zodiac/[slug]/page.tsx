'use client';

import { useState, useEffect, use, useRef } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { createBrowserClient } from '@supabase/ssr';
import { ZodiacSignPlanetRuler, ZodiacSignDecan, ZodiacSignSeason, ZodiacPlanet } from '@/types/zodiac-enrichment';
import Image from 'next/image';
import { uploadImage } from '@/app/admin/actions';
import { useRouter } from 'next/navigation';

interface SignData {
    // Infos de base du signe
    sign: any;
    // Enrichissement
    ruler: ZodiacSignPlanetRuler | null;
    masterPlanet: ZodiacPlanet | null;
    decans: (ZodiacSignDecan & { planet?: ZodiacPlanet })[];
    season: ZodiacSignSeason | null;
}

export default function EditZodiacSignPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = use(params);
    const signSlug = resolvedParams.slug;
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [data, setData] = useState<SignData | null>(null);
    const [hasChanges, setHasChanges] = useState(false);
    const [uploading, setUploading] = useState<'iconGlow' | 'heroImage' | 'rulerIcon' | 'decan1' | 'decan2' | 'decan3' | 'seasonIcon' | null>(null);

    // Refs for file inputs
    const iconInputRef = useRef<HTMLInputElement>(null);
    const heroInputRef = useRef<HTMLInputElement>(null);
    const rulerIconInputRef = useRef<HTMLInputElement>(null);
    const decan1InputRef = useRef<HTMLInputElement>(null);
    const decan2InputRef = useRef<HTMLInputElement>(null);
    const decan3InputRef = useRef<HTMLInputElement>(null);
    const seasonIconInputRef = useRef<HTMLInputElement>(null);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        loadData();
    }, [signSlug]);

    async function loadData() {
        setLoading(true);
        try {
            // 1. Charger les infos de base du signe
            const { data: signData } = await supabase
                .from('zodiac_signs')
                .select('*')
                .eq('slug', signSlug)
                .single();

            if (!signData) throw new Error('Signe non trouvé');

            // 2. Charger la planète maîtresse du signe
            const { data: rulerData } = await supabase
                .from('zodiac_sign_planet_rulers')
                .select('*, planet:zodiac_planets!master_planet_id(*)')
                .eq('sign_slug', signSlug)
                .single();

            // 3. Charger les 3 décans avec leurs planètes
            const { data: decansData } = await supabase
                .from('zodiac_sign_decans')
                .select('*, planet:zodiac_planets!planet_slug(*)')
                .eq('sign_slug', signSlug)
                .order('decan', { ascending: true });

            // 4. Charger la saison
            const { data: seasonData } = await supabase
                .from('zodiac_sign_seasons')
                .select('*')
                .eq('sign_slug', signSlug)
                .single();

            setData({
                sign: signData,
                ruler: rulerData || null,
                masterPlanet: rulerData?.planet || null,
                decans: decansData || [],
                season: seasonData || null,
            });
        } catch (error) {
            console.error('Erreur chargement:', error);
        } finally {
            setLoading(false);
        }
    }

    // Upload handler
    async function handleUpload(file: File, target: 'iconGlow' | 'heroImage' | 'rulerIcon' | 'decan1' | 'decan2' | 'decan3' | 'seasonIcon') {
        setUploading(target);
        try {
            const fd = new FormData();
            fd.append('file', file);
            const url = await uploadImage(fd);

            if (url && data) {
                // Update the appropriate field based on target
                switch (target) {
                    case 'iconGlow':
                        updateSign('icon_glow', url);
                        break;
                    case 'heroImage':
                        updateSign('hero_image', url);
                        break;
                    case 'rulerIcon':
                        updateRuler('icon_image_url', url);
                        break;
                    case 'decan1':
                        updateDecan(1, 'planet_icon_url', url);
                        break;
                    case 'decan2':
                        updateDecan(2, 'planet_icon_url', url);
                        break;
                    case 'decan3':
                        updateDecan(3, 'planet_icon_url', url);
                        break;
                    case 'seasonIcon':
                        updateSeason('icon_image_url', url);
                        break;
                }
            }
        } catch (e: any) {
            console.error('Erreur upload:', e);
            alert('Erreur lors de l\'upload: ' + (e.message || e));
        } finally {
            setUploading(null);
        }
    }

    // Trigger file input click
    function triggerUpload(ref: React.RefObject<HTMLInputElement | null>) {
        ref.current?.click();
    }

    async function handleSave() {
        if (!data) return;
        setSaving(true);
        try {
            // 1. Sauvegarder les infos de base du signe
            await supabase
                .from('zodiac_signs')
                .update({
                    display_name: data.sign.display_name,
                    description_main: data.sign.description_main,
                    icon_glow: data.sign.icon_glow,
                    hero_image: data.sign.hero_image,
                    master_planet_is_premium: data.sign.master_planet_is_premium,
                    decans_is_premium: data.sign.decans_is_premium,
                    season_is_premium: data.sign.season_is_premium,
                    updated_at: new Date().toISOString()
                })
                .eq('slug', signSlug);

            // 2. Sauvegarder la planète maîtresse (description + icône)
            if (data.ruler) {
                await supabase
                    .from('zodiac_sign_planet_rulers')
                    .update({
                        description: data.ruler.description,
                        icon_image_url: data.ruler.icon_image_url,
                    })
                    .eq('id', data.ruler.id);
            }

            // 3. Sauvegarder les décans (descriptions + icônes de planète)
            for (const decan of data.decans) {
                await supabase
                    .from('zodiac_sign_decans')
                    .update({
                        description: decan.description,
                        icon_image_url: decan.icon_image_url,
                        planet_description: decan.planet_description,
                        planet_icon_url: decan.planet_icon_url,
                    })
                    .eq('id', decan.id);
            }

            // 4. Sauvegarder la saison (contenu + icône)
            if (data.season) {
                await supabase
                    .from('zodiac_sign_seasons')
                    .update({
                        content: data.season.content,
                        icon_image_url: data.season.icon_image_url,
                    })
                    .eq('id', data.season.id);
            }

            setHasChanges(false);
            alert('✅ Modifications enregistrées !');
            await loadData(); // Reload pour confirmer
        } catch (error) {
            console.error('Erreur sauvegarde:', error);
            alert('❌ Erreur lors de la sauvegarde');
        } finally {
            setSaving(false);
        }
    }

    function updateSign(field: string, value: any) {
        if (!data) return;
        setData({
            ...data,
            sign: { ...data.sign, [field]: value }
        });
        setHasChanges(true);
    }

    function updateRuler(field: keyof ZodiacSignPlanetRuler, value: any) {
        if (!data?.ruler) return;
        setData({
            ...data,
            ruler: { ...data.ruler, [field]: value }
        });
        setHasChanges(true);
    }

    function updateDecan(decanNumber: number, field: keyof ZodiacSignDecan, value: any) {
        if (!data) return;
        setData({
            ...data,
            decans: data.decans.map(d =>
                d.decan === decanNumber ? { ...d, [field]: value } : d
            )
        });
        setHasChanges(true);
    }

    function updateSeason(field: keyof ZodiacSignSeason, value: any) {
        if (!data?.season) return;
        setData({
            ...data,
            season: { ...data.season, [field]: value }
        });
        setHasChanges(true);
    }

    if (loading) {
        return (
            <div className="max-w-5xl mx-auto">
                <div className="text-white p-10">Chargement...</div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="max-w-5xl mx-auto">
                <div className="text-red-400 p-10">Erreur : données introuvables</div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto pb-20">
            {/* Header */}
            <header className="mb-8 sticky top-0 bg-[var(--background-900)] z-10 pb-4 border-b border-slate-700">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/admin/astral/zodiac"
                            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                        >
                            <Icon icon="mdi:arrow-left" width={24} />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-white">{data.sign.display_name}</h1>
                            <p className="text-sm text-slate-400 font-mono">{signSlug}</p>
                        </div>
                    </div>

                    {/* Bouton Enregistrer */}
                    <div className="flex items-center gap-3">
                        {hasChanges && (
                            <button
                                onClick={() => {
                                    setHasChanges(false);
                                    loadData();
                                }}
                                className="px-4 py-2 rounded text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                            >
                                Annuler
                            </button>
                        )}
                        <button
                            onClick={handleSave}
                            disabled={!hasChanges || saving}
                            className={`px-6 py-2 rounded text-sm font-medium transition-colors ${hasChanges && !saving
                                ? 'bg-blue-600 hover:bg-blue-500 text-white'
                                : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                                }`}
                        >
                            {saving ? 'Enregistrement...' : 'Enregistrer'}
                        </button>
                    </div>
                </div>
            </header>

            <div className="space-y-8">
                {/* SECTION 1: INFORMATIONS DE BASE */}
                <section className="bg-slate-800 rounded-lg border border-slate-700 p-6">
                    <h2 className="text-xl font-semibold text-white mb-1 flex items-center gap-2">
                        <Icon icon="mdi:information" className="text-blue-400" width={24} />
                        Informations Générales
                        <span className="ml-2 px-2 py-0.5 rounded text-[10px] font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase tracking-wider">
                            Card Principale
                        </span>
                    </h2>
                    <p className="legend text-xs text-slate-400 mb-8">Ta nature profonde et ta manière d'entrer en relation avec le monde</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:divide-x-1 md:divide-solid md:divide-slate-700">
                        {/* COLONNE GAUCHE: Champs texte */}
                        <div className="space-y-4 md:pr-10">

                            {/* Hero Image */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Hero Image
                                </label>
                                <div className="flex flex-col gap-4">
                                    {/* Preview Large */}
                                    <div className="relative w-full h-64 bg-slate-900 border border-slate-600 rounded-lg overflow-hidden flex items-center justify-center">
                                        {data.sign.hero_image ? (
                                            <Image
                                                src={data.sign.hero_image}
                                                alt="Hero Preview"
                                                fill
                                                className="object-contain"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center text-slate-600">
                                                <Icon icon="mdi:image-off-outline" width={48} />
                                                <span className="text-sm mt-2">Aucune image</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={data.sign.hero_image || ''}
                                            onChange={(e) => updateSign('hero_image', e.target.value)}
                                            className="flex-1 bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                                            placeholder="URL de l'image..."
                                        />
                                        <input
                                            type="file"
                                            ref={heroInputRef}
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], 'heroImage')}
                                        />
                                        <button
                                            type="button"
                                            disabled={uploading === 'heroImage'}
                                            onClick={() => triggerUpload(heroInputRef)}
                                            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm transition-colors flex items-center gap-2"
                                        >
                                            <Icon icon="mdi:upload" /> {uploading === 'heroImage' ? '...' : 'Charger une image'}
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* COLONNE DROITE: Champs images */}
                        <div className="space-y-6">

                            {/* Icône */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Icône
                                </label>
                                <div className="flex items-start gap-4">
                                    {/* Preview */}
                                    <div className="w-16 h-16 bg-slate-900 border border-slate-600 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 relative">
                                        {data.sign.icon_glow ? (
                                            data.sign.icon_glow.startsWith('http') || data.sign.icon_glow.startsWith('/') ? (
                                                <Image
                                                    src={data.sign.icon_glow}
                                                    alt="Icon"
                                                    fill
                                                    className="object-contain p-2"
                                                />
                                            ) : (
                                                <Icon icon={data.sign.icon_glow} className="text-2xl text-white" />
                                            )
                                        ) : (
                                            <Icon icon="mdi:image-off-outline" className="text-slate-600" />
                                        )}
                                    </div>

                                    <div className="flex-1 space-y-2">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={data.sign.icon_glow || ''}
                                                onChange={(e) => updateSign('icon_glow', e.target.value)}
                                                className="flex-1 bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                                                placeholder="URL ou ID Iconify..."
                                            />
                                            <input
                                                type="file"
                                                ref={iconInputRef}
                                                className="hidden"
                                                accept="image/*"
                                                onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], 'iconGlow')}
                                            />
                                            <button
                                                type="button"
                                                disabled={uploading === 'iconGlow'}
                                                onClick={() => triggerUpload(iconInputRef)}
                                                className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm transition-colors flex items-center gap-2"
                                            >
                                                <Icon icon="mdi:upload" /> {uploading === 'iconGlow' ? '...' : 'Charger'}
                                            </button>
                                        </div>
                                        <p className="text-xs text-slate-500">Formats: PNG, WEBP, SVG. Recommandé: Transparent, 64x64px.</p>
                                    </div>
                                </div>
                            </div>



                            {/* Description principale */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">
                                    Description principale
                                </label>
                                <textarea
                                    value={data.sign.description_main || ''}
                                    onChange={(e) => updateSign('description_main', e.target.value)}
                                    rows={4}
                                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                                />
                            </div>


                        </div>
                    </div>
                </section>

                {/* SECTION 2: PLANÈTE MAÎTRESSE */}
                <section className="bg-slate-800 rounded-lg border border-slate-700 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                            <Icon icon="mdi:orbit" className="text-yellow-400" width={24} />
                            Planète Maîtresse
                            <span className="ml-2 px-2 py-0.5 rounded text-[10px] font-medium bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 uppercase tracking-wider">
                                Card Graphique
                            </span>
                            <div className="ml-2">
                                {/* Nom de la planète (lecture seule) */}
                                {data.masterPlanet && (
                                    <div className="px-3 py-1 bg-slate-900 rounded">
                                        <p className="text-white font-semibold text-lg">{data.masterPlanet.name_fr}</p>
                                    </div>
                                )}

                            </div>
                        </h2>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={data.sign.master_planet_is_premium || false}
                                onChange={(e) => updateSign('master_planet_is_premium', e.target.checked)}
                                className="w-4 h-4 rounded border-slate-600 bg-slate-900 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
                            />
                            <span className="text-xs text-slate-400">Option Premium</span>
                        </label>
                    </div>
                    <p className="legend text-xs text-slate-400 mb-8">Ton rythme intérieur et tes réactions instinctives</p>

                    <div className="">

                        {/* Icône + Description */}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:divide-x-1 md:divide-solid md:divide-slate-700">
                            {/* COLONNE GAUCHE: Image (Style Hero) */}
                            <div className="space-y-4 md:pr-10">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Illustration Planète
                                    </label>
                                    <div className="flex flex-col gap-4">
                                        {/* Preview Large */}
                                        <div className="relative w-full h-64 bg-slate-900 border border-slate-600 rounded-lg overflow-hidden flex items-center justify-center">
                                            {data.ruler?.icon_image_url ? (
                                                <img
                                                    src={data.ruler.icon_image_url}
                                                    alt="Planète Preview"
                                                    className="object-contain w-full h-full"
                                                />
                                            ) : (
                                                <div className="flex flex-col items-center text-slate-600">
                                                    <Icon icon="mdi:image-off-outline" width={48} />
                                                    <span className="text-sm mt-2">Aucune image</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={data.ruler?.icon_image_url || ''}
                                                onChange={(e) => updateRuler('icon_image_url', e.target.value)}
                                                className="flex-1 bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                                                placeholder="URL de l'image..."
                                            />
                                            <input
                                                type="file"
                                                ref={rulerIconInputRef}
                                                className="hidden"
                                                accept="image/*"
                                                onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], 'rulerIcon')}
                                            />
                                            <button
                                                type="button"
                                                disabled={uploading === 'rulerIcon'}
                                                onClick={() => triggerUpload(rulerIconInputRef)}
                                                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm transition-colors flex items-center gap-2"
                                            >
                                                <Icon icon="mdi:upload" /> {uploading === 'rulerIcon' ? '...' : 'Charger'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* COLONNE DROITE: Description */}
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        value={data.ruler?.description || ''}
                                        onChange={(e) => updateRuler('description', e.target.value)}
                                        rows={12}
                                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                                        placeholder="Description de la planète maîtresse pour ce signe..."
                                    />
                                </div>
                            </div>
                        </div>

                    </div>
                </section>

                {/* SECTION 3: LES 3 DÉCANS */}
                <section className="bg-slate-800 rounded-lg border border-slate-700 p-6">
                    <div className="flex items-center justify-between mb-1">
                        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                            <Icon icon="mdi:circle-slice-3" className="text-purple-400" width={24} />
                            Décans
                        </h2>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={data.sign.decans_is_premium || false}
                                onChange={(e) => updateSign('decans_is_premium', e.target.checked)}
                                className="w-4 h-4 rounded border-slate-600 bg-slate-900 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
                            />
                            <span className="text-xs text-slate-400">Option Premium</span>
                        </label>
                    </div>
                    <p className="legend text-xs text-slate-400 mb-8">Ta nuance et ta façon de vivre intérieure</p>

                    <div className="space-y-4">
                        {data.decans.map((decan) => (
                            <div key={decan.decan} className="p-4 bg-slate-900 rounded">
                                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs">
                                        {decan.decan}
                                    </span>
                                    Décan {decan.decan}
                                </h3>

                                {/* Grid 2 colonnes */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:divide-x-1 md:divide-solid md:divide-slate-700">
                                    {/* COLONNE GAUCHE: Description du décan */}
                                    <div className="md:pr-6">
                                        <label className="block text-xs font-medium text-slate-300 mb-2">
                                            Description du décan
                                        </label>
                                        <textarea
                                            value={decan.description || ''}
                                            onChange={(e) => updateDecan(decan.decan, 'description', e.target.value)}
                                            rows={10}
                                            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500"
                                            placeholder="Description de ce décan..."
                                        />
                                    </div>

                                    {/* COLONNE DROITE: Planète */}
                                    <div className="space-y-4">
                                        {/* Nom de la planète (lecture seule) */}
                                        {decan.planet && (
                                            <div className="flex items-center justify-between mb-8">
                                                <div >
                                                    <label className="block text-lg font-bold text-slate-200">
                                                        Planète du décan
                                                    </label>
                                                    <p className="legend text-xs text-slate-400 mb-2">L'influence sur ton expression d'énergie au quotidien</p>
                                                </div>
                                                <div className="px-3 py-1 bg-slate-800 rounded">
                                                    <p className="text-white font-semibold text-lg">{decan.planet.name_fr}</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Icône de la planète */}
                                        <div>
                                            <label className="block text-xs font-medium text-slate-300 mb-2">
                                                Icône de la planète
                                            </label>
                                            <div className="flex items-center gap-3 bg-slate-800 border border-slate-600 rounded-lg p-2">
                                                <div className="w-12 h-12 bg-slate-700 rounded flex-shrink-0 overflow-hidden border border-slate-600">
                                                    {decan.planet_icon_url ? (
                                                        <img src={decan.planet_icon_url} className="w-full h-full object-cover" alt="Icône planète" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-600">
                                                            <Icon icon="mdi:image-off" width={16} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={decan.planet_icon_url || ''}
                                                        onChange={(e) => updateDecan(decan.decan, 'planet_icon_url', e.target.value)}
                                                        placeholder="URL de l'image..."
                                                        className="flex-1 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-blue-500"
                                                    />
                                                    <input
                                                        type="file"
                                                        ref={decan.decan === 1 ? decan1InputRef : decan.decan === 2 ? decan2InputRef : decan3InputRef}
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], decan.decan === 1 ? 'decan1' : decan.decan === 2 ? 'decan2' : 'decan3')}
                                                    />
                                                    <button
                                                        type="button"
                                                        disabled={uploading === `decan${decan.decan}` as any}
                                                        onClick={() => triggerUpload(decan.decan === 1 ? decan1InputRef : decan.decan === 2 ? decan2InputRef : decan3InputRef)}
                                                        className="px-3 py-1 bg-slate-600 hover:bg-slate-500 text-white rounded text-xs transition-colors flex items-center gap-1 whitespace-nowrap"
                                                    >
                                                        <Icon icon="mdi:upload" width={14} /> {uploading === `decan${decan.decan}` ? '...' : 'Upload'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Description de la planète */}
                                        <div>
                                            <label className="block text-xs font-medium text-slate-300 mb-2">
                                                Description de la planète
                                            </label>
                                            <textarea
                                                value={decan.planet_description || ''}
                                                onChange={(e) => updateDecan(decan.decan, 'planet_description', e.target.value)}
                                                rows={3}
                                                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500"
                                                placeholder="Description de la planète pour ce décan..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}                   </div>


                </section>

                {/* SECTION 4: SAISON ASTROLOGIQUE */}
                <section className="bg-slate-800 rounded-lg border border-slate-700 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                            <Icon icon="mdi:weather-partly-cloudy" className="text-cyan-400" width={24} />
                            Saison Astrologique
                            <span className="ml-2 px-2 py-0.5 rounded text-[10px] font-medium bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase tracking-wider">
                                Card Simple
                            </span>
                            <div className="ml-2">
                                {/* Nom de la saison (lecture seule) */}
                                {data.season && (
                                    <div className="px-3 py-1 bg-slate-900 rounded">
                                        <p className="text-white font-semibold text-lg">{data.season.title_fr}</p>
                                    </div>
                                )}

                            </div>
                        </h2>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={data.sign.season_is_premium || false}
                                onChange={(e) => updateSign('season_is_premium', e.target.checked)}
                                className="w-4 h-4 rounded border-slate-600 bg-slate-900 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
                            />
                            <span className="text-xs text-slate-400">Option Premium</span>
                        </label>
                    </div>
                    <p className="legend text-xs text-slate-400 mb-8">Ta situation énergétique dans le grand cycle du vivant</p>

                    <div className="">

                        {/* Icône + Description */}

                        <div className="space-y-4">
                            {/* Icône de la saison */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Icône
                                </label>
                                <div className="flex items-center gap-4 bg-slate-900 border border-slate-600 rounded-lg p-2">
                                    <div className="w-16 h-16 bg-slate-800 rounded flex-shrink-0 overflow-hidden border border-slate-700">
                                        {data.season?.icon_image_url ? (
                                            <img src={data.season.icon_image_url} className="w-full h-full object-cover" alt="Icône saison" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-600">
                                                <Icon icon="mdi:image-off" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 flex gap-2">
                                        <input
                                            type="text"
                                            value={data.season?.icon_image_url || ''}
                                            onChange={(e) => updateSeason('icon_image_url', e.target.value)}
                                            placeholder="URL de l'image..."
                                            className="flex-1 bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                                        />
                                        <input
                                            type="file"
                                            ref={seasonIconInputRef}
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], 'seasonIcon')}
                                        />
                                        <button
                                            type="button"
                                            disabled={uploading === 'seasonIcon'}
                                            onClick={() => triggerUpload(seasonIconInputRef)}
                                            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm transition-colors flex items-center gap-2 whitespace-nowrap"
                                        >
                                            <Icon icon="mdi:upload" /> {uploading === 'seasonIcon' ? '...' : 'Charger'}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">
                                    Description
                                </label>
                                <textarea
                                    value={data.season?.content || ''}
                                    onChange={(e) => updateSeason('content', e.target.value)}
                                    rows={3}
                                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                                    placeholder="Description de la saison pour ce signe..."
                                />
                            </div>
                        </div>

                    </div>
                </section>
            </div>
        </div>
    );
}
