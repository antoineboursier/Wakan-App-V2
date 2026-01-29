-- Migration: Refactor Zodiac Enrichment Tables
-- Date: 2026-01-28
-- Description: Simplification et ajout d'icônes pour les modules zodiacaux

-- 1. PLANÈTES (zodiac_planets)
-- Ajouter icône image
ALTER TABLE zodiac_planets
    ADD COLUMN IF NOT EXISTS icon_image_url TEXT;

-- Supprimer colonnes inutiles (on garde slug pour les foreign keys)
ALTER TABLE zodiac_planets
    DROP COLUMN IF EXISTS symbol,
    DROP COLUMN IF EXISTS icon_url,
    DROP COLUMN IF EXISTS description_long;

-- Renommer description_short en description
ALTER TABLE zodiac_planets
    RENAME COLUMN description_short TO description;

-- 2. PLANÈTE MAÎTRESSE PAR SIGNE (zodiac_sign_planet_rulers)
-- Garder seulement le maître traditionnel, supprimer les autres champs
-- D'abord, supprimer toutes les entrées "modern"
DELETE FROM zodiac_sign_planet_rulers WHERE ruler_type = 'modern';

-- Supprimer colonnes inutiles
ALTER TABLE zodiac_sign_planet_rulers
    DROP COLUMN IF EXISTS ruler_type,
    DROP COLUMN IF EXISTS is_primary_display;

-- Ajouter description et icône
ALTER TABLE zodiac_sign_planet_rulers
    ADD COLUMN IF NOT EXISTS description TEXT,
    ADD COLUMN IF NOT EXISTS icon_image_url TEXT;

-- 3. DÉCANS (zodiac_sign_decans)
-- Ajouter icône
ALTER TABLE zodiac_sign_decans
    ADD COLUMN IF NOT EXISTS icon_image_url TEXT;

-- Renommer description_short -> description
ALTER TABLE zodiac_sign_decans
    RENAME COLUMN description_short TO description;

-- 4. SAISONS ASTROLOGIQUES (zodiac_sign_seasons)
-- Ajouter icône
ALTER TABLE zodiac_sign_seasons
    ADD COLUMN IF NOT EXISTS icon_image_url TEXT;

-- Supprimer colonnes inutiles (season, season_position)
ALTER TABLE zodiac_sign_seasons
    DROP COLUMN IF EXISTS season,
    DROP COLUMN IF EXISTS season_position;

-- Renommer description_short en content
ALTER TABLE zodiac_sign_seasons
    RENAME COLUMN description_short TO content;

