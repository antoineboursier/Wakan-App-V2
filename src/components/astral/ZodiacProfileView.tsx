"use client";

import React, { useMemo } from "react";
import { calculateZodiacProfile } from "@/utils/astro/zodiacCalculator";
import { useZodiacSignContent } from "@/hooks/useZodiacContent";
import { useAstralModule } from "@/hooks/useAstralModule";
import { useEnrichedZodiacProfile } from "@/hooks/useEnrichedZodiacProfile";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/Button";
import { AstralCardMain, AstralCardGraphic, AstralCardSimple } from "@/components/astral/AstralCards";
import { FullscreenModal } from "@/components/ui/FullscreenModal";

interface ZodiacProfileViewProps {
    birthDate: string; // YYYY-MM-DD
    onBack: () => void;
}

export function ZodiacProfileView({ birthDate, onBack }: ZodiacProfileViewProps) {
    const profile = useMemo(() => calculateZodiacProfile(birthDate), [birthDate]);
    const { content: signContent } = useZodiacSignContent(profile?.sunSign || 'aries');
    const { moduleConfig } = useAstralModule('zodiac');
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

    return (
        <FullscreenModal
            isOpen={true}
            onBack={onBack}
            backgroundImageUrl={moduleConfig?.background_image_url}
            showShare={true}
            shareTitle={`Mon profil astrologique - ${signContent.displayName}`}
            shareText={`Je suis ${signContent.displayName} ! Découvre ton profil astral sur Wakan.`}
            backLabel="Retour"
        >
            {/* Contenu du profil zodiacal */}
            <div className="flex flex-col gap-6 px-4 pb-24 pt-4 max-w-4xl mx-auto">
                {/* ROW 1: MAIN CARD (Info Générale + Décan + Planète Décan) */}
                <AstralCardMain
                    // Info Générale
                    heroImageUrl={signContent.heroImage}
                    signIcon={signContent.iconGlow || "mdi:star"}
                    signName={signContent.displayName}
                    signLegend="Ta nature profonde et ta manière d'entrer en relation avec le monde"
                    signDescription={signContent.descriptionMain}
                    // Décan
                    decanNumber={profile.decan}
                    decanLegend="Tes nuances astrologiques"
                    decanDescription={enrichedProfile?.decan_data?.description || "Informations sur votre décan en cours de chargement..."}
                    // Planète Décan
                    planetName={enrichedProfile?.decan_planet?.name_fr || "Planète du décan"}
                    planetIconUrl={enrichedProfile?.decan_planet?.icon_image_url}
                    planetLegend="Planète du décan"
                    planetDescription={enrichedProfile?.decan_planet?.description || "Informations sur la planète du décan en cours de chargement..."}
                    className="w-full shadow-lg"
                />

                {/* ROW 2: GRAPHIC CARD (Planète Maîtresse) */}
                {enrichedProfile?.ruling_planet && (
                    <AstralCardGraphic
                        heroImageUrl={enrichedProfile.ruling_planet.icon_image_url}
                        typeInfo="Planète Maîtresse"
                        title={enrichedProfile.ruling_planet.name_fr}
                        legend="Ton rythme intérieur et tes réactions instinctives"
                        description={enrichedProfile.ruling_planet.description || ""}
                        className="w-full shadow-lg"
                    />
                )}

                {/* ROW 3: SIMPLE CARD (Saison) */}
                <div className="w-full">
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
            </div>
        </FullscreenModal>
    );
}
