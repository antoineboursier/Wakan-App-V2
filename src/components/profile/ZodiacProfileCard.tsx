import React from 'react';
import { GlassCard } from '../ui/GlassCard';

interface ZodiacProfileProps {
    signName: string;
    decan: string;
    ascendant: string;
    element: string;
    northNode?: string;
    southNode?: string;
    iconUrl: string; // Placeholder for now
}

export function ZodiacProfileCard({ signName, decan, ascendant, element, northNode, southNode, iconUrl }: ZodiacProfileProps) {
    return (
        <GlassCard className="w-full p-6 flex flex-col items-center gap-4">
            {/* Header / Title */}
            <div className="w-full flex justify-between items-center border-b border-[var(--background-500)] pb-4 mb-2">
                <span className="para-big text-[var(--text-primary)]">Profil Zodiacal</span>
                <span className="text-xs text-[var(--accent-500)] bg-[var(--background-700)] px-2 py-1 rounded-full uppercase tracking-wider">Actif</span>
            </div>

            {/* Main Content Grid */}
            <div className="flex w-full items-center gap-6">

                {/* Visual Representation */}
                <div className="flex-shrink-0 relative">
                    {/* Placeholder Circular Display */}
                    <div className="w-20 h-20 rounded-full bg-[var(--background-700)] flex items-center justify-center border border-[var(--background-500)]">
                        {/* Replace with actual image later */}
                        <div className="text-[var(--text-tertiary)] text-xs text-center px-2">Image {signName}</div>
                    </div>
                </div>

                {/* Data Points */}
                <div className="flex flex-col gap-3 flex-1">
                    {/* Signe */}
                    <div className="flex flex-col">
                        <span className="para-lit text-[var(--text-tertiary)]">Signe Solaire</span>
                        <div className="flex items-baseline gap-2">
                            <span className="title-lit text-[var(--text-primary)]">{signName}</span>
                            <span className="text-xs text-[var(--text-secondary)] border border-[var(--background-500)] px-1.5 rounded bg-[var(--background-800)] opacity-70">{decan}</span>
                        </div>
                    </div>

                    {/* Ascendant */}
                    <div className="flex flex-col">
                        <span className="para-lit text-[var(--text-tertiary)]">Ascendant</span>
                        <span className="para-big text-[var(--text-secondary)]">{ascendant}</span>
                    </div>

                    {/* Element */}
                    <div className="flex flex-col">
                        <span className="para-lit text-[var(--text-tertiary)]">Élément majoritaire</span>
                        <span className="para-big text-[var(--text-secondary)]">{element}</span>
                    </div>

                    {/* Nœuds Lunaires */}
                    {(northNode || southNode) && (
                        <div className="flex flex-col gap-1 mt-1 pt-2 border-t border-[var(--background-500)]/30">
                            {northNode && (
                                <div className="flex justify-between items-baseline">
                                    <span className="para-lit text-[var(--text-tertiary)]">Nœud Nord</span>
                                    <span className="para text-[var(--text-secondary)]">{northNode}</span>
                                </div>
                            )}
                            {southNode && (
                                <div className="flex justify-between items-baseline">
                                    <span className="para-lit text-[var(--text-tertiary)]">Nœud Sud</span>
                                    <span className="para text-[var(--text-secondary)]">{southNode}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </GlassCard>
    );
}
