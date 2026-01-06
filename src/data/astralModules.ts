import { AstralModuleConfig, AstralModuleDefinition } from "@/types/astral";

// ----------------------------------------------------------------------
// 1. DÉFINITIONS CODE (Hardcoded logic requirements)
// ----------------------------------------------------------------------

export const MODULE_DEFINITIONS: Record<string, AstralModuleDefinition> = {
    zodiac: {
        id: 'zodiac',
        requiredFields: ['birthDate'], // Le signe solaire ne nécessite que la date généralement (sauf cas limites)
    },
    lunar: {
        id: 'lunar',
        requiredFields: ['birthDate', 'birthTime', 'birthPlace'], // La lune bouge vite, besoin de précision
    },
    chinese: {
        id: 'chinese',
        requiredFields: ['birthDate'],
    },
    numerology: {
        id: 'numerology',
        requiredFields: ['birthDate'], // Chemin de vie basé sur la date
    }
};

// ----------------------------------------------------------------------
// 2. CONFIGURATIONS BO (Editorial & Visuals)
// ----------------------------------------------------------------------

export const MODULE_CONFIGS: AstralModuleConfig[] = [
    {
        id: 'zodiac',
        state: 'active',
        order: 1,
        title: "Profil Zodiac",
        shortDescription: "Découvre ton signe solaire, la base de ta personnalité et de ton rayonnement.",
        icon: "mdi:zodiac-leo",
        heroImage: "/backgrounds/tirages.png", // Placeholder using existing asset
        features: ["Signe du zodiaque", "Ascendant", "Élément majoritaire"],
        theme: {
            accentColor: "#FFD700", // Gold
            textColor: "#FFD700"
        }
    },
    {
        id: 'lunar',
        state: 'active',
        order: 2,
        title: "Profil Lunaire",
        shortDescription: "Explore ton monde émotionnel et ton subconscient à travers ton signe lunaire.",
        icon: "mdi:moon-waning-crescent",
        heroImage: "/backgrounds/astres.png", // Placeholder using existing asset
        features: ["Signe Lunaire", "Phase lunaire de naissance", "Nœud lunaire", "Maison astrologique", "Lune noire de Lilith", "Étoiles fixes en conjonction"],
        theme: {
            accentColor: "#A0C4FF", // Light Blue / Silver
            textColor: "#A0C4FF"
        }
    },
    {
        id: 'chinese',
        state: 'active',
        order: 4,
        title: "Profil Chinois",
        shortDescription: "Ton animal totem selon le calendrier lunaire chinois.",
        icon: "mdi:snake",
        heroImage: "/backgrounds/quiz.png", // Placeholder using existing asset
        features: ["Signe Chinois", "Élément", "Compagnons de route"],
        theme: {
            accentColor: "#E63946", // Red
            textColor: "#FF99AC"
        }
    },
    {
        id: 'numerology',
        state: 'draft',
        order: 3,
        title: "Profil Aztèque",
        shortDescription: "La numérologie révèle ta mission de vie et les défis que tu es venu relever.",
        icon: "mdi:numeric-7-box-multiple-outline",
        heroImage: "/backgrounds/journal.png", // Placeholder using existing asset
        features: ["Maison astrologique", "Lune noire de Lilith", "Étoiles fixes en conjonction"],
        theme: {
            accentColor: "#9D4EDD", // Purple
            textColor: "#E0AAFF"
        }
    }
];

// Helper pour merger les deux
export function getAstralModules() {
    return MODULE_CONFIGS.map(config => ({
        ...config,
        definition: MODULE_DEFINITIONS[config.id]
    })).sort((a, b) => a.order - b.order);
}
