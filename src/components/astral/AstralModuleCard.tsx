"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Icon } from "@iconify/react";
import { AstralModule } from "@/types/astral";
import Image from "next/image";

interface AstralModuleCardProps {
    module: AstralModule;
    onComplete?: () => void;
    onView?: () => void;
}

export function AstralModuleCard({ module, onComplete, onView }: AstralModuleCardProps) {
    const { title, isUnlocked, features, heroImage, theme } = module;
    const accentColor = theme?.accentColor || 'var(--accent-500)';

    return (
        <GlassCard
            className="flex flex-col relative overflow-hidden group transition-all duration-300 hover:bg-[var(--background-700)] border-white-mix p-0 h-full"
            style={{
                borderColor: isUnlocked ? 'var(--stroke-card)' : 'transparent'
            }}
        >
            {/* 1. Hero Image Section */}
            <div className="relative w-full h-40 shrink-0">
                {/* Image Background */}
                <div className="absolute inset-0 z-0">
                    {heroImage ? (
                        <Image
                            src={heroImage}
                            alt={title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    ) : (
                        <div
                            className="w-full h-full"
                            style={{ background: `linear-gradient(135deg, ${accentColor}20, ${accentColor}05)` }}
                        />
                    )}
                    {/* Gradient Overlay for text readability later */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--background-900)] via-transparent to-transparent" />
                </div>

                {/* Badge Title - Floating */}
                <div className="absolute bottom-4 left-4 z-10">
                    <div className="bg-[var(--background-800)]/80 backdrop-blur-md border border-[var(--stroke-secondary)] px-3 py-1 rounded-lg shadow-lg">
                        <h3 className="title-lit text-[var(--text-primary)] tracking-wide">
                            {title}
                        </h3>
                    </div>
                </div>
            </div>

            {/* 2. Content Section */}
            <div className="flex flex-col flex-1 p-5 pt-2 gap-4">

                {/* Feature List */}
                <div className="flex flex-col gap-2.5">
                    {features?.map((feature, idx) => (
                        <div
                            key={idx}
                            className="flex items-center justify-between py-1 border-b border-[var(--background-500)] last:border-0"
                        >
                            <span className="para-lit text-[var(--text-secondary)]">
                                {feature}
                            </span>

                            {/* Status Icon for Feature */}
                            {isUnlocked ? (
                                <Icon
                                    icon="mdi:check-circle"
                                    className="text-[var(--alert-success)] w-5 h-5"
                                />
                            ) : (
                                <div className="bg-[var(--background-700)] p-1 rounded-md">
                                    <Icon
                                        icon="mdi:plus"
                                        className="text-[var(--text-tertiary)] w-3 h-3"
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* 3. CTA Action */}
                <div className="mt-auto pt-4">
                    {isUnlocked ? (
                        // Unlocked State: "View" button
                        <Button
                            variant="primary" // Keeping primary for consistency
                            onClick={onView}
                            className="w-full justify-center !bg-transparent border border-[var(--text-tertiary)] hover:!bg-[var(--background-700)]"
                            icon={<Icon icon="mdi:eye-outline" />}
                        >
                            Consulter
                        </Button>
                    ) : (
                        // Locked State: "Compléter" Gradient Button
                        <button
                            onClick={onComplete}
                            className="w-full py-3 rounded-lg flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg group-hover:shadow-[0_0_20px_rgba(246,174,49,0.2)]"
                            style={{
                                background: "linear-gradient(90deg, #F6AE31 0%, #D48C0F 100%)",
                                color: "var(--background-900)", // Dark tex for contrast on yellow
                            }}
                        >
                            <span className="ui-button-text">Compléter</span>
                            {module.state === 'draft' ? (
                                <Icon icon="mdi:lock" className="w-5 h-5 opacity-50" />
                            ) : (
                                <Icon icon="mdi:arrow-right" className="w-5 h-5" />
                            )}
                        </button>
                    )}
                </div>
            </div>
        </GlassCard>
    );
}
