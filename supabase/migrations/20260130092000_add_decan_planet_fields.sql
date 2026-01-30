-- Add planet description and planet icon fields to zodiac_sign_decans table
ALTER TABLE zodiac_sign_decans
ADD COLUMN IF NOT EXISTS planet_description TEXT,
ADD COLUMN IF NOT EXISTS planet_icon_url TEXT;

COMMENT ON COLUMN zodiac_sign_decans.planet_description IS 'Description of the ruling planet for this decan';
COMMENT ON COLUMN zodiac_sign_decans.planet_icon_url IS 'Icon/image URL for the ruling planet of this decan';
