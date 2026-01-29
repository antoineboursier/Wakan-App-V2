"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { ZodiacSignSlug } from "@/utils/astro/zodiacCalculator";
import { ZODIAC_SIGNS_CONTENT, BoContent } from "@/data/zodiacContent";

export function useZodiacSignContent(slug: ZodiacSignSlug) {
    // Start with hardcoded data for instant render (optimistic/fallback)
    const [content, setContent] = useState<BoContent>(ZODIAC_SIGNS_CONTENT[slug]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        async function fetchContent() {
            try {
                const supabase = createBrowserClient(
                    process.env.NEXT_PUBLIC_SUPABASE_URL!,
                    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
                );

                const { data, error } = await supabase
                    .from('zodiac_signs')
                    .select('display_name, description_main, icon_glow, hero_image, background_image')
                    .eq('slug', slug)
                    .single();

                if (data && !error && isMounted) {
                    setContent({
                        displayName: data.display_name,
                        descriptionMain: data.description_main || '',
                        iconGlow: data.icon_glow,
                        heroImage: data.hero_image,
                        backgroundImage: data.background_image
                    });
                }
            } catch (err) {
                console.error("Failed to fetch dynamic zodiac content", err);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }

        fetchContent();

        return () => { isMounted = false; };
    }, [slug]);

    return { content, isLoading };
}
