-- =====================================================
-- ENRICHISSEMENT PROFIL ZODIACAL
-- Planètes, Maîtres, Décans, Saisons
-- =====================================================

-- Table A: Référentiel des planètes
CREATE TABLE IF NOT EXISTS zodiac_planets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name_fr TEXT NOT NULL,
  symbol TEXT,
  description_short TEXT,
  description_long TEXT,
  icon_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table B: Maîtres des signes (traditionnel + moderne)
CREATE TABLE IF NOT EXISTS zodiac_sign_planet_rulers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sign_slug TEXT NOT NULL REFERENCES zodiac_signs(slug) ON DELETE CASCADE,
  planet_slug TEXT NOT NULL REFERENCES zodiac_planets(slug) ON DELETE CASCADE,
  ruler_type TEXT NOT NULL CHECK (ruler_type IN ('traditional', 'modern')),
  is_primary_display BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(sign_slug, planet_slug, ruler_type)
);

-- Table C: Planètes de décans (36 lignes: 12 signes × 3 décans)
CREATE TABLE IF NOT EXISTS zodiac_sign_decans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sign_slug TEXT NOT NULL REFERENCES zodiac_signs(slug) ON DELETE CASCADE,
  decan INTEGER NOT NULL CHECK (decan >= 1 AND decan <= 3),
  planet_slug TEXT NOT NULL REFERENCES zodiac_planets(slug) ON DELETE CASCADE,
  description_short TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(sign_slug, decan)
);

-- Table D: Saisons astrologiques
CREATE TABLE IF NOT EXISTS zodiac_sign_seasons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sign_slug TEXT NOT NULL REFERENCES zodiac_signs(slug) ON DELETE CASCADE UNIQUE,
  season TEXT NOT NULL CHECK (season IN ('spring', 'summer', 'autumn', 'winter')),
  season_position TEXT NOT NULL CHECK (season_position IN ('beginning', 'middle', 'end')),
  title_fr TEXT NOT NULL,
  description_short TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_planet_rulers_sign ON zodiac_sign_planet_rulers(sign_slug);
CREATE INDEX IF NOT EXISTS idx_planet_rulers_primary ON zodiac_sign_planet_rulers(sign_slug, is_primary_display);
CREATE INDEX IF NOT EXISTS idx_decans_sign ON zodiac_sign_decans(sign_slug);
CREATE INDEX IF NOT EXISTS idx_seasons_sign ON zodiac_sign_seasons(sign_slug);

-- Trigger pour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_zodiac_planets_updated_at BEFORE UPDATE ON zodiac_planets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_zodiac_sign_planet_rulers_updated_at BEFORE UPDATE ON zodiac_sign_planet_rulers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_zodiac_sign_decans_updated_at BEFORE UPDATE ON zodiac_sign_decans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_zodiac_sign_seasons_updated_at BEFORE UPDATE ON zodiac_sign_seasons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies (lecture publique, modification admin)
ALTER TABLE zodiac_planets ENABLE ROW LEVEL SECURITY;
ALTER TABLE zodiac_sign_planet_rulers ENABLE ROW LEVEL SECURITY;
ALTER TABLE zodiac_sign_decans ENABLE ROW LEVEL SECURITY;
ALTER TABLE zodiac_sign_seasons ENABLE ROW LEVEL SECURITY;

-- Lecture publique
CREATE POLICY "Public read access on zodiac_planets" ON zodiac_planets FOR SELECT USING (true);
CREATE POLICY "Public read access on zodiac_sign_planet_rulers" ON zodiac_sign_planet_rulers FOR SELECT USING (true);
CREATE POLICY "Public read access on zodiac_sign_decans" ON zodiac_sign_decans FOR SELECT USING (true);
CREATE POLICY "Public read access on zodiac_sign_seasons" ON zodiac_sign_seasons FOR SELECT USING (true);

-- Admin modification (à ajuster selon votre logique d'admin)
CREATE POLICY "Admin full access on zodiac_planets" ON zodiac_planets FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access on zodiac_sign_planet_rulers" ON zodiac_sign_planet_rulers FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access on zodiac_sign_decans" ON zodiac_sign_decans FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access on zodiac_sign_seasons" ON zodiac_sign_seasons FOR ALL USING (auth.role() = 'authenticated');
