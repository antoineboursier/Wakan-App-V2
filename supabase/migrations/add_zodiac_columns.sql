-- Migration: Ajout des colonnes zodiacales fiabilisées
-- Date: 2024-12-16
-- Description: Ajoute les colonnes pour stocker les données brutes NASA JPL Horizons

-- Ajouter les colonnes de longitude brute
ALTER TABLE dashboard_daily
ADD COLUMN IF NOT EXISTS moon_lon_deg double precision,
ADD COLUMN IF NOT EXISTS node_lon_deg double precision;

-- Ajouter les métadonnées de calcul
ALTER TABLE dashboard_daily
ADD COLUMN IF NOT EXISTS zodiac_ref_time timestamptz,
ADD COLUMN IF NOT EXISTS zodiac_source text;

-- Commentaires pour documentation
COMMENT ON COLUMN dashboard_daily.moon_lon_deg IS 'Longitude écliptique de la Lune en degrés (0-360), source NASA JPL Horizons';
COMMENT ON COLUMN dashboard_daily.node_lon_deg IS 'Longitude du nœud lunaire ascendant en degrés (0-360), source NASA JPL Horizons';
COMMENT ON COLUMN dashboard_daily.zodiac_ref_time IS 'Heure de référence UTC utilisée pour le calcul des positions zodiacales (12:00 Europe/Paris)';
COMMENT ON COLUMN dashboard_daily.zodiac_source IS 'Source des données zodiacales (ex: "NASA JPL Horizons")';
