'use server';

import { createClient } from "@supabase/supabase-js";
import { DrawItem, DrawType } from "@/types/draws";

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export type DrawResultItem = DrawItem & { is_reversed?: boolean };

export type DrawResult = {
    winners: DrawResultItem[];
    distractors: DrawResultItem[];
};

export type PerformDrawOptions = {
    excludeItemIds?: string[]; // Item IDs to exclude from the draw pool
};

export async function performDraw(
    slug: string,
    count: number,
    options: PerformDrawOptions = {}
): Promise<DrawResult> {
    const { excludeItemIds = [] } = options;

    // 1. Get Draw Type ID
    const { data: drawType, error: typeError } = await supabase
        .from('draw_types')
        .select('id')
        .eq('slug', slug)
        .single();

    if (typeError || !drawType) throw new Error("Draw type not found");

    // 2. Get All Active Items
    const { data: items, error: itemsError } = await supabase
        .from('draw_items')
        .select('*')
        .eq('draw_type_id', drawType.id)
        .eq('is_active', true);

    if (itemsError || !items || items.length === 0) throw new Error("No items found");

    // 3. Build Deck (expanding reversible items), excluding specified IDs
    const deck: DrawResultItem[] = [];
    items.forEach((item: DrawItem) => {
        // Skip if this item should be excluded
        if (excludeItemIds.includes(item.id)) return;

        // Always add Upright
        deck.push({ ...item, is_reversed: false });
        // Add Reversed if applicable
        if (item.reversed_description) {
            deck.push({ ...item, is_reversed: true });
        }
    });

    if (deck.length === 0) throw new Error("No items available after exclusions");

    // 4. Pick Winners
    const shuffled = [...deck].sort(() => 0.5 - Math.random());
    const winners = shuffled.slice(0, Math.min(count, deck.length));

    // 5. Pick Distractors (random items for animation) - use full items pool
    const distractors: DrawResultItem[] = [];
    const fullDeck: DrawResultItem[] = [];
    items.forEach((item: DrawItem) => {
        fullDeck.push({ ...item, is_reversed: false });
        if (item.reversed_description) {
            fullDeck.push({ ...item, is_reversed: true });
        }
    });

    while (distractors.length < 15) {
        distractors.push(...fullDeck.sort(() => 0.5 - Math.random()).slice(0, 5));
    }

    return {
        winners,
        distractors: distractors.slice(0, 15)
    };
}

