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
import { AstralCardMain, AstralCardGraphic, AstralCardSimple } from "@/components/astral/AstralCards";

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
        <div className="flex flex-col gap-6 pb-24 animate-in fade-in slide-in-from-bottom duration-500 relative max-w-4xl mx-auto">
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

            {/* CARD 1: MAIN SIGN (Includes Sign, Decan, Decan Planet) */}
            <AstralCardMain
                // Info Générale
                heroImageUrl={signContent.heroImage}
                signIcon={signContent.iconGlow || "mdi:star"}
                signName={signContent.displayName}
                signLegend="Ta nature profonde et ta manière d'entrer en relation avec le monde"
                signDescription={signContent.descriptionMain}

                // Décan
                decanNumber={profile.decan}
                decanLegend="Ta nuance énergétique" // Légende par défaut pour le décan
                decanDescription={
                    enrichedProfile?.decan_data?.description ||
                    "Chargement du décan..."
                }

                // Planète Décan (Info tirée de enrichedProfile)
                planetName={enrichedProfile?.decan_planet?.name_fr || "Planète..."}
                planetIconUrl={enrichedProfile?.decan_planet?.icon_image_url}
                planetLegend="L'influence sur ton expression d'énergie au quotidien"
                planetDescription={enrichedProfile?.decan_planet?.description || "Chargement..."}

                className="w-full shadow-xl"
            />

            {/* ROW 2: GRAPHIC CARD (Planète Maîtresse) */}
            {enrichedProfile?.ruling_planet && (
                <AstralCardGraphic
                    heroImageUrl={enrichedProfile.ruling_planet.icon_image_url} // Utilise l'icone comme hero si pas d'image dédiée spécifiée, ou fallback lightgray
                    typeInfo="Planète Maîtresse"
                    title={enrichedProfile.ruling_planet.name_fr}
                    legend="Ton rythme intérieur et tes réactions instinctives"
                    description={enrichedProfile.ruling_planet.description || ""}
                    // isLocked={...} // TODO: Add logic when premium context is available
                    className="w-full shadow-lg"
                />
            )}

            {/* ROW 3: SIMPLE CARD (Saison) */}
            <div className="w-full">
                {/* Saison Astrologique */}
                {enrichedProfile?.season && (
                    <AstralCardSimple
                        typeInfo="Saison Astrologique"
                        iconUrl={enrichedProfile.season.icon_image_url}
                        title={enrichedProfile.season.title_fr}
                        legend="Ta situation énergétique dans le grand cycle du vivant"
                        description={enrichedProfile.season.content || ""}
                        className="w-full"
                    />
                )}
            </div>

            <div className="w-full flex justify-center mt-4">
                <p className="text-xs text-[var(--text-tertiary)] opacity-50 relative bottom-0">
                    Calculé sur la base de votre naissance le {birthDate}
                </p>
            </div>
        </div>
    );
}
