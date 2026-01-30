import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { EnrichedZodiacProfile } from '@/types/zodiac-enrichment';

export function useEnrichedZodiacProfile(signSlug: string, decan: number) {
    const [profile, setProfile] = useState<EnrichedZodiacProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        async function loadEnrichedProfile() {
            if (!signSlug || !decan) {
                setLoading(false);
                return;
            }

            setLoading(true);

            try {
                // 1. Récupérer le signe de base
                const { data: signData } = await supabase
                    .from('zodiac_signs')
                    .select('*')
                    .eq('slug', signSlug)
                    .single();

                if (!signData) {
                    setLoading(false);
                    return;
                }

                // 2. Récupérer le maître principal avec description custom
                const { data: rulerData } = await supabase
                    .from('zodiac_sign_planet_rulers')
                    .select('description, icon_image_url, planet:zodiac_planets(*)')
                    .eq('sign_slug', signSlug)
                    .single();

                // 3. Récupérer la planète du décan avec description custom
                const { data: decanData } = await supabase
                    .from('zodiac_sign_decans')
                    .select('description, icon_image_url, planet_description, planet_icon_url, planet:zodiac_planets(*)')
                    .eq('sign_slug', signSlug)
                    .eq('decan', decan)
                    .single();

                // 4. Récupérer la saison
                const { data: seasonData } = await supabase
                    .from('zodiac_sign_seasons')
                    .select('*')
                    .eq('sign_slug', signSlug)
                    .single();

                // Construire le profil enrichi avec descriptions personnalisées
                const enrichedProfile: EnrichedZodiacProfile = {
                    sign_slug: signData.slug,
                    sign_name: signData.name_fr,
                    decan,
                    element: signData.element,
                    modality: signData.modality,

                    // Planète maîtresse avec description + icône personnalisées
                    ruling_planet: rulerData?.planet ? ({
                        ...rulerData.planet,
                        description: rulerData.description,
                        icon_image_url: rulerData.icon_image_url
                    } as any) : undefined,

                    // Infos du décan lui-même
                    decan_data: decanData ? {
                        description: decanData.description,
                        icon_image_url: decanData.icon_image_url
                    } : undefined,

                    // Planète du décan avec description + icône personnalisées (priorité aux champs spécifiques du décan)
                    decan_planet: decanData?.planet ? ({
                        ...decanData.planet,
                        description: decanData.planet_description || decanData.planet.description, // Fallback si vide
                        icon_image_url: decanData.planet_icon_url || decanData.planet.icon_image_url
                    } as any) : undefined,

                    season: seasonData,
                    archetype: signData.archetype,
                    keywords: signData.keywords,
                };

                setProfile(enrichedProfile);
            } catch (error) {
                console.error('Error loading enriched zodiac profile:', error);
            } finally {
                setLoading(false);
            }
        }

        loadEnrichedProfile();
    }, [signSlug, decan, supabase]);

    return { profile, loading };
}
