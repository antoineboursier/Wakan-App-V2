"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DrawIntroCard } from "@/components/draws/DrawIntroCard";
import { useEntitlements } from "@/hooks/useEntitlements";
import { useDailyFreeLimit } from "@/hooks/useDailyFreeLimit";
import { Modal } from "@/components/ui/Modal";
import { DrawLoader } from "@/components/animations/DrawLoader";

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
    const [isDrawing, setIsDrawing] = useState(false);
    const [drawCount, setDrawCount] = useState<1 | 3>(1);

    const startDrawSequence = (count: 1 | 3) => {
        setIsDrawing(true);
        setDrawCount(count);

        // Simulate delay for animation before navigating
        setTimeout(() => {
            router.push(`/tirages/${slug}/result?count=${count}`);
            // Note: Don't setIsDrawing(false) here, let the page transition happen while loader is visible
        }, 2500);
    };

    const handleDrawOne = () => {
        // Validation Logic for Main Draw
        if (isMainPremium && !isPremium) {
            // Should be handled by UI disabled state or a paywall Modal
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

            <Modal isOpen={isDrawing} onClose={() => { /* Prevent closing during draw */ }}>
                <DrawLoader />
            </Modal>
        </>
    );
}
