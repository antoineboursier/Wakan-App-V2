"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Icon } from "@iconify/react";

interface DrawIntroCardProps {
    title: string;
    subtitle: string;
    onDrawOne: () => void;
    onDrawThree: () => void;
    canDrawFree: boolean;
    isPremium: boolean;
    imageUrl?: string;
    onResetLimit?: () => void;

    // New Config Props
    btnMainLabel?: string;
    btnMainIcon?: string;
    btnSecondLabel?: string;
    btnSecondIcon?: string;
    btnSecondEnabled?: boolean;
    isMainPremium?: boolean;
    isSecondBtnPremium?: boolean;
    isLoading?: boolean;
}

export function DrawIntroCard({
    title,
    subtitle,
    onDrawOne,
    onDrawThree,
    canDrawFree,
    isPremium,
    imageUrl,
    onResetLimit,
    btnMainLabel = "Tirer une carte",
    btnMainIcon = "mdi:cards-outline",
    btnSecondLabel = "Tirage complet",
    btnSecondIcon = "mdi:cards-playing-outline",
    btnSecondEnabled = false,
    isMainPremium = false,
    isSecondBtnPremium = true,
}: DrawIntroCardProps) {
    const isMainLocked = !isPremium && isMainPremium;
    const isMainDisabled = isMainLocked || (!isPremium && !canDrawFree);

    const isSecondLocked = !isPremium && isSecondBtnPremium;

    return (
        <GlassCard className="w-full max-w-sm mx-auto p-0 flex flex-col items-start text-left overflow-hidden bg-[var(--background-900)] border-[1px] border-[var(--text-tertiary)]">

            {/* Header Image + Gradient */}
            <div className="relative w-full h-[160px] shrink-0">
                <img
                    src={imageUrl || "/backgrounds/journal.png"}
                    alt="Draw Background"
                    className="w-full h-full object-cover"
                />
                {/* Gradient Overlay: Transparent -> Background 900 (User Request) */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: "linear-gradient(180deg, rgba(24, 39, 46, 0.00) 0%, #18272E 100%)"
                    }}
                ></div>
            </div>

            {/* Content */}
            <div className="p-6 w-full flex flex-col gap-6 mt-[-40px]">

                {/* Typography */}
                <div className="flex flex-col gap-2">
                    <h1 className="title-big text-[var(--text-primary)] leading-tight drop-shadow-md">
                        {title}
                    </h1>
                    <p className="para-big text-[var(--accent-900)] leading-snug font-bold">
                        {subtitle}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col items-start gap-4">

                    <div className="flex flex-col gap-3 w-full">

                        {/* Bouton Principal */}
                        <Button
                            variant="primary"
                            onClick={onDrawOne}
                            disabled={isMainDisabled}
                            icon={isMainLocked ? <Icon icon="mingcute:lock-fill" width="16" /> : <Icon icon={btnMainIcon} width="20" height="20" />}
                            className="" // Hug content (défaut)
                        >
                            {btnMainLabel}
                        </Button>

                        {/* Bouton Secondaire */}
                        {btnSecondEnabled && (
                            <div className="relative inline-flex">
                                <Button
                                    variant="secondary"
                                    onClick={onDrawThree}
                                    disabled={isSecondLocked}
                                    icon={isSecondLocked ? <Icon icon="mingcute:lock-fill" width="16" height="16" /> : <Icon icon={btnSecondIcon} width="20" />}
                                    className=""
                                >
                                    {btnSecondLabel}
                                </Button>
                            </div>
                        )}

                    </div>

                    {/* Infos / Limites */}
                    <div className="ml-1">
                        {!canDrawFree && !isPremium && (
                            <p className="para-lit text-[var(--ui-alert)] font-bold">
                                Limite atteinte pour aujourd'hui
                            </p>
                        )}
                        {canDrawFree && !isPremium && (
                            <p className="para-lit text-[var(--text-primary)] opacity-80">
                                1 rune gratuite / jour
                            </p>
                        )}
                        {isPremium && (
                            <p className="para-lit text-[var(--accent-500)]">
                                Tirages illimités actifs
                            </p>
                        )}
                    </div>

                    {/* Cheat Reset for Testing */}
                    {onResetLimit && !canDrawFree && !isPremium && (
                        <button
                            onClick={onResetLimit}
                            className="mt-2 ml-1 text-[10px] uppercase tracking-wider text-slate-500 hover:text-[var(--accent-500)] underline transition-colors"
                        >
                            [Admin] Reset Daily Limit
                        </button>
                    )}

                </div>
            </div>

        </GlassCard>
    );
}
