-- =====================================================
-- SEED ENRICHISSEMENT PROFIL ZODIACAL
-- Données factuelles: Planètes, Maîtres, Décans, Saisons
-- =====================================================

-- =====================================================
-- 1. PLANÈTES (10 planètes)
-- =====================================================
INSERT INTO zodiac_planets (slug, name_fr, symbol, description_short) VALUES
  ('sun', 'Soleil', '☉', 'Astre de vitalité et d''identité'),
  ('moon', 'Lune', '☽', 'Astre des émotions et de l''intuition'),
  ('mercury', 'Mercure', '☿', 'Planète de la communication et de l''intellect'),
  ('venus', 'Vénus', '♀', 'Planète de l''amour et de l''harmonie'),
  ('mars', 'Mars', '♂', 'Planète de l''action et du courage'),
  ('jupiter', 'Jupiter', '♃', 'Planète de l''expansion et de la sagesse'),
  ('saturn', 'Saturne', '♄', 'Planète de la structure et de la discipline'),
  ('uranus', 'Uranus', '♅', 'Planète de l''innovation et de la liberté'),
  ('neptune', 'Neptune', '♆', 'Planète des rêves et de la spiritualité'),
  ('pluto', 'Pluton', '♇', 'Planète de la transformation et du pouvoir')
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- 2. MAÎTRES DES SIGNES (Traditionnel + Moderne)
-- =====================================================
INSERT INTO zodiac_sign_planet_rulers (sign_slug, planet_slug, ruler_type, is_primary_display) VALUES
  -- Bélier (Mars = Mars)
  ('aries', 'mars', 'traditional', true),
  ('aries', 'mars', 'modern', false),
  
  -- Taureau (Vénus = Vénus)
  ('taurus', 'venus', 'traditional', true),
  ('taurus', 'venus', 'modern', false),
  
  -- Gémeaux (Mercure = Mercure)
  ('gemini', 'mercury', 'traditional', true),
  ('gemini', 'mercury', 'modern', false),
  
  -- Cancer (Lune = Lune)
  ('cancer', 'moon', 'traditional', true),
  ('cancer', 'moon', 'modern', false),
  
  -- Lion (Soleil = Soleil)
  ('leo', 'sun', 'traditional', true),
  ('leo', 'sun', 'modern', false),
  
  -- Vierge (Mercure = Mercure)
  ('virgo', 'mercury', 'traditional', true),
  ('virgo', 'mercury', 'modern', false),
  
  -- Balance (Vénus = Vénus)
  ('libra', 'venus', 'traditional', true),
  ('libra', 'venus', 'modern', false),
  
  -- Scorpion (Mars traditionnel, Pluton moderne - afficher Pluton par défaut)
  ('scorpio', 'mars', 'traditional', false),
  ('scorpio', 'pluto', 'modern', true),
  
  -- Sagittaire (Jupiter = Jupiter)
  ('sagittarius', 'jupiter', 'traditional', true),
  ('sagittarius', 'jupiter', 'modern', false),
  
  -- Capricorne (Saturne = Saturne)
  ('capricorn', 'saturn', 'traditional', true),
  ('capricorn', 'saturn', 'modern', false),
  
  -- Verseau (Saturne traditionnel, Uranus moderne - afficher Uranus par défaut)
  ('aquarius', 'saturn', 'traditional', false),
  ('aquarius', 'uranus', 'modern', true),
  
  -- Poissons (Jupiter traditionnel, Neptune moderne - afficher Neptune par défaut)
  ('pisces', 'jupiter', 'traditional', false),
  ('pisces', 'neptune', 'modern', true)
ON CONFLICT (sign_slug, planet_slug, ruler_type) DO NOTHING;

-- =====================================================
-- 3. DÉCANS (36 lignes: 12 signes × 3 décans)
-- Schéma chaldéen standard
-- =====================================================
INSERT INTO zodiac_sign_decans (sign_slug, decan, planet_slug, description_short) VALUES
  -- Bélier (Mars, Soleil, Vénus)
  ('aries', 1, 'mars', 'Énergie pure et initiative'),
  ('aries', 2, 'sun', 'Rayonnement et leadership'),
  ('aries', 3, 'venus', 'Charme et diplomatie'),
  
  -- Taureau (Mercure, Lune, Saturne)
  ('taurus', 1, 'mercury', 'Pragmatisme et communication'),
  ('taurus', 2, 'moon', 'Sensibilité et attachement'),
  ('taurus', 3, 'saturn', 'Persévérance et structure'),
  
  -- Gémeaux (Jupiter, Mars, Soleil)
  ('gemini', 1, 'jupiter', 'Curiosité et expansion'),
  ('gemini', 2, 'mars', 'Vivacité et débat'),
  ('gemini', 3, 'sun', 'Expression et créativité'),
  
  -- Cancer (Vénus, Mercure, Lune)
  ('cancer', 1, 'venus', 'Douceur et harmonie'),
  ('cancer', 2, 'mercury', 'Intuition et expression'),
  ('cancer', 3, 'moon', 'Émotions profondes'),
  
  -- Lion (Saturne, Jupiter, Mars)
  ('leo', 1, 'saturn', 'Autorité et discipline'),
  ('leo', 2, 'jupiter', 'Générosité et expansion'),
  ('leo', 3, 'mars', 'Courage et passion'),
  
  -- Vierge (Soleil, Vénus, Mercure)
  ('virgo', 1, 'sun', 'Clarté et discernement'),
  ('virgo', 2, 'venus', 'Raffinement et service'),
  ('virgo', 3, 'mercury', 'Analyse et précision'),
  
  -- Balance (Lune, Saturne, Jupiter)
  ('libra', 1, 'moon', 'Réceptivité et harmonie'),
  ('libra', 2, 'saturn', 'Justice et équilibre'),
  ('libra', 3, 'jupiter', 'Expansion sociale'),
  
  -- Scorpion (Mars, Soleil, Vénus)
  ('scorpio', 1, 'mars', 'Intensité et transformation'),
  ('scorpio', 2, 'sun', 'Pouvoir et magnétisme'),
  ('scorpio', 3, 'venus', 'Profondeur émotionnelle'),
  
  -- Sagittaire (Mercure, Lune, Saturne)
  ('sagittarius', 1, 'mercury', 'Philosophie et enseignement'),
  ('sagittarius', 2, 'moon', 'Idéalisme et quête'),
  ('sagittarius', 3, 'saturn', 'Sagesse et responsabilité'),
  
  -- Capricorne (Jupiter, Mars, Soleil)
  ('capricorn', 1, 'jupiter', 'Ambition structurée'),
  ('capricorn', 2, 'mars', 'Détermination et réalisation'),
  ('capricorn', 3, 'sun', 'Accomplissement et autorité'),
  
  -- Verseau (Vénus, Mercure, Lune)
  ('aquarius', 1, 'venus', 'Humanisme et fraternité'),
  ('aquarius', 2, 'mercury', 'Innovation et intellect'),
  ('aquarius', 3, 'moon', 'Intuition collective'),
  
  -- Poissons (Saturne, Jupiter, Mars)
  ('pisces', 1, 'saturn', 'Spiritualité et sacrifice'),
  ('pisces', 2, 'jupiter', 'Compassion et expansion'),
  ('pisces', 3, 'mars', 'Guérison et transcendance')
ON CONFLICT (sign_slug, decan) DO NOTHING;

-- =====================================================
-- 4. SAISONS ASTROLOGIQUES (12 signes)
-- =====================================================
INSERT INTO zodiac_sign_seasons (sign_slug, season, season_position, title_fr, description_short) VALUES
  ('aries', 'spring', 'beginning', 'Début du printemps', 'Renaissance et nouveaux départs'),
  ('taurus', 'spring', 'middle', 'Milieu du printemps', 'Croissance et enracinement'),
  ('gemini', 'spring', 'end', 'Fin du printemps', 'Floraison et diversité'),
  
  ('cancer', 'summer', 'beginning', 'Début de l''été', 'Ouverture et protection'),
  ('leo', 'summer', 'middle', 'Milieu de l''été', 'Rayonnement et plénitude'),
  ('virgo', 'summer', 'end', 'Fin de l''été', 'Maturation et récolte'),
  
  ('libra', 'autumn', 'beginning', 'Début de l''automne', 'Équilibre et transition'),
  ('scorpio', 'autumn', 'middle', 'Milieu de l''automne', 'Transformation profonde'),
  ('sagittarius', 'autumn', 'end', 'Fin de l''automne', 'Quête et expansion'),
  
  ('capricorn', 'winter', 'beginning', 'Début de l''hiver', 'Cristallisation et structure'),
  ('aquarius', 'winter', 'middle', 'Milieu de l''hiver', 'Détachement et innovation'),
  ('pisces', 'winter', 'end', 'Fin de l''hiver', 'Dissolution et renouveau')
ON CONFLICT (sign_slug) DO NOTHING;
