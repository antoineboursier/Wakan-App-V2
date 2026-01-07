"use client";

import { useState, useMemo } from "react";
import { getAstralModules } from "@/data/astralModules";
import { useUserProfile } from "@/hooks/useUserProfile";
import { AstralModule, AstralModuleDefinition } from "@/types/astral";
import { AstralModuleCard } from "@/components/astral/AstralModuleCard";
import { ProfileCompletionModal } from "@/components/astral/ProfileCompletionModal";
import { MasonryGrid } from "@/components/ui/MasonryGrid";
import { useRouter } from "next/navigation";
import { PageBackground } from "@/components/layout/PageBackground";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { Button } from "@/components/ui/Button";
import { Icon } from "@iconify/react";
import { PremiumCard } from "@/components/ui/PremiumCard";
import { Separator } from "@/components/ui/Separator";

import { AnimatePresence, motion } from "framer-motion";
import { AnimatedTabs } from "@/components/ui/AnimatedTabs";
import { InputField } from "@/components/ui/InputField";

export default function MesAstresPage() {
    const router = useRouter();
    const { profile, isLoaded, updateBirthData, updateProfile, clearProfile } = useUserProfile();

    // Tabs state
    const [activeTab, setActiveTab] = useState("astres");

    // Modal state
    const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);
    const [targetModuleDefinition, setTargetModuleDefinition] = useState<AstralModuleDefinition | null>(null);

    // Compute modules with unlocked status
    const modules: AstralModule[] = useMemo(() => {
        if (!isLoaded) return [];

        const baseModules = getAstralModules(); // Les modules triés (Zodiac, Lunar, etc.)

        return baseModules.map(config => {
            const def = config.definition;
            const missingFields: Array<'birthDate' | 'birthTime' | 'birthPlace'> = [];

            if (def.requiredFields.includes('birthDate') && !profile.birthData?.date) missingFields.push('birthDate');
            if (def.requiredFields.includes('birthTime') && !profile.birthData?.time) missingFields.push('birthTime');
            if (def.requiredFields.includes('birthPlace') && (!profile.birthData?.place?.city || !profile.birthData?.place?.country)) missingFields.push('birthPlace');

            return {
                ...config,
                definition: def,
                isUnlocked: missingFields.length === 0,
                missingFields
            };
        });
    }, [isLoaded, profile]);

    // Handlers
    const handleComplete = (module: AstralModule) => {
        setTargetModuleDefinition(module.definition);
        setIsCompletionModalOpen(true);
    };

    const handleView = (module: AstralModule) => {
        console.log("Navigating to module:", module.id);
        alert(`Navigation vers le module : ${module.title}\n(Page en construction)`);
    };

    const handleSaveCompletion = (data: any) => {
        updateBirthData(data);
    };

    if (!isLoaded) return null;

    const TABS = [
        { id: "astres", label: "Mes astres", icon: "solar:star-ring-bold" },
        { id: "profil", label: "Mon profil", icon: "icon-park-solid:sorcerer-hat" }
    ];

    return (
        <div className="min-h-screen text-[var(--text-primary)] font-body pb-32 relative">
            <PageBackground imageSrc="/backgrounds/astres.png" />

            <div className="w-full min-h-full p-4 md:p-8 flex flex-col gap-6 relative z-10 max-w-5xl mx-auto">

                {/* 1. Header Navigation Tabs */}
                <div className="flex justify-center w-full mt-4 mb-4 animate-in fade-in slide-in-from-top duration-700">
                    <AnimatedTabs
                        tabs={TABS}
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                    />
                </div>

                {/* 2. Content Views */}
                <AnimatePresence mode="wait">
                    {activeTab === 'astres' ? (
                        <motion.div
                            key="astres"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                            className="flex flex-col gap-6"
                        >
                            {/* Premium Banner */}
                            <div className="w-full">
                                <PremiumCard variant="sales" />
                            </div>

                            {/* Solar Separator */}
                            <div className="flex justify-center items-center gap-4 py-2 opacity-60">
                                <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[var(--accent-500)]"></div>
                                <Icon icon="mdi:white-balance-sunny" className="text-[var(--accent-500)] w-5 h-5 animate-pulse-slow" />
                                <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[var(--accent-500)]"></div>
                            </div>

                            {/* Grid des modules */}
                            <MasonryGrid>
                                {modules.map((module) => (
                                    <AstralModuleCard
                                        key={module.id}
                                        module={module}
                                        onComplete={() => handleComplete(module)}
                                        onView={() => handleView(module)}
                                    />
                                ))}
                            </MasonryGrid>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="profil"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="flex flex-col gap-6 max-w-md mx-auto w-full pt-4"
                        >
                            {/* Section Identité */}
                            <div className="w-full flex flex-col gap-2 bg-[var(--background-800)]/50 p-6 rounded-2xl border border-[var(--text-tertiary)] backdrop-blur-sm">
                                <h3 className="title-lit text-[var(--accent-500)] mb-2">
                                    Mes informations personnelles
                                </h3>

                                <InputField
                                    label="Nom"
                                    placeholder="Votre nom"
                                    value={profile.lastName || ''}
                                    onChange={(e) => updateProfile({ lastName: e.target.value })}
                                />
                                <InputField
                                    label="Prénom (Nom de patrouille)"
                                    placeholder="Votre prénom"
                                    value={profile.firstName || ''}
                                    onChange={(e) => updateProfile({ firstName: e.target.value })}
                                />
                                <InputField
                                    label="Email"
                                    type="email"
                                    placeholder="votre@email.com"
                                    value={profile.email || ''}
                                    icon="mdi:mail"
                                    disabled
                                />
                                <InputField
                                    label="ID Wakan"
                                    value={profile.wakanId || 'Non attribué'}
                                    disabled
                                    icon="game-icons:witch-flight"
                                    subtext="Cet identifiant est unique."
                                />
                            </div>

                            {/* Section Astrale */}
                            <div className="w-full flex flex-col gap-2 bg-[var(--background-800)]/50 p-6 rounded-2xl border border-[var(--text-tertiary)] backdrop-blur-sm">
                                <h2 className="title-lit text-[var(--accent-500)] mb-2">
                                    Mes informations astrales
                                </h2>

                                <InputField
                                    label="Date de naissance"
                                    type="date"
                                    value={profile.birthData?.date || ''}
                                    onChange={(e) => updateBirthData({ date: e.target.value })}
                                    icon="solar:calendar-date-linear"
                                />
                                <InputField
                                    label="Heure de naissance"
                                    type="time"
                                    value={profile.birthData?.time || ''}
                                    onChange={(e) => updateBirthData({ time: e.target.value })}
                                    icon="solar:clock-circle-linear"
                                />
                                <InputField
                                    label="Lieu de naissance"
                                    placeholder="Ville, Pays"
                                    icon="solar:map-point-linear"
                                    value={profile.birthData?.place?.city ? `${profile.birthData.place.city}, ${profile.birthData.place.country}` : ''}
                                    onChange={(e) => {
                                        const v = e.target.value;
                                        const splitted = v.split(',');
                                        const city = splitted[0]?.trim() || v;
                                        const country = splitted[1]?.trim() || 'France';
                                        updateBirthData({ place: { city, country, lat: 48.85, lng: 2.35 } });
                                    }}
                                />
                            </div>

                            <Separator className="w-full mb-2" />

                            {/* Footer inside profil tab */}
                            <div className="flex flex-col items-center gap-8 w-full">
                                <Button
                                    variant="secondary"
                                    icon={<Icon icon="mingcute:close-line" />}
                                    className=""
                                    onClick={() => clearProfile()}
                                >
                                    Se déconnecter
                                </Button>

                                <button className="ui-button-text underline !font-normal text-sm text-[var(--text-secondary)] hover:text-white transition-colors">
                                    Supprimer mon compte
                                </button>
                                <button className="ui-button-text underline !font-normal text-sm text-[var(--text-secondary)] hover:text-white transition-colors">
                                    À propos de l'application
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Keep completion Modal for 'astres' view triggered by cards */}
                {targetModuleDefinition && (
                    <ProfileCompletionModal
                        isOpen={isCompletionModalOpen}
                        onClose={() => setIsCompletionModalOpen(false)}
                        missingFields={targetModuleDefinition.requiredFields}
                        onSave={handleSaveCompletion}
                    />
                )}
            </div>
        </div>
    );
}
