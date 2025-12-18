"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Icon } from "@iconify/react";

interface DrawResultCardSimpleProps {
    item: {
        slug: string;
        name: string;
        description: string;
    };
    onGoDeeper?: () => void;
    isPremium: boolean;
}

export function DrawResultCardSimple({ item, onGoDeeper, isPremium }: DrawResultCardSimpleProps) {
    return (
        <GlassCard
            className="w-full max-w-sm mx-auto p-6 flex flex-col gap-4 relative overflow-hidden text-left border-none"
            style={{
                background: 'linear-gradient(180deg, rgba(24, 39, 46, 0.30) 0%, rgba(24, 39, 46, 0.60) 50%, rgba(24, 39, 46, 0.90) 100%)',
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)'
            }}
        >

            {/* Header: Label + Share */}
            <div className="flex w-full justify-between items-center">
                <span className="para-big font-bold text-[var(--text-secondary)]">Rune du jour</span>
                <button className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                    <Icon icon="ri:share-fill" width="24" height="24" />
                </button>
            </div>

            {/* Rune Identity */}
            <div className="flex items-center gap-4">
                {/* Icon 40x40 with glow */}
                <div className="w-[40px] h-[40px] relative flex-shrink-0 flex items-center justify-center effect-glow-yellow">
                    {/* Placeholder visual waiting for real assets */}
                    <div className="w-full h-full bg-[var(--accent-900)] rounded-lg flex items-center justify-center text-[var(--background-900)] font-bold text-xl">
                        {item.slug.charAt(0).toUpperCase()}
                    </div>
                </div>
                <h1 className="title-big text-[var(--accent-900)] leading-tight">{item.name}</h1>
            </div>

            {/* Description */}
            <p className="para-big text-[var(--text-primary)] leading-relaxed opacity-90">
                {item.description}
            </p>

            {/* Footer Action */}
            <div className="mt-auto pt-2 w-full">
                <Button
                    variant="primary"
                    className=""
                    onClick={onGoDeeper}
                    // Forced disabled as per visual request "Ils sont en état primaire désactivé"
                    disabled={true}
                    icon={!isPremium ? <Icon icon="mingcute:lock-fill" /> : undefined}
                >
                    {isPremium ? "Approfondir (3 runes)" : "Débloquer le tirage complet"}
                </Button>
            </div>
        </GlassCard>
    );
}
