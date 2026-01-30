import React from 'react';
import { Icon } from '@iconify/react';
import { Separator } from '@/components/ui/Separator';

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
    isDecanPremiumLocked?: boolean; // Si true, on pourrait masquer ou afficher différemment (non spécifié dans le prompt, mais utile)

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
    isLocked?: boolean; // Premium activé mais user non premium
}

interface SimpleCardProps extends BaseCardProps {
    typeInfo: string; // "Saison Astrologique"
    iconUrl?: string; // URL ou iconify ID
    title: string; // "Début de l'été"
    legend: string;
    description: string;
    isLocked?: boolean; // Premium activé mais user non premium
}

// --- STYLES UTILS (Tailwind arbitrary values based on Figma) ---
// Note: We use style tags or utility classes to match the User's CSS exactly.

const TEXT_SHADOW_UICARD = { textShadow: '0 4px 8px #1C3039' };

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
    return (
        <div className={`flex flex-col items-center bg-[#18272E] backdrop-blur-[2px] rounded-lg ${className}`}>
            {/* Hero Image */}
            <div
                className="h-[300px] md:h-[400px] w-full self-stretch rounded-t-lg bg-cover bg-center bg-no-repeat relative"
                style={{
                    backgroundImage: heroImageUrl ? `url(${heroImageUrl})` : undefined,
                    backgroundColor: 'lightgray' // fallback
                }}
            >
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#18272E00] to-[#18272E]" />
            </div>

            {/* Conteneur de texte */}
            {/* Note: User specified "gap: -40px" on container. In CSS flex, gap isn't negative.
                We simulate the pull-up effect by applying negative margin to this content container 
                so it overlaps the gradient/image above. */}
            <div className="flex flex-col items-center gap-6 p-6 w-full -mt-10 relative z-10">

                {/* --- INFO GÉNÉRALE --- */}

                {/* Icône Info Général + Glow */}
                <div className="relative w-10 h-10">
                    {/* Glow effect simulation (simple shadow or radial gradient behind) */}
                    <div className="absolute inset-0 bg-[#F6AE31] blur-md opacity-40 rounded-full" />
                    {signIcon.startsWith('http') || signIcon.startsWith('/') ? (
                        <img src={signIcon} alt={signName} className="w-full h-full object-contain relative z-10" />
                    ) : (
                        <Icon icon={signIcon} className="w-full h-full text-[#F6AE31] relative z-10" />
                    )}
                </div>

                {/* Nom du signe */}
                <h2 className="text-[#F6AE31] text-center text-3xl font-bold font-league-spartan" style={TEXT_SHADOW_UICARD}>
                    {signName}
                </h2>

                {/* Légende */}
                <p className="text-[#969491] text-center text-xs font-league-spartan">
                    {signLegend}
                </p>

                {/* Description */}
                <div className="text-[#F4EFEB] text-center text-base leading-relaxed font-outfit">
                    {signDescription}
                </div>

                {/* Separator */}
                <Separator className="max-w-[200px] opacity-60" />

                {/* --- DÉCAN --- */}

                <div className="flex flex-col items-center gap-2 w-full">
                    {/* Le décan (Titre Med) */}
                    <h3 className="text-[#F1BA5B] text-center text-xl font-bold font-league-spartan">
                        {decanNumber}{decanNumber === 1 ? 'er' : 'ème'} Décan
                    </h3>

                    {/* Légende */}
                    <p className="text-[#969491] text-center text-xs font-league-spartan">
                        {decanLegend}
                    </p>

                    {/* Description */}
                    <div className="text-[#F4EFEB] text-center text-base leading-relaxed font-outfit mt-2">
                        {decanDescription}
                    </div>
                </div>

                {/* Separator */}
                <Separator className="max-w-[200px] opacity-60" />

                {/* --- PLANÈTE DÉCAN --- */}

                <p className="text-[#F5CE8A] text-center text-sm font-semibold font-league-spartan">
                    Planète du décan
                </p>

                <div className="flex flex-col items-center gap-2 w-full mt-2">
                    {/* Icône Planète Décan */}
                    {planetIconUrl ? (
                        <img src={planetIconUrl} alt="Planète Décan" className="w-10 h-10 object-contain" />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-[#F5CE8A]/20 flex items-center justify-center">
                            <Icon icon="mdi:planet" className="text-[#F5CE8A]" />
                        </div>
                    )}

                    {/* Nom Planète */}
                    <h3 className="text-[#F1BA5B] text-center text-xl font-bold font-league-spartan">
                        {planetName}
                    </h3>

                    {/* Légende Planète */}
                    <p className="text-[#969491] text-center text-xs font-league-spartan">
                        {planetLegend}
                    </p>

                    {/* Description Planète */}
                    <div className="text-[#F4EFEB] text-center text-base leading-relaxed font-outfit mt-2">
                        {planetDescription}
                    </div>
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

    // --- MODE LOCKED ---
    if (isLocked) {
        return (
            <div className={`flex flex-col items-center bg-[#18272E] backdrop-blur-[2px] rounded-lg overflow-hidden ${className}`}>
                {/* Image (floutée ou sombre ?) - Le prompt ne précise pas d'effet sur l'image en locked, juste "Image de la section en BO" */}
                <div
                    className="h-[120px] md:h-[180px] w-full self-stretch bg-cover bg-center bg-no-repeat relative"
                    style={{
                        backgroundImage: heroImageUrl ? `url(${heroImageUrl})` : undefined,
                        backgroundColor: 'lightgray'
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-[#18272E00] to-[#18272E]" />
                </div>

                <div className="flex flex-col items-start gap-2 p-6 w-full -mt-4 relative z-10">
                    {/* Titre (Locked Color) */}
                    <h4 className="text-[#B3ADA5] text-sm font-semibold font-league-spartan text-center w-full">
                        {typeInfo}
                    </h4>

                    {/* Légende (Locked) - User prompt said "Lla légende « Planète du Décan »" (?) assuming generic legend */}
                    <p className="text-[#969491] text-center text-xs font-league-spartan w-full">
                        {legend}
                    </p>

                    {/* Bloc Premium */}
                    <div className="flex items-center justify-center gap-2 w-full mt-4 p-4 bg-[#18272E]/50 rounded border border-[#939393]/20">
                        <span className="text-[#939393] text-base font-outfit">Option Premium</span>
                        <Icon icon="mingcute:lock-fill" className="text-[#B3ADA5]" width={20} />
                    </div>
                </div>
            </div>
        );
    }

    // --- MODE NORMAL ---
    return (
        <div className={`flex flex-col items-center bg-[#18272E] backdrop-blur-[2px] rounded-lg ${className}`}>
            <div
                className="h-[120px] md:h-[180px] w-full self-stretch rounded-t-lg bg-cover bg-center bg-no-repeat relative"
                style={{
                    backgroundImage: heroImageUrl ? `url(${heroImageUrl})` : undefined,
                    backgroundColor: 'lightgray'
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-[#18272E00] to-[#18272E]" />
            </div>

            <div className="flex flex-col items-center gap-6 p-6 w-full -mt-6 relative z-10">
                <div className="flex flex-col items-center gap-2 w-full">
                    {/* Nom Type Info */}
                    <h4 className="text-[#F1BA5B] text-sm font-semibold font-league-spartan text-center">
                        {typeInfo}
                    </h4>

                    {/* Nom Planète */}
                    <h2 className="text-[#F6AE31] text-center text-3xl font-bold font-league-spartan" style={TEXT_SHADOW_UICARD}>
                        {title}
                    </h2>
                </div>

                {/* Légende */}
                <p className="text-[#969491] text-center text-xs font-league-spartan">
                    {legend}
                </p>

                {/* Description */}
                <div className="text-[#F4EFEB] text-center text-base leading-relaxed font-outfit">
                    {description}
                </div>
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

    // Background Gradient constant
    const bgGradient = "bg-gradient-to-b from-[#18272E4D] via-[#18272E99] to-[#18272EE6]"; // 30% -> 60% -> 90% (converted to hex alpha approx)

    // --- MODE LOCKED ---
    if (isLocked) {
        return (
            <div className={`flex flex-col items-center justify-center gap-6 p-6 rounded-lg ${bgGradient} ${className}`}>
                {/* Nom Type Info (Locked Color) */}
                <h4 className="text-[#B3ADA5] text-center text-sm font-semibold font-league-spartan">
                    {typeInfo}
                </h4>

                {/* Pas d'icône, Pas de nom */}

                {/* Légende */}
                <p className="text-[#969491] text-center text-xs font-league-spartan">
                    {legend}
                </p>

                {/* Bloc Premium */}
                <div className="flex items-center justify-center gap-2 w-full mt-2">
                    <span className="text-[#939393] text-base font-outfit">Option Premium</span>
                    <Icon icon="mingcute:lock-fill" className="text-[#B3ADA5]" width={20} />
                </div>
            </div>
        )
    }

    // --- MODE NORMAL ---
    return (
        <div className={`flex flex-col items-center justify-center gap-6 p-6 rounded-lg ${bgGradient} ${className}`}>
            {/* Nom Type Info */}
            <h4 className="text-[#F5CE8A] text-center text-sm font-semibold font-league-spartan">
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
                            <Icon icon={iconUrl} className="w-full h-full text-[#F6AE31] opacity-80" />
                        )
                    ) : (
                        <div className="w-full h-full" />
                    )}
                </div>

                {/* Nom */}
                <h2 className="text-[#F1BA5B] text-center text-3xl font-bold font-league-spartan" style={TEXT_SHADOW_UICARD}>
                    {title}
                </h2>
            </div>

            {/* Légende */}
            <p className="text-[#969491] text-center text-xs font-league-spartan">
                {legend}
            </p>

            {/* Description */}
            <div className="text-[#F4EFEB] text-center text-base leading-relaxed font-outfit">
                {description}
            </div>
        </div>
    );
}
