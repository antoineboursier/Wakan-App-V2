-- Migration pour ajouter les options premium/freemium au module Zodiac
-- Date : 2026-01-29

-- 1. Ajouter l'option premium globale au module zodiac
ALTER TABLE astral_modules
    ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT false;

-- 2. Ajouter les options premium individuelles pour chaque signe
ALTER TABLE zodiac_signs
    ADD COLUMN IF NOT EXISTS master_planet_is_premium BOOLEAN DEFAULT false,
    ADD COLUMN IF NOT EXISTS decans_is_premium BOOLEAN DEFAULT false;

-- 3. Par défaut, tout est gratuit (already set by default above)
UPDATE astral_modules SET is_premium = false WHERE id = 'zodiac';
UPDATE zodiac_signs SET master_planet_is_premium = false, decans_is_premium = false;

COMMENT ON COLUMN astral_modules.is_premium IS 'Si true, le module entier nécessite un compte premium';
COMMENT ON COLUMN zodiac_signs.master_planet_is_premium IS 'Si true, la section "Planète Maîtresse" nécessite un compte premium';
COMMENT ON COLUMN zodiac_signs.decans_is_premium IS 'Si true, la section "Décans" nécessite un compte premium';
