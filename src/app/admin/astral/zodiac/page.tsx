import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Link from "next/link";
import { Icon } from "@iconify/react";
import Image from "next/image";

import { GlobalModuleSettingsForm } from "@/components/admin/GlobalModuleSettingsForm";

export const dynamic = 'force-dynamic';

export default async function ZodiacAdminPage() {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value
                },
            },
        }
    );

    // Fetch Global Config
    const { data: moduleConfig } = await supabase
        .from('astral_modules')
        .select('*')
        .eq('id', 'zodiac')
        .single();

    // Fetch Signs
    const { data: signs, error } = await supabase
        .from('zodiac_signs')
        .select('*')
        .order('display_name', { ascending: true });

    if (error) {
        return (
            <div className="p-8 text-center">
                <p className="text-red-400">Erreur lors du chargement des signes : {error.message}</p>
                <p className="text-sm text-slate-500 mt-2">Avez-vous appliqué la migration "zodiac_signs" ?</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto">
            <header className="mb-8 flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-4 mb-2">
                        <Link href="/admin/astral" className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors">
                            <Icon icon="mdi:arrow-left" width={24} />
                        </Link>
                        <h1 className="text-3xl font-bold text-white">Contenu Zodiacal</h1>
                    </div>
                    <p className="text-slate-400 pl-14">Gérez les descriptions et images des 12 signes du zodiaque.</p>
                </div>
            </header>


            {/* Global Settings */}
            <GlobalModuleSettingsForm moduleId="zodiac" initialConfig={moduleConfig} />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {signs?.map((sign: any) => (
                    <Link
                        key={sign.slug}
                        href={`/admin/astral/zodiac/${sign.slug}`}
                        className="group bg-slate-800 rounded-xl border border-slate-700 overflow-hidden hover:border-slate-500 hover:shadow-lg transition-all"
                    >
                        {/* Preview Image */}
                        <div className="relative h-32 bg-slate-900 w-full overflow-hidden">
                            {sign.hero_image ? (
                                <Image
                                    src={sign.hero_image}
                                    alt={sign.display_name}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-700">
                                    <Icon icon="mdi:image-off-outline" width={32} />
                                </div>
                            )}
                            {/* Icon overlay */}
                            <div className="absolute top-2 right-2 w-10 h-10 bg-slate-800/80 backdrop-blur rounded-full flex items-center justify-center border border-slate-600">
                                <Icon icon={sign.icon_glow || 'mdi:star'} className="text-yellow-400 text-xl" />
                            </div>
                        </div>

                        <div className="p-4">
                            <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                                {sign.display_name}
                            </h3>
                            <p className="text-slate-400 text-sm mt-2 line-clamp-2">
                                {sign.description_main || "Aucune description..."}
                            </p>

                            <div className="mt-4 pt-4 border-t border-slate-700/50 flex items-center justify-between text-xs text-slate-500">
                                <span>Slug: {sign.slug}</span>
                                <span className="group-hover:translate-x-1 transition-transform flex items-center gap-1 text-blue-400">
                                    Éditer <Icon icon="mdi:arrow-right" />
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
