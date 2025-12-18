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

export async function performDraw(slug: string, count: number): Promise<DrawResult> {
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

    // 3. Build Deck (expanding reversible items)
    const deck: DrawResultItem[] = [];
    items.forEach((item: DrawItem) => {
        // Always add Upright
        deck.push({ ...item, is_reversed: false });
        // Add Reversed if applicable
        if (item.reversed_description) {
            deck.push({ ...item, is_reversed: true });
        }
    });

    // 4. Pick Winners
    const shuffled = [...deck].sort(() => 0.5 - Math.random());
    const winners = shuffled.slice(0, count);

    // 5. Pick Distractors (random items for animation)
    const distractors: DrawResultItem[] = [];
    while (distractors.length < 15) {
        // Pick from full deck to include Reversed variants in animation too?
        // User asked "It can appear in draw as another one", does that imply animation too?
        // Usually safer/cleaner to just show main images in animation, but let's mix it up for "premium" feel.
        distractors.push(...deck.sort(() => 0.5 - Math.random()).slice(0, 5));
    }

    return {
        winners,
        distractors: distractors.slice(0, 15)
    };
}
