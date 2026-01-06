export type AstralModuleId = 'zodiac' | 'chinese' | 'lunar' | 'numerology';

// ----------------------------------------------------------------------
// 1. DATA REQUIRED (USER INPUTS)
// ----------------------------------------------------------------------

export interface UserBirthData {
    date?: string; // YYYY-MM-DD
    time?: string; // HH:mm
    place?: {
        city: string;
        country: string;
        lat?: number;
        lng?: number;
        timezone?: string;
    }
}

export interface UserProfileData {
    firstName?: string;
    lastName?: string; // Optionnel
    birthData?: UserBirthData;
    // Potentiellement d'autres infos contextuelles
}

// ----------------------------------------------------------------------
// 2. CODE DEFINITION (LOGIC HARDCODED)
// ----------------------------------------------------------------------

export interface AstralModuleDefinition {
    id: AstralModuleId;
    requiredFields: Array<'birthDate' | 'birthTime' | 'birthPlace'>;
    // Logique de calcul simulée via une fonction qui prendrait le profil et retournerait l'ID du résultat (ex: 'aries')
    calculate?: (data: UserProfileData) => string | null;
}

// ----------------------------------------------------------------------
// 3. BO CONFIGURATION (EDITORIAL & VISUAL)
// ----------------------------------------------------------------------

export type ModuleState = 'draft' | 'active' | 'disabled';

export interface AstralModuleConfig {
    id: AstralModuleId;
    state: ModuleState;
    order: number;

    // Méta-données affichage liste
    title: string;
    subTitle?: string; // e.g. "2ème décan"
    shortDescription: string;
    icon?: string; // Iconify string
    heroImage?: string; // URL
    features: string[]; // List of features revealed (e.g. ["Signe du zodiaque", "Ascendant", "Elément majoritaire"])

    // Thème (Override optionnel)
    theme?: {
        accentColor: string;
        backgroundColor?: string;
        textColor?: string;
    };
}

// ----------------------------------------------------------------------
// 4. FRONTEND COMBINED MODEL
// ----------------------------------------------------------------------

export interface AstralModule extends AstralModuleConfig {
    definition: AstralModuleDefinition;
    isUnlocked: boolean; // Basé sur les données user présentes
    missingFields: Array<'birthDate' | 'birthTime' | 'birthPlace'>;
}
