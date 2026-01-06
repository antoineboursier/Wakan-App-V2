"use client";

import { DrawItem } from "@/types/draws";

export interface StoredDrawResult {
    slug: string; // The draw slug (e.g., 'runes')
    timestamp: number;
    type: 'simple' | 'complex';
    items: {
        id: string;
        name: string;
        imageUrl?: string | null;
        description?: string | null; // For sharing or tooltip?
        isReversed?: boolean;
    }[];
}

const DRAW_STORAGE_KEY = 'wakan_draw_results';

function getStorage(): Record<string, StoredDrawResult> {
    if (typeof window === 'undefined') return {};
    try {
        const item = window.localStorage.getItem(DRAW_STORAGE_KEY);
        return item ? JSON.parse(item) : {};
    } catch (e) {
        console.error("Failed to parse draw answers", e);
        return {};
    }
}

export function saveDrawResult(slug: string, items: DrawItem[], type: 'simple' | 'complex' = 'simple') {
    const all = getStorage();

    // Simplification for storage
    const storedItems = items.map(item => ({
        id: item.id,
        name: item.name,
        imageUrl: item.image_url,
        description: item.short_description,
        isReversed: (item as any).isReversed
    }));

    all[slug] = {
        slug,
        timestamp: Date.now(),
        type,
        items: storedItems
    };

    try {
        window.localStorage.setItem(DRAW_STORAGE_KEY, JSON.stringify(all));
    } catch (e) {
        console.error("Failed to save draw result", e);
    }
}

export function getDrawResult(slug: string): StoredDrawResult | null {
    const all = getStorage();
    return all[slug] || null;
}

export function clearDrawResult(slug: string) {
    const all = getStorage();
    delete all[slug];
    try {
        window.localStorage.setItem(DRAW_STORAGE_KEY, JSON.stringify(all));
    } catch (e) {
        console.error("Failed to clear draw result", e);
    }
}
