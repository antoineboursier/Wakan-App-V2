"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

export interface AstralModuleConfigDB {
    id: string;
    state: string;
    order: number;
    title: string;
    short_description: string;
    icon: string;
    hero_image_url: string;
    background_image_url: string;
    features: any;
    theme: any;
}

export function useAstralModule(moduleId: string) {
    const [moduleConfig, setModuleConfig] = useState<AstralModuleConfigDB | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        async function fetchModule() {
            try {
                const supabase = createBrowserClient(
                    process.env.NEXT_PUBLIC_SUPABASE_URL!,
                    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
                );

                const { data, error } = await supabase
                    .from('astral_modules')
                    .select('*')
                    .eq('id', moduleId)
                    .single();

                if (data && !error && isMounted) {
                    setModuleConfig(data);
                }
            } catch (err) {
                console.error("Failed to fetch astral module content", err);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }

        fetchModule();

        return () => { isMounted = false; };
    }, [moduleId]);

    return { moduleConfig, isLoading };
}
