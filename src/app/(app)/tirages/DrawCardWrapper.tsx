"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DrawIntroCard } from "@/components/draws/DrawIntroCard";
import { useEntitlements } from "@/hooks/useEntitlements";
import { useDailyFreeLimit } from "@/hooks/useDailyFreeLimit";
import { Modal } from "@/components/ui/Modal";
import { performDraw, DrawResult } from "@/app/actions/draws";
import { MorphingLoader } from "@/components/animations/MorphingLoader";

interface DrawCardWrapperProps {
    slug: string;
    title: string;
    subtitle: string;
    imageUrl?: string | null;

    // Config
    btnMainLabel?: string | null;
    btnMainIcon?: string | null;
    btnSecondLabel?: string | null;
    btnSecondIcon?: string | null;
    btnSecondEnabled?: boolean;
    isMainPremium?: boolean;
    isSecondBtnPremium?: boolean;
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
    isSecondBtnPremium
}: DrawCardWrapperProps) {
    const router = useRouter();
    const { isPremium } = useEntitlements();
    const { canDrawFree, loadinglimit, resetLimit } = useDailyFreeLimit(slug);

    // UI State
    const [isDrawing, setIsDrawing] = useState(false);
    const [drawResult, setDrawResult] = useState<DrawResult | null>(null);

    const startDrawSequence = async (count: 1 | 3) => {
        setIsDrawing(true);
        setDrawResult(null);

        try {
            // 1. Perform Draw on Server (fetches winners + shuffle items)
            const result = await performDraw(slug, count);
            setDrawResult(result);
            // Modal opens because isDrawing=true. 
            // We wait for MorphingLoader to call onComplete.
        } catch (e) {
            console.error("Draw failed", e);
            alert("Une erreur est survenue lors du tirage.");
            setIsDrawing(false);
        }
    };

    const handleAnimationComplete = () => {
        if (!drawResult) return;
        const ids = drawResult.winners.map(w => w.id).join(',');
        const reversedIds = drawResult.winners
            .filter(w => w.is_reversed)
            .map(w => w.id)
            .join(',');

        const query = new URLSearchParams();
        query.set('ids', ids);
        query.set('count', drawResult.winners.length.toString());
        if (reversedIds) query.set('r_ids', reversedIds);

        // 2. Navigate with IDs to display result
        router.push(`/tirages/${slug}/result?${query.toString()}`);
    };

    const handleDrawOne = () => {
        // Validation Logic for Main Draw
        if (isMainPremium && !isPremium) {
            alert("Ce tirage est réservé aux membres Premium");
            return;
        }
        if (!isPremium && !canDrawFree && !isMainPremium) {
            // Limit reached
            return;
        }

        startDrawSequence(1);
    };

    const handleDrawThree = () => {
        // Validation Logic for Second Draw
        if (isSecondBtnPremium && !isPremium) {
            alert("Réservé aux membres Premium !");
            return;
        }
        startDrawSequence(3);
    };

    return (
        <>
            <DrawIntroCard
                title={title}
                subtitle={subtitle}
                imageUrl={imageUrl || undefined}
                onDrawOne={handleDrawOne}
                onDrawThree={handleDrawThree}
                canDrawFree={canDrawFree}
                isPremium={isPremium}
                isLoading={loadinglimit}
                onResetLimit={resetLimit}

                // Config Props
                btnMainLabel={btnMainLabel || undefined}
                btnMainIcon={btnMainIcon || undefined}
                btnSecondLabel={btnSecondLabel || undefined}
                btnSecondIcon={btnSecondIcon || undefined}
                btnSecondEnabled={btnSecondEnabled}
                isMainPremium={isMainPremium}
                isSecondBtnPremium={isSecondBtnPremium}
            />

            <Modal isOpen={isDrawing} onClose={() => { /* Prevent closing */ }}>
                {/* Only show loader when we have data to animate */}
                {drawResult ? (
                    <MorphingLoader
                        images={drawResult.distractors.map(d => d.image_url || '/placeholder.png')}
                        finalImage={drawResult.winners[0].image_url || '/placeholder.png'}
                        onComplete={handleAnimationComplete}
                    />
                ) : (
                    // Optional: Simple spinner while waiting for performDraw
                    <div className="flex items-center justify-center p-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--accent-500)]"></div>
                    </div>
                )}
            </Modal>
        </>
    );
}
