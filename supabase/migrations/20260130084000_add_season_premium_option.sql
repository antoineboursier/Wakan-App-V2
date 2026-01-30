-- Add season_is_premium column to zodiac_signs table
ALTER TABLE zodiac_signs
ADD COLUMN IF NOT EXISTS season_is_premium BOOLEAN DEFAULT false;

COMMENT ON COLUMN zodiac_signs.season_is_premium IS 'If true, the season section requires a premium account to view';
