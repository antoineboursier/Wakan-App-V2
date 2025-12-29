import { createClient } from "@supabase/supabase-js";
import { DrawCardWrapper } from "../DrawCardWrapper";
import { PageBackground } from "@/components/layout/PageBackground";
import { BackButton } from "@/components/ui/BackButton";
import { DrawResultClient } from "@/components/draws/DrawResultClient";
import { ComplexDrawDisplay } from "@/components/draws/ComplexDrawDisplay";
import { ShareButton } from "@/components/ui/ShareButton";

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const dynamic = 'force-dynamic';

export default async function DrawPage({
    params,
    searchParams
}: {
    params: Promise<{ slug: string }>,
    searchParams: Promise<{ ids?: string; r_ids?: string; animate?: string; d_ids?: string; complex?: string }>
}) {
    const slug = (await params).slug;
    const { ids, r_ids, animate, d_ids, complex } = await searchParams;

    // Fetch Draw Type
    const { data: drawType } = await supabase
        .from('draw_types')
        .select('*')
        .eq('slug', slug)
        .single();

    if (!drawType) {
        return <div className="p-10 text-center text-red-400">Tirage introuvable</div>;
    }

    // Fetch Items if IDs provided (Result Mode)
    let resultItems: any[] = [];
    let distractorImages: string[] = [];
    let isSimpleDraw = false;
    let isComplexDraw = complex === 'true';

    if (ids) {
        const idList = ids.split(',');
        const reversedList = r_ids ? r_ids.split(',') : [];

        // Simple draw = 1 card only
        isSimpleDraw = idList.length === 1;

        const { data } = await supabase
            .from('draw_items')
            .select('*')
            .in('id', idList);

        if (data && data.length > 0) {
            // Map items in the order they were drawn (preserve order from idList)
            resultItems = idList.map(id => {
                const item = data.find(d => d.id === id);
                if (!item) return null;
                const isReversed = reversedList.includes(item.id);
                return {
                    ...item,
                    isReversed,
                    displayDescription: isReversed
                        ? (item.reversed_description || item.long_description)
                        : item.long_description,
                };
            }).filter(Boolean);
        }

        // Fetch Distractors (if animating)
        if (d_ids) {
            const distractorList = d_ids.split(',');
            const { data: dData } = await supabase
                .from('draw_items')
                .select('image_url')
                .in('id', distractorList);

            if (dData) distractorImages = dData.map(d => d.image_url).filter(Boolean);
        }
    }

    // Get first result item for simple draw display
    const resultItem = resultItems.length > 0 ? resultItems[0] : null;

    // Data for share
    const shareTitle = resultItem
        ? (isComplexDraw
            ? `Mon tirage complet : ${resultItems.map(i => i.name).join(', ')}`
            : `Mon tirage : ${resultItem.name}`)
        : drawType.title;
    const shareText = resultItem
        ? (isComplexDraw
            ? `J'ai tiré ${resultItems.length} valeurs - ${drawType.intro_subtitle || drawType.title}`
            : `J'ai tiré "${resultItem.name}" - ${drawType.intro_subtitle || drawType.title}`)
        : `Découvre ${drawType.title}`;

    return (
        <div id="draw-detail-page" className="page-wrapper items-center p-6">
            <PageBackground imageSrc={drawType.background_image_url || "/backgrounds/journal.png"} alt={drawType.title} />

            <div id="draw-detail-content" className="page-content-narrow">

                {/* Header: Back + Share */}
                <div id="draw-detail-header" className="page-header-bar">
                    <BackButton />
                    {resultItem && (
                        <ShareButton
                            title={shareTitle}
                            text={shareText}
                        />
                    )}
                </div>

                {/* Content */}
                <div id="draw-detail-main" className="w-full flex justify-center">
                    {resultItem ? (
                        isComplexDraw && resultItems.length > 1 ? (
                            // Complex Draw Display - Multiple items
                            <ComplexDrawDisplay
                                subtitle={drawType.intro_subtitle || drawType.title}
                                items={resultItems.map(item => ({
                                    id: item.id,
                                    name: item.name,
                                    imageUrl: item.image_url,
                                    description: item.displayDescription,
                                    isReversed: item.isReversed
                                }))}
                                distractorImages={distractorImages}
                                shouldAnimate={animate === 'true'}
                            />
                        ) : (
                            // Simple Draw Display - Single item
                            <DrawResultClient
                                subtitle={drawType.intro_subtitle || drawType.title}
                                itemName={resultItem.name}
                                itemImageUrl={resultItem.image_url}
                                itemDescription={resultItem.displayDescription}
                                distractorImages={distractorImages}
                                shouldAnimate={animate === 'true'}
                                isReversed={resultItem.isReversed}
                                slug={slug}
                                btnSecondEnabled={drawType.btn_second_enabled}
                                btnSecondLabel={drawType.btn_second_label}
                                btnSecondIcon={drawType.btn_second_icon}
                                isSimpleDraw={isSimpleDraw}
                                isSecondBtnPremium={drawType.btn_second_is_premium}
                                firstItemId={resultItem.id}
                                btnSecondDrawCount={drawType.btn_second_draw_count ?? 2}
                                btnSecondIncludeFirst={drawType.btn_second_include_first ?? false}
                            />
                        )
                    ) : (
                        <div className="w-full">
                            <DrawCardWrapper
                                slug={drawType.slug}
                                title={drawType.intro_title || drawType.title}
                                subtitle={drawType.intro_subtitle || drawType.description || "..."}
                                imageUrl={drawType.image_url}
                                btnMainLabel={drawType.btn_main_label}
                                btnMainIcon={drawType.btn_main_icon}
                                btnSecondLabel={drawType.btn_second_label}
                                btnSecondIcon={drawType.btn_second_icon}
                                btnSecondEnabled={drawType.btn_second_enabled}
                                isMainPremium={drawType.is_premium}
                                isSecondBtnPremium={drawType.btn_second_is_premium}
                                btnMainLimitEnabled={drawType.btn_main_limit_enabled}
                                btnMainLimitCount={drawType.btn_main_limit_count}
                                btnSecondDrawCount={drawType.btn_second_draw_count}
                                btnSecondIncludeFirst={drawType.btn_second_include_first}
                                standalone={true}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

