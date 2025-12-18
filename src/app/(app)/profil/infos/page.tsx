"use client";

import React from 'react';
import Link from 'next/link';
import { Icon } from "@iconify/react";
import { Navigation } from "@/components/layout/Navigation";
import { Separator } from "@/components/ui/Separator";
import { InputField } from "@/components/ui/InputField";
import { PageBackground } from "@/components/layout/PageBackground";

export default function PersonalInfosPage() {
    return (
        <div className="min-h-screen text-[var(--text-primary)] font-body pb-32 relative">
            <PageBackground imageSrc="/backgrounds/astres.png" />
            <div className="pt-8 px-4 flex flex-col items-center max-w-md mx-auto w-full relative z-10">

                {/* Header Navigation Back */}
                <div className="w-full flex items-center justify-between mb-6">
                    <Link href="/profil" className="p-2 -ml-2 rounded-full hover:bg-[var(--background-800)] transition-colors">
                        <Icon icon="solar:arrow-left-linear" className="w-6 h-6 text-[var(--text-primary)]" />
                    </Link>
                    <h1 className="title-med text-[var(--text-primary)]">Mes informations</h1>
                    <div className="w-6 h-6"></div> {/* Spacer for alignment */}
                </div>

                {/* Section Identité */}
                <div className="w-full flex flex-col gap-4">
                    <InputField label="Nom" placeholder="Votre nom" defaultValue="Pat'" />
                    <InputField label="Prénom" placeholder="Votre prénom" defaultValue="Loup Agile" />
                    <InputField label="Email" type="email" placeholder="votre@email.com" defaultValue="pat@wakan.com" icon="solar:letter-linear" />

                    {/* ID Wakan (Lecture seule) */}
                    <InputField
                        label="ID Wakan"
                        value="WAK-8842-XJ"
                        disabled
                        icon="solar:card-2-linear"
                        subtext="Cet identifiant est unique et ne peut pas être modifié."
                    />
                </div>

                <Separator className="my-4" />

                {/* Section Astrale */}
                <div className="w-full flex flex-col gap-6">
                    {/* Section Title */}
                    <div className="flex items-center gap-2 justify-center mb-2">
                        <Icon icon="ph:sun-fill" className="w-6 h-6 text-[var(--accent-900)]" />
                        <h2 className="title-lit text-[var(--accent-900)]">Mes informations astrales</h2>
                    </div>

                    <InputField label="Date de naissance" type="date" placeholder="JJ/MM/AAAA" />
                    <InputField label="Heure de naissance" type="time" placeholder="HH:MM" />
                    <InputField label="Lieu de naissance" placeholder="Ville, Pays" icon="solar:map-point-linear" />
                </div>

                {/* Save Button */}
                <div className="w-full mt-10">
                    <button className="btn-wakan-primary w-full shadow-lg justify-center">
                        Enregistrer les modifications
                    </button>
                </div>

            </div>
            <Navigation />
        </div>
    );
}
