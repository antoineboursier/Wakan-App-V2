"use client";

import { Icon } from "@iconify/react";
import { Button } from "../ui/Button";
import { ShareButton } from "../ui/ShareButton";
import { StoredDrawResult } from "@/utils/drawStorage";

interface DrawResultSummaryCardProps {
    result: StoredDrawResult;
    title: string;
    onClick?: () => void;
    onPrecise?: () => void;
    canPrecise?: boolean;
    isPreciseLocked?: boolean;
    preciseLabel?: string;
    className?: string;
}

export function DrawResultSummaryCard({
    result,
    title,
    onClick,
    onPrecise,
    canPrecise = false,
    isPreciseLocked = false,
    preciseLabel = "Préciser à 3 runes",
    className = ""
}: DrawResultSummaryCardProps) {
    const isComplex = result.type === 'complex' || result.items.length > 1;
    const firstItem = result.items[0];
    const otherItems = result.items.slice(1);

    if (!firstItem) return null;

    return (
        <div
            className={`w-full h-full flex flex-col p-6 gap-6 relative overflow-hidden cursor-pointer hover:bg-[var(--background-700)] transition-colors group ${className}`}
            onClick={onClick}
            style={{
                borderRadius: "var(--sizes-s, 8px)",
                background: "linear-gradient(180deg, rgba(24, 39, 46, 0.40) 0%, rgba(24, 39, 46, 0.70) 100%)",
                backdropFilter: "blur(2px)",
            }}
        >
            {/* Header */}
            <div className="flex justify-between items-start w-full z-10">
                <h3 className="para-big text-[var(--text-secondary)] font-bold opacity-90">{title}</h3>
                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                    <ShareButton
                        title={`Mon résultat : ${firstItem.name}`}
                        text={`J'ai tiré ${firstItem.name} ! ${firstItem.description || ''}`}
                        variant="icon"
                        className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    />
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-col gap-4 z-10 flex-1">
                {/* First Item (Main) */}
                <div className="flex items-center gap-4">
                    {/* Icon/Image */}
                    <div className="w-12 h-12 shrink-0">
                        {firstItem.imageUrl ? (
                            <img src={firstItem.imageUrl} alt={firstItem.name} className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(255,200,87,0.3)] transition-transform group-hover:scale-110" />
                        ) : (
                            <Icon icon="mdi:cards-playing-outline" className="w-full h-full text-[var(--accent-500)]" />
                        )}
                    </div>
                    {/* Name */}
                    <h2 className="title-big font-display text-[var(--accent-900)]">{firstItem.name}</h2>
                </div>

                {/* Other Items (for Complex Draws) */}
                {isComplex && otherItems.length > 0 && (
                    <div className="flex flex-col gap-3 pl-2">
                        {otherItems.map((item, index) => (
                            <div key={index} className="flex items-center gap-3 opacity-90">
                                <div className="w-10 h-10 shrink-0">
                                    {item.imageUrl ? (
                                        <img
                                            src={item.imageUrl}
                                            alt={item.name}
                                            className="w-full h-full object-contain drop-shadow-[0_0_6px_rgba(255,200,87,0.2)] transition-transform group-hover:scale-105"
                                        />
                                    ) : (
                                        <Icon icon="mdi:cards-playing-outline" className="w-full h-full text-[var(--accent-700)]" />
                                    )}
                                </div>
                                <h3 className="title-med text-[var(--accent-700)]">{item.name}</h3>
                            </div>
                        ))}
                    </div>
                )}

                {/* Description - Show first item's description if simple, or generic message if complex */}
                <div className="relative">
                    <p className="para text-[var(--text-primary)] leading-relaxed line-clamp-3">
                        {isComplex
                            ? "Tirage complet réalisé. Cliquez pour voir les détails de votre lecture."
                            : (firstItem.description || "Aucune description disponible pour ce tirage.")
                        }
                    </p>
                </div>
            </div>

            {/* Footer / Button - Only for Precise/Upgrade */}
            {canPrecise && (
                <div className="pt-2 z-10" onClick={(e) => e.stopPropagation()}>
                    <Button
                        variant="secondary"
                        onClick={onPrecise}
                        disabled={isPreciseLocked}
                        className="w-full justify-center"
                        icon={isPreciseLocked ? <Icon icon="mdi:lock" /> : undefined}
                    >
                        {preciseLabel}
                    </Button>
                </div>
            )}
        </div>
    );
}
