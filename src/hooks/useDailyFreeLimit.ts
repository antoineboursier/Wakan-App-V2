"use client";

import { useState, useEffect } from "react";

export function useDailyFreeLimit(drawSlug: string) {
    const [canDrawFree, setCanDrawFree] = useState(true);
    const [loadinglimit, setLoadingLimit] = useState(true);

    useEffect(() => {
        checkLimit();
    }, [drawSlug]);

    const checkLimit = () => {
        try {
            const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
            const key = `draw:${drawSlug}:${today}`;
            const hasDrawn = localStorage.getItem(key);
            setCanDrawFree(!hasDrawn);
        } catch (e) {
            console.error("Error checking daily limit", e);
        } finally {
            setLoadingLimit(false);
        }
    };

    const consumeFreeDraw = () => {
        try {
            const today = new Date().toISOString().split("T")[0];
            const key = `draw:${drawSlug}:${today}`;
            localStorage.setItem(key, "true");
            setCanDrawFree(false);
        } catch (e) {
            console.error("Error consuming free draw", e);
        }
    };

    const resetLimit = () => {
        try {
            const today = new Date().toISOString().split("T")[0];
            const key = `draw:${drawSlug}:${today}`;
            localStorage.removeItem(key);
            setCanDrawFree(true);
        } catch (e) {
            console.error("Error resetting limit", e);
        }
    };

    return { canDrawFree, consumeFreeDraw, resetLimit, loadinglimit };
}
