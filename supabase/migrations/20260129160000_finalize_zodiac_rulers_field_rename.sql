-- Migration finale : Renommer planet_slug en master_planet_id pour plus de clarté
-- Date : 2026-01-29

-- 1. Renommer la colonne planet_slug en master_planet_id dans zodiac_sign_planet_rulers
ALTER TABLE zodiac_sign_planet_rulers
    RENAME COLUMN planet_slug TO master_planet_id;

-- Note : Les foreign keys sont automatiquement mises à jour lors du renommage
