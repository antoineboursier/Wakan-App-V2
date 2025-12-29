import { createClient } from "@supabase/supabase-js";
import { PageBackground } from "@/components/layout/PageBackground";
import { DrawCardWrapper } from "./DrawCardWrapper";

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const dynamic = 'force-dynamic';

export default async function TiragesListPage() {
    const { data: drawTypes, error } = await supabase
        .from('draw_types')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: true });

    if (error || !drawTypes) {
        return <div className="p-10 text-center text-red-400">Erreur de chargement des tirages.</div>;
    }

    return (
        <div id="tirages-list-page" className="page-wrapper mt-4">
            <PageBackground imageSrc="/backgrounds/journal.png" alt="Bibliothèque mystique" />

            <div id="tirages-list-content" className="page-content">
                <h1 className="sr-only">Liste des Tirages</h1>

                <div id="tirages-list-grid" className="card-grid">
                    {drawTypes.map((draw) => (
                        <DrawCardWrapper
                            key={draw.id}
                            slug={draw.slug}
                            title={draw.intro_subtitle || draw.title}
                            subtitle={draw.description || ""}
                            imageUrl={draw.image_url}
                            btnMainLabel={draw.btn_main_label}
                            btnMainIcon={draw.btn_main_icon}
                            btnSecondLabel={draw.btn_second_label}
                            btnSecondIcon={draw.btn_second_icon}
                            btnSecondEnabled={draw.btn_second_enabled}
                            isMainPremium={draw.is_premium}
                            isSecondBtnPremium={draw.btn_second_is_premium}
                            btnMainLimitEnabled={draw.btn_main_limit_enabled}
                            btnMainLimitCount={draw.btn_main_limit_count}
                        />
                    ))}

                    {drawTypes.length === 0 && (
                        <div className="empty-state">
                            Aucun oracle n'est disponible pour le moment.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
