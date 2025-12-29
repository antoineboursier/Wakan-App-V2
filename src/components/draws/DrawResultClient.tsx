"use client";

import { useState } from "react";
// DrawResultDisplay is no longer needed as ComplexDrawDisplay handles both cases
import { ComplexDrawDisplay } from "./ComplexDrawDisplay";
import { useEntitlements } from "@/hooks/useEntitlements";
import { performDraw } from "@/app/actions/draws";

interface ComplexDrawItem {
    id: string;
    name: string;
    imageUrl: string;
    description: string;
    isReversed: boolean;
}

interface DrawResultClientProps {
    subtitle: string;
    itemName: string;
    itemImageUrl?: string | null;
    itemDescription: string;
    distractorImages: string[];
    shouldAnimate: boolean;
    isReversed?: boolean;
    // Complex draw props
    slug: string;
    btnSecondEnabled?: boolean;
    btnSecondLabel?: string;
    btnSecondIcon?: string;
    isSimpleDraw: boolean; // true if this was a single card draw
    isSecondBtnPremium?: boolean; // from draw_types config
    // First item ID (for exclusion if needed)
    firstItemId?: string;
    // Configuration from drawType
    btnSecondDrawCount?: number;
    btnSecondIncludeFirst?: boolean;
}

export function DrawResultClient({
    subtitle,
    itemName,
    itemImageUrl,
    itemDescription,
    distractorImages,
    shouldAnimate,
    isReversed = false,
    slug,
    btnSecondEnabled = false,
    btnSecondLabel,
    btnSecondIcon,
    isSimpleDraw,
    isSecondBtnPremium = true,
    firstItemId,
    btnSecondDrawCount = 2,
    btnSecondIncludeFirst = false
}: DrawResultClientProps) {
    const { isPremium } = useEntitlements();

    // State for additional items (initially empty)
    const [additionalItems, setAdditionalItems] = useState<ComplexDrawItem[]>([]);
    const [isLoadingComplex, setIsLoadingComplex] = useState(false);

    // Initial item is always present
    const firstItem: ComplexDrawItem = {
        id: firstItemId || 'first',
        name: itemName,
        imageUrl: itemImageUrl || '/placeholder.png',
        description: itemDescription,
        isReversed: isReversed
    };

    // Combined items list
    const allItems = [firstItem, ...additionalItems];

    const handleComplexDraw = async () => {
        if (isLoadingComplex || additionalItems.length > 0) return;

        setIsLoadingComplex(true);

        try {
            // Perform additional draws
            // If btnSecondIncludeFirst is false (default), exclude the first item
            const excludeIds = btnSecondIncludeFirst ? [] : (firstItemId ? [firstItemId] : []);

            const result = await performDraw(slug, btnSecondDrawCount, { excludeItemIds: excludeIds });

            // Map additional winners
            const newItems: ComplexDrawItem[] = result.winners.map(winner => ({
                id: winner.id,
                name: winner.name,
                imageUrl: winner.image_url || '/placeholder.png',
                description: winner.is_reversed
                    ? (winner.reversed_description || winner.long_description)
                    : winner.long_description,
                isReversed: winner.is_reversed || false
            }));

            // Add results to state
            setAdditionalItems(newItems);
        } catch (e) {
            console.error("Complex draw failed", e);
            alert("Une erreur est survenue lors du tirage complet.");
        } finally {
            setIsLoadingComplex(false);
        }
    };

    // Determine if we should skip animation for the first item
    // Logic: If we added items, it means we transitioned, so we skip the first item animation (it's mostly redundant but safe)
    // Actually, ComplexDrawDisplay logic handles delays.
    // If initially "shouldAnimate" is true, the first item animates.
    // When we add items, the first item stays rendered. React Reconciliation should keep it in place.
    // We pass skipFirstAnimation = true ONLY if we are in a state where meaningful animation of first item passed?
    // Actually, no, if we just keep the component mounted, we rely on React to NOT unmount it.
    // But passing "skipFirstAnimation={additionalItems.length > 0}" allows ComplexDrawDisplay
    // to adjust delays for the NEW items.

    return (
        <ComplexDrawDisplay
            subtitle={subtitle}
            items={allItems}
            distractorImages={distractorImages}
            shouldAnimate={shouldAnimate}
            skipFirstAnimation={additionalItems.length > 0} // Simplify delay logic for subsequent items

            // Interaction props
            onComplexDraw={isSimpleDraw && btnSecondEnabled ? handleComplexDraw : undefined}
            btnSecondLabel={btnSecondLabel}
            btnSecondIcon={btnSecondIcon}
            isSecondBtnPremium={isSecondBtnPremium}
            isPremium={isPremium}
            isLoadingComplex={isLoadingComplex}
        />
    );
}
