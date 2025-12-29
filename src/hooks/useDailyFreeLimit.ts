"use client";

import { useState, useEffect, useCallback } from "react";

interface UseDailyFreeLimitOptions {
    limitCount: number;       // Nombre de tirages gratuits autorisés par jour
    limitEnabled: boolean;    // Si false, pas de limite
}

interface UseDailyFreeLimitReturn {
    canDrawFree: boolean;           // true si l'utilisateur peut encore tirer gratuitement
    remainingDraws: number;         // Nombre de tirages restants aujourd'hui
    usedDraws: number;              // Nombre de tirages utilisés aujourd'hui
    loadingLimit: boolean;          // true pendant le chargement initial
    consumeFreeDraw: () => void;    // Consomme un tirage gratuit
    resetLimit: () => void;         // Reset pour le dev
}

export function useDailyFreeLimit(
    drawSlug: string,
    options: UseDailyFreeLimitOptions = { limitCount: 1, limitEnabled: false }
): UseDailyFreeLimitReturn {
    const { limitCount, limitEnabled } = options;

    const [usedDraws, setUsedDraws] = useState(0);
    const [loadingLimit, setLoadingLimit] = useState(true);

    // Get today's date key (YYYY-MM-DD)
    const getTodayKey = useCallback(() => {
        return new Date().toISOString().split("T")[0];
    }, []);

    // Storage key for this draw type
    const getStorageKey = useCallback(() => {
        return `draw:${drawSlug}:${getTodayKey()}`;
    }, [drawSlug, getTodayKey]);

    // Check and load current usage
    const checkLimit = useCallback(() => {
        try {
            // If limit is not enabled, no restrictions
            if (!limitEnabled) {
                setUsedDraws(0);
                setLoadingLimit(false);
                return;
            }

            const key = getStorageKey();
            const stored = localStorage.getItem(key);

            if (stored) {
                const count = parseInt(stored, 10);
                setUsedDraws(isNaN(count) ? 0 : count);
            } else {
                setUsedDraws(0);
            }
        } catch (e) {
            console.error("Error checking daily limit", e);
            setUsedDraws(0);
        } finally {
            setLoadingLimit(false);
        }
    }, [limitEnabled, getStorageKey]);

    // Initialize on mount and when slug changes
    useEffect(() => {
        checkLimit();
    }, [checkLimit]);

    // Clean up old keys (optional cleanup for storage hygiene)
    useEffect(() => {
        try {
            const today = getTodayKey();
            const prefix = `draw:${drawSlug}:`;

            for (let i = localStorage.length - 1; i >= 0; i--) {
                const key = localStorage.key(i);
                if (key && key.startsWith(prefix) && !key.endsWith(today)) {
                    localStorage.removeItem(key);
                }
            }
        } catch (e) {
            // Ignore cleanup errors
        }
    }, [drawSlug, getTodayKey]);

    // Consume one free draw
    const consumeFreeDraw = useCallback(() => {
        if (!limitEnabled) return; // No limit, nothing to consume

        try {
            const key = getStorageKey();
            const newCount = usedDraws + 1;
            localStorage.setItem(key, String(newCount));
            setUsedDraws(newCount);
        } catch (e) {
            console.error("Error consuming free draw", e);
        }
    }, [limitEnabled, getStorageKey, usedDraws]);

    // Reset limit (dev only)
    const resetLimit = useCallback(() => {
        try {
            const key = getStorageKey();
            localStorage.removeItem(key);
            setUsedDraws(0);
        } catch (e) {
            console.error("Error resetting limit", e);
        }
    }, [getStorageKey]);

    // Calculate if user can draw
    const canDrawFree = !limitEnabled || usedDraws < limitCount;
    const remainingDraws = limitEnabled ? Math.max(0, limitCount - usedDraws) : Infinity;

    return {
        canDrawFree,
        remainingDraws,
        usedDraws,
        loadingLimit,
        consumeFreeDraw,
        resetLimit
    };
}
