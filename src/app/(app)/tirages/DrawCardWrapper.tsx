"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DrawIntroCard } from "@/components/draws/DrawIntroCard";
import { useEntitlements } from "@/hooks/useEntitlements";
import { useDailyFreeLimit } from "@/hooks/useDailyFreeLimit";
import { performDraw } from "@/app/actions/draws";

interface DrawCardWrapperProps {
    slug: string;
    title: string;
    subtitle: string;
    imageUrl?: string | null;
    standalone?: boolean;

    // Config
    btnMainLabel?: string | null;
    btnMainIcon?: string | null;
    btnSecondLabel?: string | null;
    btnSecondIcon?: string | null;
    btnSecondEnabled?: boolean;
    isMainPremium?: boolean;
    isSecondBtnPremium?: boolean;
    btnMainLimitEnabled?: boolean;
    btnMainLimitCount?: number;
    // Complex draw config
    btnSecondDrawCount?: number; // Number of additional draws
    btnSecondIncludeFirst?: boolean; // Include first draw value in pool
}

export function DrawCardWrapper({
    slug,
    title,
    subtitle,
    imageUrl,
    btnMainLabel,
    btnMainIcon,
    btnSecondLabel,
    btnSecondIcon,
    btnSecondEnabled,
    isMainPremium,
    isSecondBtnPremium,
    btnMainLimitCount = 1,
    btnMainLimitEnabled = false,
    btnSecondDrawCount = 2,
    btnSecondIncludeFirst = false,
    standalone = false
}: DrawCardWrapperProps) {
    const router = useRouter();
    const { isPremium } = useEntitlements();

    // Pass limit options to hook
    const {
        canDrawFree,
        remainingDraws,
        loadingLimit,
        consumeFreeDraw,
        resetLimit
    } = useDailyFreeLimit(slug, {
        limitCount: btnMainLimitCount,
        limitEnabled: btnMainLimitEnabled
    });

    const [isDrawing, setIsDrawing] = useState(false);

    const performDrawAction = async (count: number, isComplex: boolean = false) => {
        setIsDrawing(true);
        try {
            // Perform Draw on Server
            const result = await performDraw(slug, count);

            // Consume limit if applicable (only for non-premium users)
            if (!isPremium) {
                consumeFreeDraw();
            }

            // Build Query for navigation
            const ids = result.winners.map(w => w.id).join(',');
            const reversedIds = result.winners.filter(w => w.is_reversed).map(w => w.id).join(',');

            const query = new URLSearchParams();
            query.set('ids', ids);
            if (reversedIds) query.set('r_ids', reversedIds);
            query.set('animate', 'true');
            const distractorIds = result.distractors.map(d => d.id).join(',');
            if (distractorIds) query.set('d_ids', distractorIds);
            if (isComplex) query.set('complex', 'true');

            // Navigate to the result view
            router.push(`/tirages/${slug}?${query.toString()}`);

        } catch (e) {
            console.error("Draw failed", e);
            alert("Une erreur est survenue lors du tirage.");
            setIsDrawing(false);
        }
    };

    const handleDrawOne = () => {
        // Validation Logic for Main Draw
        if (isMainPremium && !isPremium) {
            alert("Réservé aux membres Premium !");
            return;
        }

        // Check limit for non-premium users
        if (btnMainLimitEnabled && !isPremium && !canDrawFree) {
            return; // Limit reached, button should be disabled anyway
        }

        performDrawAction(1, false);
    };

    const handleDrawComplex = () => {
        if (isSecondBtnPremium && !isPremium) {
            alert("Réservé aux membres Premium !");
            return;
        }
        // Total draws = 1 (first) + btnSecondDrawCount (additional)
        const totalDraws = 1 + btnSecondDrawCount;
        performDrawAction(totalDraws, true);
    };

    return (
        <DrawIntroCard
            title={title}
            subtitle={subtitle}
            imageUrl={imageUrl ?? undefined}

            // Main Button
            btnMainLabel={btnMainLabel ?? undefined}
            btnMainIcon={btnMainIcon ?? undefined}
            onDrawOne={handleDrawOne}
            isPremium={isPremium}
            isMainPremium={isMainPremium}

            // Secondary Button
            btnSecondLabel={btnSecondLabel ?? undefined}
            btnSecondIcon={btnSecondIcon ?? undefined}
            onDrawThree={handleDrawComplex}
            btnSecondEnabled={btnSecondEnabled}
            isSecondBtnPremium={isSecondBtnPremium}

            // Limit display
            btnMainLimitEnabled={btnMainLimitEnabled}
            btnMainLimitCount={btnMainLimitCount}
            remainingDraws={remainingDraws}
            canDrawFree={canDrawFree}
            onResetLimit={resetLimit}
        />
    );
}

