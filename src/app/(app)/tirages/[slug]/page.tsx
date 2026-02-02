import { createClient } from "@supabase/supabase-js";
import { DrawPageClient } from "./DrawPageClient";

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
        <DrawPageClient
            drawType={drawType}
            resultItems={resultItems}
            resultItem={resultItem}
            isComplexDraw={isComplexDraw}
            isSimpleDraw={isSimpleDraw}
            distractorImages={distractorImages}
            slug={slug}
            shouldAnimate={animate === 'true'}
            shareTitle={shareTitle}
            shareText={shareText}
        />
    );
}
