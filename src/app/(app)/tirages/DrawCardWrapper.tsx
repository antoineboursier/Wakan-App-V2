"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DrawIntroCard } from "@/components/draws/DrawIntroCard";
import { useEntitlements } from "@/hooks/useEntitlements";
import { useDailyFreeLimit } from "@/hooks/useDailyFreeLimit";
import { performDraw } from "@/app/actions/draws";
import { getDrawResult, StoredDrawResult } from "@/utils/drawStorage";
import { DrawResultSummaryCard } from "@/components/draws/DrawResultSummaryCard";
import { useEffect } from "react";

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

    // Check if user is blocked (Limit reached and not premium)
    const isUserBlocked = !canDrawFree && !isPremium;

    // Result Persistence
    const [savedResult, setSavedResult] = useState<StoredDrawResult | null>(null);
    const [hasLoadedLimit, setHasLoadedLimit] = useState(false); // To avoid flush

    useEffect(() => {
        // Load limit first (hook does it), but also load result
        const res = getDrawResult(slug);

        // Basic "Today" check? User didn't specify. Assuming permanent for now or until cleared manually.
        // If we wanted daily reset, we'd check timestamp vs today.
        setSavedResult(res);
    }, [slug]);

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

    const isComplexResult = savedResult?.type === 'complex';

    // Navigation Handler to Result
    const handleNavigateToResult = () => {
        if (!savedResult) return;

        const ids = savedResult.items.map(i => i.id).join(',');
        const reversedIds = savedResult.items.filter(i => i.isReversed).map(i => i.id).join(',');

        const query = new URLSearchParams();
        query.set('ids', ids);
        if (reversedIds) query.set('r_ids', reversedIds);
        query.set('animate', 'false');
        if (isComplexResult) query.set('complex', 'true');

        router.push(`/tirages/${slug}?${query.toString()}`);
    };

    // Components
    const summaryCard = savedResult ? (
        <DrawResultSummaryCard
            result={savedResult}
            title={savedResult.items.length > 1 ? "Ton tirage du jour" : "Ta rune du jour"}
            onClick={handleNavigateToResult}
            // Only show precise button if eligible for upgrade (complex not done yet)
            canPrecise={btnSecondEnabled && !isComplexResult}
            isPreciseLocked={(btnSecondEnabled && !isComplexResult) ? (isSecondBtnPremium && !isPremium) : false}
            preciseLabel={btnSecondLabel || "Préciser à 3 runes"}
            onPrecise={handleNavigateToResult}
            className={!isUserBlocked ? "!rounded-t-none !border-t-0" : ""}
        />
    ) : null;

    const introCard = (
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

            // Layout tweaks: If summary is attached, handle radius and z-index to overlap correctly
            // Fix: Keep border-b, use z-10 to stay on top
            className={savedResult && !isUserBlocked ? "!rounded-b-none relative z-10" : ""}
        />
    );

    // LOGIC:
    // 1. If Limit Reached (and user is not premium to bypass it, handled by canDrawFree logic basically)
    //    Note: canDrawFree is true if Premium usually? No, hook checks limit.
    //    But Premium Users usually bypass limit in UI logic.
    //    If IS PREMIUM, `canDrawFree` from hook might return false if we strictly follow limit logic, 
    //    BUT `DrawIntroCard` handles `isPremium` prop to override disabled state?
    //    Let's check: `DrawIntroCard` uses `canDrawOne = isMainEnabled && (canDrawFree || isPremium)`.
    //    So if Premium, they can always draw.
    //    So `isLimitReached` effectively means: User is BLOCKED. 
    //    Blocked = !canDrawFree AND !isPremium.

    // Case A: User Blocked (Limit Reached) -> Show Result Only (if exists)
    if (isUserBlocked && savedResult) {
        return <div className="w-full">{summaryCard}</div>;
    }

    // Case B: Not Blocked (Can Play).
    // If result exists -> Show Intro (Playable) + Result Attached
    if (savedResult) {
        return (
            <div className="flex flex-col w-full h-full">
                {introCard}
                <div className="w-full relative z-0 -mt-[1px]">
                    {/* Reuse summary styled to attach? Or just put it below? 
                         User said "accolé". 
                         The DrawResultSummaryCard has rounded corners. 
                         I'll flatten top corners. 
                     */}
                    {/* Overriding Summary Card styles via a wrapper if needed, but the component has style prop hardcoded blocks. 
                         I didn't expose className/style to DResultSummaryCard properly in my previous edit (it has fixed style).
                         I should assume stacked is fine or minimal gap.
                         Actually, let's wrap it to remove top radius.
                     */}
                    {summaryCard}
                </div>
            </div>
        );
    }

    // Case C: No Result -> Intro Only
    return introCard;
}
