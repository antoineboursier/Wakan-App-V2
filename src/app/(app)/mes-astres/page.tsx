"use client";

import { useState, useMemo, useEffect } from "react";
import { getAstralModules } from "@/data/astralModules";
import { useUserProfile } from "@/hooks/useUserProfile";
import { AstralModule, AstralModuleDefinition } from "@/types/astral";
import { AstralModuleCard } from "@/components/astral/AstralModuleCard";
import { ProfileCompletionModal } from "@/components/astral/ProfileCompletionModal";
import { MasonryGrid } from "@/components/ui/MasonryGrid";
import { useRouter } from "next/navigation";
import { PageBackground } from "@/components/layout/PageBackground";
import { Button } from "@/components/ui/Button";
import { Icon } from "@iconify/react";
import { PremiumCard } from "@/components/ui/PremiumCard";
import { Separator } from "@/components/ui/Separator";

import { AnimatePresence, motion } from "framer-motion";
import { AnimatedTabs } from "@/components/ui/AnimatedTabs";
import { useToast } from "@/components/ui/Toast";
import { InputField } from "@/components/ui/InputField";
import { CityAutocomplete } from "@/components/ui/CityAutocomplete";

import { ZodiacProfileView } from "@/components/astral/ZodiacProfileView";
import { ZodiacProfileCard } from "@/components/profile/ZodiacProfileCard";
import { calculateZodiacProfile } from "@/utils/astro/zodiacCalculator";
import { useEnrichedZodiacProfile } from "@/hooks/useEnrichedZodiacProfile";
import { useEntitlements } from "@/hooks/useEntitlements";

export default function MesAstresPage() {
    const router = useRouter();
    const { profile, isLoaded, updateBirthData, saveBirthData, updateProfile, saveProfile, clearProfile } = useUserProfile();
    const { isPremium } = useEntitlements();
    const { showToast } = useToast();

    // Tabs state
    const [activeTab, setActiveTab] = useState("astres");
    // View state
    const [viewModuleId, setViewModuleId] = useState<string | null>(null);

    // Modal state
    const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);
    const [targetModuleDefinition, setTargetModuleDefinition] = useState<AstralModuleDefinition | null>(null);

    // --- Zodiac Data Calculation ---
    const computedZodiac = useMemo(() => {
        if (!profile.birthData?.date) return null;
        return calculateZodiacProfile(profile.birthData.date);
    }, [profile.birthData?.date]);

    // Fetch Enriched Data (Images, Descriptions, etc.)
    const { profile: enrichedZodiacData, loading: loadingZodiac } = useEnrichedZodiacProfile(
        computedZodiac?.sunSign || '',
        computedZodiac?.decan || 1
    );

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
        if (module.id === 'zodiac') {
            setViewModuleId('zodiac');
        } else {
            console.log("Navigating to module:", module.id);
            alert(`Navigation vers le module : ${module.title}\n(Page en construction)`);
        }
    };

    const handleSaveCompletion = (data: any) => {
        updateBirthData(data);
        saveBirthData(data).then(ok => {
            if (ok) showToast("Informations enregistrées", "success");
        });
    };

    const onBlurProfile = (field: keyof typeof profile) => {
        const val = profile[field];
        if (val !== undefined && typeof val === 'string') {
            saveProfile({ [field]: val }).then(ok => {
                if (ok) showToast("Profil mis à jour", "success");
            });
        }
    };

    const onBlurBirthData = (field: 'date' | 'time' | 'place') => {
        if (!profile.birthData) return;
        const val = profile.birthData[field];
        if (val) {
            saveBirthData({ [field]: val }).then(ok => {
                if (ok) showToast("Informations astrales mises à jour", "success");
            });
        }
    };

    // Helper to save data from Zodiac Card Modal
    const handleAddZodiacInfo = (data: { time?: string; place?: any }) => {
        // Merge updates
        const updates: any = {};
        if (data.time) updates.time = data.time;
        if (data.place) updates.place = data.place;

        updateBirthData(updates);
        saveBirthData(updates).then(ok => {
            if (ok) showToast("Informations complétées !", "success");
        });
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
                    {activeTab === 'astres' && (
                        <motion.div
                            key="astres"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                            className="flex flex-col gap-6"
                        >
                            {/* Premium Banner */}
                            {!isPremium && userHasCompletedProfile(profile) && (
                                <div className="w-full">
                                    <PremiumCard variant="sales" />
                                </div>
                            )}

                            {/* Solar Separator */}
                            <div className="flex justify-center items-center gap-4 py-2 opacity-60">
                                <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[var(--accent-500)]"></div>
                                <Icon icon="mdi:white-balance-sunny" className="text-[var(--accent-500)] w-5 h-5 animate-pulse-slow" />
                                <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[var(--accent-500)]"></div>
                            </div>

                            {/* Grid des modules */}
                            <MasonryGrid>
                                {modules.map((module) => {
                                    if (module.id === 'zodiac') {
                                        // Si on a les données pour afficher le profil enrichi, on affiche la nouvelle carte
                                        if (enrichedZodiacData && !loadingZodiac) {

                                            // Mock Ascendant (in real app, this comes from backend calc)
                                            // Using forced missing state as requested.

                                            return (
                                                <ZodiacProfileCard
                                                    key={module.id}
                                                    signName={enrichedZodiacData.sign_name || enrichedZodiacData.sign_slug} // Fallback
                                                    signIconUrl={enrichedZodiacData.sign_icon_glow || ""}
                                                    heroImageUrl={enrichedZodiacData.sign_hero_image}
                                                    decan={`${enrichedZodiacData.decan}${enrichedZodiacData.decan === 1 ? 'er' : 'ème'} Décan`}

                                                    // Ruling Planet (Available but simplified icon)
                                                    rulingPlanet={{
                                                        label: "Planète Maîtresse",
                                                        value: enrichedZodiacData.ruling_planet?.name_fr || "Inconnue",
                                                        // iconUrl: enrichedZodiacData.ruling_planet?.icon_image_url, // Disabled
                                                        isLocked: !isPremium && enrichedZodiacData.is_master_planet_premium
                                                    }}

                                                    // Ascendant (Forced Missing State)
                                                    ascendant={{
                                                        label: "Ascendant",
                                                        missingRequirement: 'birthTime' // Always show Add button for now
                                                    }}

                                                    // Use module for premium check if available there? No relying on explicit entitlement.
                                                    onAddInfo={handleAddZodiacInfo}
                                                    onViewDetail={() => setViewModuleId('zodiac')}
                                                />
                                            );
                                        }
                                        // Fallback loading or empty if no birthdate
                                        if (!profile.birthData?.date) {
                                            return (
                                                <AstralModuleCard
                                                    key={module.id}
                                                    module={module}
                                                    onComplete={() => handleComplete(module)}
                                                    onView={() => { }}
                                                />
                                            );
                                        }
                                    }

                                    // Default Generic Card for other modules
                                    return (
                                        <AstralModuleCard
                                            key={module.id}
                                            module={module}
                                            onComplete={() => handleComplete(module)}
                                            onView={() => handleView(module)}
                                        />
                                    );
                                })}
                            </MasonryGrid>
                        </motion.div>
                    )}

                    {activeTab === 'profil' && (
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
                                    onBlur={() => onBlurProfile('lastName')}
                                />
                                <InputField
                                    label="Prénom (Nom de patrouille)"
                                    placeholder="Votre prénom"
                                    value={profile.firstName || ''}
                                    onChange={(e) => updateProfile({ firstName: e.target.value })}
                                    onBlur={() => onBlurProfile('firstName')}
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
                                    onBlur={() => onBlurBirthData('date')}
                                    icon="solar:calendar-date-linear"
                                />
                                <InputField
                                    label="Heure de naissance"
                                    type="time"
                                    value={profile.birthData?.time || ''}
                                    onChange={(e) => updateBirthData({ time: e.target.value })}
                                    onBlur={() => onBlurBirthData('time')}
                                    icon="solar:clock-circle-linear"
                                />
                                <CityAutocomplete
                                    label="Lieu de naissance"
                                    placeholder="Rechercher une ville..."
                                    value={profile.birthData?.place?.city ? `${profile.birthData.place.city}, ${profile.birthData.place.country}` : ''}
                                    onSelect={(city) => {
                                        const placeData = {
                                            city: city.name,
                                            country: city.country,
                                            lat: city.latitude,
                                            lng: city.longitude,
                                            timezone: city.timezone
                                        };
                                        updateBirthData({ place: placeData });
                                        saveBirthData({ place: placeData }).then(ok => {
                                            if (ok) showToast("Lieu de naissance enregistré", "success");
                                        });
                                    }}
                                    subtext="Saisissez votre ville pour le calcul précis."
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
                                {/* Removed unimplemented buttons to clean up UI for now or keep them dormant */}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Keep completion Modal for 'astres' view triggered by generic cards */}
                {targetModuleDefinition && (
                    <ProfileCompletionModal
                        isOpen={isCompletionModalOpen}
                        onClose={() => setIsCompletionModalOpen(false)}
                        missingFields={targetModuleDefinition.requiredFields}
                        onSave={handleSaveCompletion}
                    />
                )}
            </div>

            {/* Zodiac Profile Modal - fullscreen like quiz results */}
            <AnimatePresence>
                {viewModuleId === 'zodiac' && profile.birthData?.date && (
                    <ZodiacProfileView
                        birthDate={profile.birthData.date}
                        onBack={() => setViewModuleId(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

function userHasCompletedProfile(p: any) {
    return !!p.birthData?.date;
}
