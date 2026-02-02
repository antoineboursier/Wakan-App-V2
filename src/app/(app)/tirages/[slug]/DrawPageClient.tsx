"use client";

import { useRouter } from "next/navigation";
import { FullscreenModal } from "@/components/ui/FullscreenModal";
import { ComplexDrawDisplay } from "@/components/draws/ComplexDrawDisplay";
import { DrawResultClient } from "@/components/draws/DrawResultClient";
import { DrawCardWrapper } from "../DrawCardWrapper";

interface DrawPageClientProps {
    drawType: any; // Type to be refined if possible, or kept tolerant
    resultItems: any[];
    resultItem: any; // First item or null
    isComplexDraw: boolean;
    isSimpleDraw: boolean;
    distractorImages: string[];
    slug: string;
    shouldAnimate: boolean;
    shareTitle: string;
    shareText: string;
}

export function DrawPageClient({
    drawType,
    resultItems,
    resultItem,
    isComplexDraw,
    isSimpleDraw,
    distractorImages,
    slug,
    shouldAnimate,
    shareTitle,
    shareText
}: DrawPageClientProps) {
    const router = useRouter();

    const handleBack = () => {
        // If query param 'from' exists? simpler: just back
        router.back();
    };

    const handleClose = () => {
        router.push('/tirages');
    };

    return (
        <FullscreenModal
            isOpen={true}
            backgroundImageUrl={drawType.background_image_url || "/backgrounds/journal.png"}
            onBack={handleBack}
            onClose={handleClose}
            backLabel="Retour"
            showShare={!!resultItem}
            shareTitle={shareTitle}
            shareText={shareText}
            // Use flex-col to center content if needed, justify-start to avoid vertical centering
            contentClassName="flex flex-col items-center justify-start pt-4 md:p-6"
        >
            <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
                {resultItem ? (
                    isComplexDraw && resultItems.length > 1 ? (
                        // Complex Draw Display
                        <ComplexDrawDisplay
                            subtitle={drawType.intro_subtitle || drawType.title}
                            items={resultItems.map(item => ({
                                id: item.id,
                                name: item.name,
                                imageUrl: item.image_url,
                                description: item.displayDescription,
                                isReversed: item.isReversed
                            }))}
                            distractorImages={distractorImages}
                            shouldAnimate={shouldAnimate}
                            slug={slug}
                        />
                    ) : (
                        // Simple Draw Display
                        <DrawResultClient
                            subtitle={drawType.intro_subtitle || drawType.title}
                            itemName={resultItem.name}
                            itemImageUrl={resultItem.image_url}
                            itemDescription={resultItem.displayDescription}
                            distractorImages={distractorImages}
                            shouldAnimate={shouldAnimate}
                            isReversed={resultItem.isReversed}
                            slug={slug}
                            btnSecondEnabled={drawType.btn_second_enabled}
                            btnSecondLabel={drawType.btn_second_label}
                            btnSecondIcon={drawType.btn_second_icon}
                            isSimpleDraw={isSimpleDraw}
                            isSecondBtnPremium={drawType.btn_second_is_premium}
                            firstItemId={resultItem.id}
                            btnSecondDrawCount={drawType.btn_second_draw_count ?? 2}
                            btnSecondIncludeFirst={drawType.btn_second_include_first ?? false}
                        />
                    )
                ) : (
                    // Intro View (if accessing page directly without draw)
                    <div className="w-full">
                        <DrawCardWrapper
                            slug={drawType.slug}
                            title={drawType.intro_title || drawType.title}
                            subtitle={drawType.intro_subtitle || drawType.description || "..."}
                            imageUrl={drawType.image_url}
                            btnMainLabel={drawType.btn_main_label}
                            btnMainIcon={drawType.btn_main_icon}
                            btnSecondLabel={drawType.btn_second_label}
                            btnSecondIcon={drawType.btn_second_icon}
                            btnSecondEnabled={drawType.btn_second_enabled}
                            isMainPremium={drawType.is_premium}
                            isSecondBtnPremium={drawType.btn_second_is_premium}
                            btnMainLimitEnabled={drawType.btn_main_limit_enabled}
                            btnMainLimitCount={drawType.btn_main_limit_count}
                            btnSecondDrawCount={drawType.btn_second_draw_count}
                            btnSecondIncludeFirst={drawType.btn_second_include_first}
                            standalone={true}
                        />
                    </div>
                )}
            </div>
        </FullscreenModal>
    );
}
