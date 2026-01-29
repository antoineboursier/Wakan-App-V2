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
    planet_slug: string;
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

    // Enrichissements
    ruling_planet?: ZodiacPlanet;
    decan_planet?: ZodiacPlanet;
    season?: ZodiacSignSeason;

    // Optionnel
    archetype?: string;
    keywords?: string[];
}

