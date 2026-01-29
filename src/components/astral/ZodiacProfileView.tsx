"use client";

import React, { useMemo } from "react";
import { calculateZodiacProfile } from "@/utils/astro/zodiacCalculator";
import { ZODIAC_SIGNS_CONTENT, ELEMENTS_CONTENT, MODALITIES_CONTENT } from "@/data/zodiacContent";
import { useZodiacSignContent } from "@/hooks/useZodiacContent";
import { useAstralModule } from "@/hooks/useAstralModule";
import { useEnrichedZodiacProfile } from "@/hooks/useEnrichedZodiacProfile";
import { GlassCard } from "@/components/ui/GlassCard";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

interface ZodiacProfileViewProps {
    birthDate: string; // YYYY-MM-DD
    onBack: () => void;
}

export function ZodiacProfileView({ birthDate, onBack }: ZodiacProfileViewProps) {
    const profile = useMemo(() => calculateZodiacProfile(birthDate), [birthDate]);
    // Hook handles fetching dynamic data with fallback
    const { content: signContent } = useZodiacSignContent(profile?.sunSign || 'aries');
    const { moduleConfig } = useAstralModule('zodiac');
    // NEW: Hook pour les données enrichies
    const { profile: enrichedProfile, loading: enrichedLoading } = useEnrichedZodiacProfile(
        profile?.sunSign || '',
        profile?.decan || 1
    );

    if (!profile) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center bg-[var(--background-800)] rounded-2xl border border-red-500/30">
                <Icon icon="carbon:warning-filled" className="text-red-400 w-12 h-12 mb-4" />
                <h3 className="title-med mb-2 text-white">Date invalide</h3>
                <p className="para mb-6 text-[var(--text-secondary)]">Impossible de calculer votre profil avec la date fournie.</p>
                <Button variant="secondary" onClick={onBack}>Retour</Button>
            </div>
        );
    }

    const elementContent = ELEMENTS_CONTENT[profile.element];
    const modalityContent = MODALITIES_CONTENT[profile.modality];

    return (
        <div className="flex flex-col gap-6 pb-24 animate-in fade-in slide-in-from-bottom duration-500 relative">
            {/* Page Background Special (Global Module Config) */}
            {moduleConfig?.background_image_url && (
                <div className="fixed inset-0 z-[-1] w-full h-full">
                    <Image
                        src={moduleConfig.background_image_url}
                        alt="Background"
                        fill
                        className="object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-[var(--background-900)]/70"></div>
                </div>
            )}

            {/* Header / Back */}
            <div className="flex items-center gap-4">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-[var(--background-800)] transition-colors text-[var(--text-secondary)]">
                    <Icon icon="solar:arrow-left-linear" width={24} />
                </button>
                <h2 className="title-med text-[var(--text-primary)]">Mon Profil Zodiac</h2>
            </div>

            {/* CARD 1: MAIN SIGN */}
            <div className="relative w-full rounded-[32px] overflow-hidden min-h-[400px] flex flex-col justify-end p-6 group">
                {/* Background Image / Hero */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src={signContent.heroImage || '/backgrounds/tirages.png'}
                        alt={signContent.displayName}
                        fill
                        className="object-cover"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--background-900)] via-[var(--background-900)]/60 to-transparent"></div>
                </div>

                <div className="relative z-10 flex flex-col gap-2">
                    {/* Icon Glow */}
                    <div className="w-16 h-16 rounded-full bg-[var(--background-800)]/50 backdrop-blur-md flex items-center justify-center border border-[var(--warning-500)]/30 mb-2 shadow-[0_0_20px_rgba(255,215,0,0.2)] overflow-hidden relative">
                        {signContent.iconGlow && (signContent.iconGlow.startsWith('http') || signContent.iconGlow.startsWith('/')) ? (
                            <Image
                                src={signContent.iconGlow}
                                alt="Icon"
                                fill
                                className="object-cover p-1"
                            />
                        ) : (
                            <Icon icon={signContent.iconGlow || "mdi:star"} width={32} className="text-[var(--warning-400)] effect-glow-yellow" />
                        )}
                    </div>

                    <h1 className="text-4xl text-white font-serif tracking-wide">{signContent.displayName}</h1>

                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-[var(--warning-500)]/20 text-[var(--warning-300)] rounded-full text-sm font-medium border border-[var(--warning-500)]/30">
                            {profile.decan === 1 ? '1er Décan' : `${profile.decan}ème Décan`}
                        </span>
                    </div>

                    <p className="para text-[var(--text-secondary)] mt-2">
                        {signContent.descriptionMain}
                    </p>
                </div>
            </div>

            {/* SECOND ROW: ELEMENT & MODALITY */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* CARD 2: ELEMENT */}
                <GlassCard className="p-6 flex flex-col gap-4 border-none bg-gradient-to-br from-[var(--background-800)] to-[var(--background-800)]/50">
                    <div className="flex items-center justify-between">
                        <h3 className="title-lit text-[var(--text-primary)]">Élément</h3>
                        <Icon icon={elementContent.iconGlow || "mdi:shape"} width={28} className="text-[var(--primary-400)]" />
                    </div>
                    <div>
                        <span className="text-2xl font-bold text-white block mb-1">{elementContent.displayName}</span>
                        <p className="para-lit text-[var(--text-tertiary)]">{elementContent.descriptionMain}</p>
                    </div>
                </GlassCard>

                {/* CARD 3: MODALITY */}
                <GlassCard className="p-6 flex flex-col gap-4 border-none bg-gradient-to-br from-[var(--background-800)] to-[var(--background-800)]/50">
                    <div className="flex items-center justify-between">
                        <h3 className="title-lit text-[var(--text-primary)]">Modalité</h3>
                        <Icon icon={modalityContent.iconGlow || "mdi:cog"} width={28} className="text-[var(--accent-400)]" />
                    </div>
                    <div>
                        <span className="text-2xl font-bold text-white block mb-1">{modalityContent.displayName}</span>
                        <p className="para-lit text-[var(--text-tertiary)]">{modalityContent.descriptionMain}</p>
                    </div>
                </GlassCard>
            </div>

            {/* THIRD ROW: ENRICHED DATA (Planets & Season) */}
            {!enrichedLoading && enrichedProfile && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* CARD 4: PLANÈTE MAÎTRESSE */}
                    {enrichedProfile.ruling_planet && (
                        <GlassCard className="p-6 flex flex-col gap-4 border-none bg-gradient-to-br from-[var(--background-800)] to-[var(--background-800)]/50">
                            <div className="flex items-center justify-between">
                                <h3 className="title-lit text-[var(--text-primary)]">Planète Maîtresse</h3>
                                {enrichedProfile.ruling_planet.icon_image_url ? (
                                    <div className="w-12 h-12 rounded-full bg-[var(--background-800)]/50 backdrop-blur-md flex items-center justify-center border border-[var(--warning-500)]/30 shadow-[0_0_20px_rgba(255,215,0,0.2)] overflow-hidden relative">
                                        <Image
                                            src={enrichedProfile.ruling_planet.icon_image_url}
                                            alt={enrichedProfile.ruling_planet.name_fr}
                                            fill
                                            className="object-cover effect-glow-yellow"
                                        />
                                    </div>
                                ) : (
                                    <Icon icon="mdi:star" width={28} className="text-[var(--warning-400)] effect-glow-yellow" />
                                )}
                            </div>
                            <div>
                                <span className="text-2xl font-bold text-white block mb-1">
                                    {enrichedProfile.ruling_planet.name_fr}
                                </span>
                                {enrichedProfile.ruling_planet.description && (
                                    <p className="para-lit text-[var(--text-tertiary)]">
                                        {enrichedProfile.ruling_planet.description}
                                    </p>
                                )}
                            </div>
                        </GlassCard>
                    )}

                    {/* CARD 5: PLANÈTE DU DÉCAN */}
                    {enrichedProfile.decan_planet && (
                        <GlassCard className="p-6 flex flex-col gap-4 border-none bg-gradient-to-br from-[var(--background-800)] to-[var(--background-800)]/50">
                            <div className="flex items-center justify-between">
                                <h3 className="title-lit text-[var(--text-primary)]">Planète du Décan</h3>
                                {enrichedProfile.decan_planet.icon_image_url ? (
                                    <div className="w-12 h-12 rounded-full bg-[var(--background-800)]/50 backdrop-blur-md flex items-center justify-center border border-[var(--warning-500)]/30 shadow-[0_0_20px_rgba(255,215,0,0.2)] overflow-hidden relative">
                                        <Image
                                            src={enrichedProfile.decan_planet.icon_image_url}
                                            alt={enrichedProfile.decan_planet.name_fr}
                                            fill
                                            className="object-cover effect-glow-yellow"
                                        />
                                    </div>
                                ) : (
                                    <Icon icon="mdi:star" width={28} className="text-[var(--warning-400)] effect-glow-yellow" />
                                )}
                            </div>
                            <div>
                                <span className="text-2xl font-bold text-white block mb-1">
                                    {enrichedProfile.decan_planet.name_fr}
                                </span>
                                {enrichedProfile.decan_planet.description && (
                                    <p className="para-lit text-[var(--text-tertiary)]">
                                        {enrichedProfile.decan_planet.description}
                                    </p>
                                )}
                            </div>
                        </GlassCard>
                    )}

                    {/* CARD 6: SAISON ASTROLOGIQUE */}
                    {enrichedProfile.season && (
                        <GlassCard className="p-6 flex flex-col gap-4 border-none bg-gradient-to-br from-[var(--background-800)] to-[var(--background-800)]/50">
                            <div className="flex items-center justify-between">
                                <h3 className="title-lit text-[var(--text-primary)]">Saison Astrologique</h3>
                                {enrichedProfile.season.icon_image_url ? (
                                    <div className="w-12 h-12 rounded-full bg-[var(--background-800)]/50 backdrop-blur-md flex items-center justify-center border border-[var(--warning-500)]/30 shadow-[0_0_20px_rgba(255,215,0,0.2)] overflow-hidden relative">
                                        <Image
                                            src={enrichedProfile.season.icon_image_url}
                                            alt={enrichedProfile.season.title_fr}
                                            fill
                                            className="object-cover effect-glow-yellow"
                                        />
                                    </div>
                                ) : (
                                    <Icon icon="carbon:earth" width={28} className="text-[var(--accent-400)]" />
                                )}
                            </div>
                            <div>
                                <span className="text-2xl font-bold text-white block mb-1">
                                    {enrichedProfile.season.title_fr}
                                </span>
                                {enrichedProfile.season.content && (
                                    <p className="para-lit text-[var(--text-tertiary)]">
                                        {enrichedProfile.season.content}
                                    </p>
                                )}
                            </div>
                        </GlassCard>
                    )}
                </div>
            )}

            <div className="w-full flex justify-center mt-4">
                <p className="text-xs text-[var(--text-tertiary)] opacity-50 relative bottom-0">
                    Calculé sur la base de votre naissance le {birthDate}
                </p>
            </div>
        </div>
    );
}
