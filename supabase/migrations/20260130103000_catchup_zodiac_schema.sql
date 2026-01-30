-- Migration de rattrapage pour aligner la DB avec le code TypeScript
-- Ajout des colonnes manquantes (description, icon_image_url, etc.) et renommages

-- 1. ZODIAC SIGN PLANET RULERS
DO $$
BEGIN
  -- Si 'description_short' existe, on le renomme en 'description'
  IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'zodiac_sign_planet_rulers' AND column_name = 'description_short') THEN
    ALTER TABLE zodiac_sign_planet_rulers RENAME COLUMN description_short TO description;
  ELSE
    -- Sinon on ajoute 'description' s'il n'existe pas
    ALTER TABLE zodiac_sign_planet_rulers ADD COLUMN IF NOT EXISTS description TEXT;
  END IF;
END $$;

ALTER TABLE zodiac_sign_planet_rulers ADD COLUMN IF NOT EXISTS icon_image_url TEXT;


-- 2. ZODIAC SIGN DECANS
DO $$
BEGIN
  IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'zodiac_sign_decans' AND column_name = 'description_short') THEN
    ALTER TABLE zodiac_sign_decans RENAME COLUMN description_short TO description;
  ELSE
    ALTER TABLE zodiac_sign_decans ADD COLUMN IF NOT EXISTS description TEXT;
  END IF;
END $$;

ALTER TABLE zodiac_sign_decans ADD COLUMN IF NOT EXISTS icon_image_url TEXT;
ALTER TABLE zodiac_sign_decans ADD COLUMN IF NOT EXISTS planet_description TEXT;
ALTER TABLE zodiac_sign_decans ADD COLUMN IF NOT EXISTS planet_icon_url TEXT;


-- 3. ZODIAC SIGN SEASONS
-- Le code frontend utilise 'content' pour la description de la saison
DO $$
BEGIN
  IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'zodiac_sign_seasons' AND column_name = 'description_short') THEN
    ALTER TABLE zodiac_sign_seasons RENAME COLUMN description_short TO content;
  ELSE
    ALTER TABLE zodiac_sign_seasons ADD COLUMN IF NOT EXISTS content TEXT;
  END IF;
END $$;

ALTER TABLE zodiac_sign_seasons ADD COLUMN IF NOT EXISTS icon_image_url TEXT;
