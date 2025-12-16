"use client";

import React from 'react';
import Link from 'next/link';
import { Icon } from "@iconify/react";
import { Navigation } from "@/components/layout/Navigation";
import { Separator } from "@/components/ui/Separator";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ZodiacProfileCard } from "@/components/profile/ZodiacProfileCard";

export default function ProfilPage() {
    return (
        <div className="min-h-screen bg-[var(--background-900)] text-[var(--text-primary)] font-body pb-32">
            <div className="pt-8 px-4 flex flex-col items-center max-w-md mx-auto w-full">

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

                <div className="w-full mt-6">
                    <Separator />
                </div>

                {/* Accessibilité Premium (Mock) */}
                <div className="w-full mt-6 p-4 rounded-2xl bg-gradient-to-r from-[var(--background-800)] to-[var(--background-700)] border border-[var(--accent-700)] shadow-[0_4px_20px_rgba(241,186,91,0.1)] flex items-center justify-between cursor-pointer hover:brightness-110 transition-all">
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
                </div>

                <div className="w-full mt-6">
                    <Separator />
                </div>

                {/* Zodiac Profile */}
                <div className="w-full mt-2">
                    <ZodiacProfileCard
                        signName="Bélier"
                        decan="2ème décan"
                        ascendant="Vierge"
                        element="Vent"
                        iconUrl=""
                    />
                </div>

                <div className="w-full mt-8">
                    <Separator />
                </div>

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
