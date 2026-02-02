import React, { useState } from 'react';
import Image from 'next/image';
import { Icon } from '@iconify/react';
import { Separator } from '@/components/ui/Separator';
import { Skeleton } from '@/components/ui/Skeleton';

// --- TYPES ---

interface BaseCardProps {
    className?: string;
}

interface MainCardProps extends BaseCardProps {
    // Info Générale
    heroImageUrl?: string;
    signIcon: string; // URL ou iconify ID
    signName: string;
    signLegend: string;
    signDescription: string;

    // Décan
    decanNumber: number;
    decanLegend: string;
    decanDescription: string;
    isDecanPremiumLocked?: boolean;

    // Planète Décan
    planetName: string;
    planetIconUrl?: string;
    planetLegend: string;
    planetDescription: string;
    isPlanetPremiumLocked?: boolean;
}

interface GraphicCardProps extends BaseCardProps {
    heroImageUrl?: string;
    typeInfo: string; // "Planète Maîtresse"
    title: string; // "Lune"
    legend: string;
    description: string;
    isLocked?: boolean;
}

interface SimpleCardProps extends BaseCardProps {
    typeInfo: string; // "Saison Astrologique"
    iconUrl?: string; // URL ou iconify ID
    title: string; // "Début de l'été"
    legend: string;
    description: string;
    isLocked?: boolean;
}

// --- STYLES UTILS ---
// Using Design System variables instead of hardcoded hex

const TEXT_SHADOW_UICARD = { textShadow: '0 4px 8px var(--background-800, #1C3039)' };

// --- COMPONENTS ---

/**
 * Card Principale
 * Utilise: Info Général, Décan, Planète Décan
 */
export function AstralCardMain({
    heroImageUrl,
    signIcon,
    signName,
    signLegend,
    signDescription,
    decanNumber,
    decanLegend,
    decanDescription,
    planetName,
    planetIconUrl,
    planetLegend,
    planetDescription,
    className = ''
}: MainCardProps) {
    const [imageLoaded, setImageLoaded] = useState(false);

    return (
        <div className={`flex flex-col items-center bg-[var(--background-900)] backdrop-blur-[2px] rounded-lg ${className}`}>
            {/* Hero Image */}
            <div className="h-[400px] w-full self-stretch rounded-t-lg relative overflow-hidden bg-[var(--background-900)]">
                {heroImageUrl ? (
                    <>
                        <Image
                            src={heroImageUrl}
                            alt={signName}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 800px"
                            priority
                            onLoad={() => setImageLoaded(true)}
                        />
                        {!imageLoaded && <Skeleton className="absolute inset-0" rounded={false} />}
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--background-900)] z-10" />
                    </>
                ) : (
                    <Skeleton className="absolute inset-0" rounded={false} />
                )}
            </div>

            {/* Conteneur de texte */}
            <div className="flex flex-col items-center gap-6 p-6 w-full -mt-10 relative z-10">

                {/* --- INFO GÉNÉRALE --- */}

                {/* Icône Info Général + Glow */}
                <div className="relative w-10 h-10">
                    {/* Glow effect simulation */}
                    <div className="absolute inset-0 bg-[var(--accent-900)] blur-md opacity-40 rounded-full" />
                    {signIcon.startsWith('http') || signIcon.startsWith('/') ? (
                        <img src={signIcon} alt={signName} className="w-full h-full object-contain relative z-10" />
                    ) : (
                        <Icon icon={signIcon} className="w-full h-full text-[var(--accent-900)] relative z-10" />
                    )}
                </div>

                {/* Nom du signe */}
                <h2 className="text-[var(--accent-900)] text-center text-3xl font-bold font-display" style={TEXT_SHADOW_UICARD}>
                    {signName}
                </h2>

                {/* Légende */}
                <p className="para-lit text-[var(--text-secondary)] text-center">
                    {signLegend}
                </p>

                {/* Description */}
                <div
                    className="para text-[var(--text-primary)] text-center rich-content"
                    dangerouslySetInnerHTML={{ __html: signDescription }}
                />

                {/* Separator */}
                <Separator className="max-w-[200px]" />

                {/* --- DÉCAN --- */}

                <div className="flex flex-col items-center gap-2 w-full">
                    {/* Le décan (Titre Med) */}
                    <h3 className="text-[var(--accent-700)] text-center text-xl font-bold font-display">
                        {decanNumber}{decanNumber === 1 ? 'er' : 'ème'} Décan
                    </h3>

                    {/* Légende */}
                    <p className="para-lit text-[var(--text-secondary)] text-center">
                        {decanLegend}
                    </p>

                    {/* Description */}
                    <div
                        className="para text-[var(--text-primary)] text-center mt-2 rich-content"
                        dangerouslySetInnerHTML={{ __html: decanDescription }}
                    />
                </div>

                {/* Separator */}
                <Separator className="max-w-[200px]" />

                {/* --- PLANÈTE DÉCAN --- */}

                <p className="text-[var(--accent-500)] text-center text-sm font-semibold font-display">
                    Planète du décan
                </p>

                <div className="flex flex-col items-center gap-2 w-full mt-2">
                    {/* Icône Planète Décan */}
                    {planetIconUrl ? (
                        <img src={planetIconUrl} alt="Planète Décan" className="w-10 h-10 object-contain" />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-[var(--accent-500)]/20 flex items-center justify-center">
                            <Icon icon="mdi:planet" className="text-[var(--accent-500)]" />
                        </div>
                    )}

                    {/* Nom Planète */}
                    <h3 className="text-[var(--accent-700)] text-center text-xl font-bold font-display">
                        {planetName}
                    </h3>

                    {/* Légende Planète */}
                    <p className="para-lit text-[var(--text-secondary)] text-center">
                        {planetLegend}
                    </p>

                    {/* Description Planète */}
                    <div
                        className="para text-[var(--text-primary)] text-center mt-2 rich-content"
                        dangerouslySetInnerHTML={{ __html: planetDescription }}
                    />
                </div>

            </div>
        </div>
    );
}

/**
 * Card Graphique (Planète Maîtresse)
 * Avec état désactivé (Premium)
 */
export function AstralCardGraphic({
    heroImageUrl,
    typeInfo,
    title,
    legend,
    description,
    isLocked = false,
    className = ''
}: GraphicCardProps) {
    const [imageLoaded, setImageLoaded] = useState(false);

    // --- MODE LOCKED ---
    if (isLocked) {
        return (
            <div className={`flex flex-col items-center bg-[var(--background-900)] backdrop-blur-[2px] rounded-lg overflow-hidden ${className}`}>
                {/* Image */}
                <div className="h-[120px] md:h-[180px] w-full self-stretch relative overflow-hidden bg-[var(--background-900)]">
                    {heroImageUrl ? (
                        <>
                            <Image
                                src={heroImageUrl}
                                alt={title}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 800px"
                                onLoad={() => setImageLoaded(true)}
                            />
                            {!imageLoaded && <Skeleton className="absolute inset-0" rounded={false} />}
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--background-900)] z-10" />
                        </>
                    ) : (
                        <Skeleton className="absolute inset-0" rounded={false} />
                    )}
                </div>

                <div className="flex flex-col items-start gap-2 p-6 w-full -mt-4 relative z-10">
                    {/* Titre (Locked Color) */}
                    <h4 className="text-[var(--text-disabled)] text-sm font-semibold font-display text-center w-full">
                        {typeInfo}
                    </h4>

                    {/* Légende (Locked) */}
                    <p className="para-lit text-[var(--text-secondary)] text-center w-full">
                        {legend}
                    </p>

                    {/* Bloc Premium */}
                    <div className="flex items-center justify-center gap-2 w-full mt-4 p-4 bg-[var(--background-900)]/50 rounded border border-white/10">
                        <span className="text-[var(--text-secondary)] font-sans">Option Premium</span>
                        <Icon icon="mingcute:lock-fill" className="text-[var(--text-disabled)]" width={20} />
                    </div>
                </div>
            </div>
        );
    }

    // --- MODE NORMAL ---
    return (
        <div className={`flex flex-col items-center bg-[var(--background-900)] backdrop-blur-[2px] rounded-lg ${className}`}>
            {/* Hero Image */}
            <div className="h-[120px] md:h-[180px] w-full self-stretch rounded-t-lg relative overflow-hidden bg-[var(--background-900)]">
                {heroImageUrl ? (
                    <>
                        <Image
                            src={heroImageUrl}
                            alt={title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 800px"
                            onLoad={() => setImageLoaded(true)}
                        />
                        {!imageLoaded && <Skeleton className="absolute inset-0" rounded={false} />}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--background-900)] z-10" />
                    </>
                ) : (
                    <Skeleton className="absolute inset-0" rounded={false} />
                )}
            </div>

            <div className="flex flex-col items-center gap-6 p-6 w-full -mt-6 relative z-10">
                <div className="flex flex-col items-center gap-2 w-full">
                    {/* Nom Type Info */}
                    <h4 className="text-[var(--accent-700)] text-sm font-semibold font-display text-center">
                        {typeInfo}
                    </h4>

                    {/* Nom Planète */}
                    <h2 className="text-[var(--accent-900)] text-center text-3xl font-bold font-display" style={TEXT_SHADOW_UICARD}>
                        {title}
                    </h2>
                </div>

                {/* Légende */}
                <p className="para-lit text-[var(--text-secondary)] text-center">
                    {legend}
                </p>

                {/* Description */}
                <div
                    className="para text-[var(--text-primary)] text-center rich-content"
                    dangerouslySetInnerHTML={{ __html: description }}
                />
            </div>
        </div>
    );
}

/**
 * Card Simple (Saison, Élément)
 * Avec état désactivé (Premium)
 */
export function AstralCardSimple({
    typeInfo,
    iconUrl,
    title,
    legend,
    description,
    isLocked = false,
    className = ''
}: SimpleCardProps) {
    // Background Gradient constant (using CSS vars for colors if possible, but gradients are tricky, keeping hex for transparency logic but better to use rgba vars)
    // Using simple gradient from DS background steps
    const bgGradient = "bg-gradient-to-b from-[var(--background-800)]/30 via-[var(--background-800)]/60 to-[var(--background-800)]/90";

    // --- MODE LOCKED ---
    if (isLocked) {
        return (
            <div className={`flex flex-col items-center justify-center gap-6 p-6 rounded-lg ${bgGradient} ${className}`}>
                {/* Nom Type Info (Locked Color) */}
                <h4 className="text-[var(--text-disabled)] text-center text-sm font-semibold font-display">
                    {typeInfo}
                </h4>

                {/* Pas d'icône, Pas de nom */}

                {/* Légende */}
                <p className="para-lit text-[var(--text-secondary)] text-center">
                    {legend}
                </p>

                {/* Bloc Premium */}
                <div className="flex items-center justify-center gap-2 w-full mt-2">
                    <span className="text-[var(--text-secondary)] font-sans">Option Premium</span>
                    <Icon icon="mingcute:lock-fill" className="text-[var(--text-disabled)]" width={20} />
                </div>
            </div>
        )
    }

    // --- MODE NORMAL ---
    return (
        <div className={`flex flex-col items-center justify-center gap-6 p-6 rounded-lg ${bgGradient} ${className}`}>
            {/* Nom Type Info */}
            <h4 className="text-[var(--accent-500)] text-center text-sm font-semibold font-display">
                {typeInfo}
            </h4>

            {/* Container Icône + Nom */}
            <div className="flex flex-col items-center gap-2">
                {/* Icône */}
                <div className="w-10 h-10">
                    {iconUrl ? (
                        (iconUrl.startsWith('http') || iconUrl.startsWith('/')) ? (
                            <img src={iconUrl} alt={title} className="w-full h-full object-contain opacity-80" />
                        ) : (
                            <Icon icon={iconUrl} className="w-full h-full text-[var(--accent-900)] opacity-80" />
                        )
                    ) : (
                        <div className="w-full h-full" />
                    )}
                </div>

                {/* Nom */}
                <h2 className="text-[var(--accent-900)] text-center text-3xl font-bold font-display" style={TEXT_SHADOW_UICARD}>
                    {title}
                </h2>
            </div>

            {/* Légende */}
            <p className="para-lit text-[var(--text-secondary)] text-center">
                {legend}
            </p>

            {/* Description */}
            <div
                className="para text-[var(--text-primary)] text-center rich-content"
                dangerouslySetInnerHTML={{ __html: description }}
            />
        </div>
    );
}
