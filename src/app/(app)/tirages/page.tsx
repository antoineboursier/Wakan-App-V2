import { createClient } from "@supabase/supabase-js";
import { PageBackground } from "@/components/layout/PageBackground";
import { DrawCardWrapper } from "./DrawCardWrapper";

// Use public anon key for public facing pages usually, but here server side fetching with URL is fine.
// Using process.env directly for Server Component.
const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // Using Service Role on server side to ensure we can read everything active
);

export const dynamic = 'force-dynamic';

export default async function TiragesListPage() {
    // 1. Fetch active draw types
    const { data: drawTypes, error } = await supabase
        .from('draw_types')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: true });

    if (error || !drawTypes) {
        return <div className="p-10 text-center text-red-400">Erreur de chargement des tirages.</div>;
    }

    return (
        <div className="min-h-screen relative font-body flex flex-col overflow-y-auto">
            <PageBackground imageSrc="/backgrounds/journal.png" alt="Bibliothèque mystique" />

            <div className="relative z-10 flex-1 flex flex-col items-center p-6 gap-8 max-w-5xl mx-auto w-full">

                <h1 className="sr-only">Liste des Tirages</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full justify-items-center">
                    {drawTypes.map((draw) => (
                        <div key={draw.id} className="w-full max-w-sm">
                            <DrawCardWrapper
                                slug={draw.slug}
                                title={draw.intro_title || draw.title}
                                subtitle={draw.intro_subtitle || draw.description || "Laisse l'univers te guider."}
                                imageUrl={draw.image_url}
                                btnMainLabel={draw.btn_main_label}
                                btnMainIcon={draw.btn_main_icon}
                                btnSecondLabel={draw.btn_second_label}
                                btnSecondIcon={draw.btn_second_icon}
                                btnSecondEnabled={draw.btn_second_enabled}
                                isMainPremium={draw.is_premium}
                                isSecondBtnPremium={draw.btn_second_is_premium}
                            />
                        </div>
                    ))}

                    {drawTypes.length === 0 && (
                        <div className="col-span-full text-center py-20 text-[var(--text-disabled)] italic">
                            Aucun oracle n'est disponible pour le moment.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
