// =====================================================
// TYPES ENRICHISSEMENT PROFIL ZODIACAL
// =====================================================

// Planète (Maîtresse)
export interface ZodiacPlanet {
    id: string;
    slug: string; // Conservé pour les foreign keys
    name_fr: string;
    description?: string; // Anciennement description_short
    icon_image_url?: string; // Nouvelle icône image
    created_at?: string;
    updated_at?: string;
}

// Maître d'un signe (Planète Maîtresse)
export interface ZodiacSignPlanetRuler {
    id: string;
    sign_slug: string;
    master_planet_id: string; // Renommé de planet_slug
    description?: string; // Nouveau champ
    icon_image_url?: string; // Nouvelle icône
    created_at?: string;
    updated_at?: string;
    // Relations
    planet?: ZodiacPlanet;
}

// Décan
export interface ZodiacSignDecan {
    id: string;
    sign_slug: string;
    decan: number; // 1, 2, or 3
    planet_slug: string;
    description?: string; // Anciennement description_short
    icon_image_url?: string; // Nouvelle icône
    planet_description?: string; // Description de la planète pour ce décan
    planet_icon_url?: string; // Icône de la planète pour ce décan
    created_at?: string;
    updated_at?: string;
    // Relations
    planet?: ZodiacPlanet;
}

// Saison
export interface ZodiacSignSeason {
    id: string;
    sign_slug: string;
    title_fr: string;
    content?: string; // Anciennement description_short
    icon_image_url?: string; // Nouvelle icône
    created_at?: string;
    updated_at?: string;
}

// =====================================================
// TYPES ENRICHIS POUR L'AFFICHAGE
// =====================================================

// Profil zodiacal enrichi (pour affichage front)
export interface EnrichedZodiacProfile {
    // Données de base (existant)
    sign_slug: string;
    sign_name: string;
    decan: number;
    element?: string;
    modality?: string;

    // Nouvelles données visuelles et Premium
    sign_icon_glow?: string;
    sign_hero_image?: string;
    is_master_planet_premium?: boolean;
    is_decans_premium?: boolean;
    is_season_premium?: boolean;

    // Enrichissements
    ruling_planet?: ZodiacPlanet;
    // Infos du décan lui-même (description, etc.)
    decan_data?: {
        description?: string;
        icon_image_url?: string;
    };
    // Infos de la planète du décan
    decan_planet?: ZodiacPlanet;
    season?: ZodiacSignSeason;

    // Optionnel
    archetype?: string;
    keywords?: string[];
}
