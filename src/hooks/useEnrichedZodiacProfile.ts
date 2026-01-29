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

                // 2. Récupérer le maître principal
                const { data: rulerData } = await supabase
                    .from('zodiac_sign_planet_rulers')
                    .select('*, planet:zodiac_planets(*)')
                    .eq('sign_slug', signSlug)
                    .single();

                // 3. Récupérer la planète du décan
                const { data: decanData } = await supabase
                    .from('zodiac_sign_decans')
                    .select('*, planet:zodiac_planets(*)')
                    .eq('sign_slug', signSlug)
                    .eq('decan', decan)
                    .single();

                // 4. Récupérer la saison
                const { data: seasonData } = await supabase
                    .from('zodiac_sign_seasons')
                    .select('*')
                    .eq('sign_slug', signSlug)
                    .single();

                // Construire le profil enrichi
                const enrichedProfile: EnrichedZodiacProfile = {
                    sign_slug: signData.slug,
                    sign_name: signData.name_fr,
                    decan,
                    element: signData.element,
                    modality: signData.modality,
                    ruling_planet: rulerData?.planet,
                    decan_planet: decanData?.planet,
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
