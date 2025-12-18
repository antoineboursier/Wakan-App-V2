"use client";

import React from 'react';
import Link from 'next/link';
import { Icon } from "@iconify/react";
import { Navigation } from "@/components/layout/Navigation";
import { Separator } from "@/components/ui/Separator";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ZodiacProfileCard } from "@/components/profile/ZodiacProfileCard";
import { PremiumCard } from "@/components/ui/PremiumCard";
import { PageBackground } from "@/components/layout/PageBackground";

export default function ProfilPage() {
    return (
        <div className="min-h-screen text-[var(--text-primary)] font-body pb-32 relative">
            <PageBackground imageSrc="/backgrounds/astres.png" />
            <div className="pt-8 px-4 flex flex-col items-center max-w-md mx-auto w-full relative z-10">

                {/* Header: Vignette + Nom */}
                <ProfileHeader
                    firstName="Pat'"
                    patrolName="Loup Agile"
                />

                {/* Action Buttons */}
                <div className="flex w-full gap-4 mt-6">
                    <Link href="/profil/infos" className="flex-1">
                        <button className="btn-wakan-secondary w-full gap-2 justify-center">
                            <Icon icon="mingcute:magic-hat-fill" className="w-5 h-5 text-[var(--accent-900)]" />
                            Mes infos
                        </button>
                    </Link>

                    <button className="flex-1 btn-wakan-secondary w-full gap-2 justify-center">
                        <Icon icon="streamline:reward-stars-2-bold" className="w-5 h-5 text-[var(--accent-900)]" />
                        Mes points
                    </button>
                </div>

                <Separator className="my-4" />

                {/* Accessibilité Premium (Composant) */}
                <div className="w-full mt-6">
                    <PremiumCard variant="active" />
                </div>

                <Separator className="my-4" />

                {/* Zodiac Profile */}
                <div className="w-full mt-2">
                    <ZodiacProfileCard
                        signName="Bélier"
                        decan="2ème décan"
                        ascendant="Vierge"
                        element="Vent"
                        northNode="Poissons"
                        southNode="Vierge"
                        iconUrl=""
                    />
                </div>

                <Separator className="my-8" />

                {/* Footer Actions */}
                <div className="w-full flex flex-col gap-4 mt-4 items-center">
                    <button className="btn-wakan-secondary w-full text-[var(--ui-alert)] border-[var(--ui-alert)] hover:border-[var(--ui-on-alert)] hover:bg-[var(--background-800)] justify-center">
                        <Icon icon="mingcute:close-fill" className="w-5 h-5" />
                        Se déconnecter
                    </button>

                    <div className="flex flex-col gap-3 mt-4 items-center">
                        <Link href="#" className="para-lit text-[var(--text-tertiary)] underline decoration-1 underline-offset-4 hover:text-[var(--text-secondary)]">
                            Supprimer mon compte
                        </Link>
                        <Link href="#" className="para-lit text-[var(--text-tertiary)] underline decoration-1 underline-offset-4 hover:text-[var(--text-secondary)]">
                            A propos de l'application
                        </Link>
                    </div>
                </div>

            </div>
            <Navigation />
        </div>
    );
}
