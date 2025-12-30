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
    // Limit display
    btnMainLimitCount?: number;
    btnMainLimitEnabled?: boolean;
    remainingDraws?: number;
    premiumText?: string | null;
    className?: string;
    badge?: React.ReactNode;
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
    btnMainLimitCount = 1,
    btnMainLimitEnabled = false,
    remainingDraws = 0,
    premiumText = "Tirages illimités actifs",
    className,
    badge,
}: DrawIntroCardProps) {
    const isMainLocked = !isPremium && isMainPremium;
    const isMainDisabled = isMainLocked || (!isPremium && !canDrawFree);

    const isSecondLocked = !isPremium && isSecondBtnPremium;

    return (
        <GlassCard id="draw-intro-card" className={`w-full max-w-sm mx-auto p-0 flex flex-col items-start text-left overflow-hidden bg-[var(--background-900)] border-[1px] border-[var(--text-tertiary)] h-full relative ${className || ''}`}>

            {/* Badge (ex: Nouveau) */}
            {badge}

            {/* Header Image + Gradient */}
            <div id="draw-intro-image" className="relative w-full h-[160px] shrink-0">
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
            <div id="draw-intro-content" className="p-6 w-full flex flex-col gap-6 mt-[-40px] flex-1">

                {/* Typography */}
                <div id="draw-intro-typography" className="flex flex-col gap-2">
                    <h1 className="title-big text-[var(--text-primary)] leading-tight drop-shadow-md">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="para-big text-[var(--accent-900)] leading-snug font-bold">
                            {subtitle}
                        </p>
                    )}
                </div>

                {/* Actions */}
                <div id="draw-intro-actions" className="flex flex-col items-start gap-4">

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
                    <div id="draw-intro-limits" className="ml-1">
                        {btnMainLimitEnabled && !isPremium && (
                            !canDrawFree ? (
                                <p className="para-lit text-[var(--ui-on-alert)] font-bold flex items-center gap-2 flex-wrap">
                                    <span>0/{btnMainLimitCount} tirage{btnMainLimitCount > 1 ? 's' : ''} restant{btnMainLimitCount > 1 ? 's' : ''} — Limite atteinte</span>
                                    {/* Reset button - Dev only */}
                                    {process.env.NODE_ENV === 'development' && onResetLimit && (
                                        <button
                                            type="button"
                                            onClick={onResetLimit}
                                            className="text-[10px] uppercase tracking-wider text-slate-500 hover:text-[var(--accent-500)] underline transition-colors"
                                        >
                                            [Reset]
                                        </button>
                                    )}
                                </p>
                            ) : (
                                <p className="para-lit text-[var(--text-primary)] opacity-80">
                                    {remainingDraws}/{btnMainLimitCount} tirage{btnMainLimitCount > 1 ? 's' : ''} gratuit{btnMainLimitCount > 1 ? 's' : ''} restant{remainingDraws > 1 ? 's' : ''}
                                </p>
                            )
                        )}
                        {isPremium && premiumText && (
                            <p className="para-lit text-[var(--accent-500)]">
                                {premiumText}
                            </p>
                        )}
                    </div>

                </div>
            </div>

        </GlassCard>
    );
}
