"use client";

import { Icon } from "@iconify/react";
import { GlassCard } from "./GlassCard";

interface PremiumCardProps {
    variant?: 'sales' | 'active';
}

export function PremiumCard({ variant = 'sales' }: PremiumCardProps) {

    if (variant === 'active') {
        return (
            <GlassCard
                className="p-4 flex items-center justify-between cursor-pointer hover:brightness-110 transition-all border-[#f1ba5b] shadow-[0_4px_20px_rgba(241,186,91,0.1)]"
                style={{
                    background: 'linear-gradient(180deg, rgba(24, 39, 46, 0.30) 0%, rgba(24, 39, 46, 0.60) 50%, rgba(24, 39, 46, 0.90) 100%)',
                    backdropFilter: 'blur(4px)',
                    WebkitBackdropFilter: 'blur(4px)'
                }}
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--accent-900)] flex items-center justify-center text-[var(--background-900)] shadow-lg">
                        <Icon icon="solar:crown-star-bold" className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col">
                        <span className="para-big text-[var(--text-primary)] font-bold">Wakan Premium</span>
                        <span className="para-lit text-[var(--text-secondary)]">Accès illimité actif</span>
                    </div>
                </div>
                <Icon icon="solar:alt-arrow-right-linear" className="text-[var(--text-tertiary)] w-6 h-6" />
            </GlassCard>
        );
    }

    // Default 'sales' view
    return (
        <div
            style={{
                borderRadius: "var(--sizes-s)",
                border: "1px dashed var(--accent-900)",
                background: "rgba(24, 39, 46, 0.30)",
                backdropFilter: "blur(2px)",
                display: "flex",
                padding: "var(--sizes-m)",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "16px",
                alignSelf: "stretch",
                width: "100%",
                cursor: "pointer",
            }}
        >
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span className="para" style={{ color: "var(--text-secondary)" }}>
                    Accès premium
                </span>
                <span className="title-lit" style={{ color: "var(--accent-900)", marginTop: "4px" }}>
                    2€/mois
                </span>
                <span className="para" style={{ color: "var(--accent-700)", fontWeight: "bold" }}>
                    Débloque tout, sans mauvaise suprise.
                </span>
                <span className="para" style={{ color: "var(--accent-500)" }}>
                    Et bien sûr, c’est sans engagement.
                </span>
            </div>
            <Icon
                icon="fa:arrow-right"
                className="text-[var(--text-primary)]"
                style={{ fontSize: "24px", flexShrink: 0 }}
            />
        </div>
    );
}
