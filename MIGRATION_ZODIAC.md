# Migration Données Zodiacales - NASA JPL Horizons

## ✅ Ce qui a été fait

### 1. Nouvelle route API `/api/dashboard`
**Fichier**: `src/app/api/dashboard/route.ts`

**Fonctionnalités implémentées**:
- ✅ Calcul des positions à **12:00 Europe/Paris** (converti en UTC)
- ✅ Appels à **NASA JPL Horizons API** pour:
  - Longitude écliptique de la Lune (VECTORS)
  - Longitude du nœud lunaire (ELEMENTS)
- ✅ Stockage des **longitudes brutes** (`moon_lon_deg`, `node_lon_deg`)
- ✅ Stockage des **métadonnées** (`zodiac_ref_time`, `zodiac_source`)
- ✅ Logique de **cache intelligent**:
  - Si la ligne existe ET les champs zodiacaux sont remplis → retour direct
  - Si la ligne existe MAIS `moon_lon_deg` ou `node_lon_deg` est NULL → **UPDATE**
  - Si la ligne n'existe pas → **INSERT**
- ✅ Gestion d'erreurs robuste (timeouts, parsing, fallbacks)
- ✅ Conversion longitude → signe zodiacal (Bélier, Taureau, etc.)
- ✅ Mapping signe → élément (Feu, Terre, Air, Eau)

### 2. Migration SQL
**Fichier**: `supabase/migrations/add_zodiac_columns.sql`

**Colonnes ajoutées**:
```sql
moon_lon_deg        double precision  -- Longitude Lune (0-360°)
node_lon_deg        double precision  -- Longitude Nœud (0-360°)
zodiac_ref_time     timestamptz       -- Heure de référence UTC
zodiac_source       text              -- "NASA JPL Horizons"
```

## 🔧 Actions requises

### 1. Appliquer la migration Supabase
**Dossier**: `/Users/ab4a2ccl/Desktop/Wakan V2`

Vous devez exécuter la migration SQL dans Supabase. Deux options:

#### Option A: Via l'interface web Supabase
1. Aller sur https://supabase.com/dashboard
2. Sélectionner votre projet
3. Aller dans **SQL Editor**
4. Copier-coller le contenu de `supabase/migrations/add_zodiac_columns.sql`
5. Cliquer sur **Run**

#### Option B: Via CLI Supabase (si configuré)
```bash
cd "/Users/ab4a2ccl/Desktop/Wakan V2"
supabase db push
```

### 2. Tester la route
Une fois la migration appliquée, tester:

```bash
# Test pour aujourd'hui
curl "http://localhost:3000/api/dashboard" | jq '.'

# Test pour une date spécifique
curl "http://localhost:3000/api/dashboard?date=2024-12-19" | jq '.'
```

**Résultat attendu**:
```json
{
  "dashboard_date": "2024-12-19",
  "timezone": "Europe/Paris",
  "moon_lon_deg": 285.42,
  "node_lon_deg": 12.78,
  "moon_zodiac_sign": "Capricorne",
  "moon_element": "Terre",
  "lunar_node_sign": "Bélier",
  "zodiac_ref_time": "2024-12-19T11:00:00.000Z",
  "zodiac_source": "NASA JPL Horizons"
}
```

### 3. Mettre à jour le frontend
**Fichier à modifier**: `src/app/page.tsx`

Remplacer l'appel à `/api/lunar` par `/api/dashboard`:

```typescript
// AVANT
const res = await fetch(`/api/lunar?date=${dateStr}`);

// APRÈS
const res = await fetch(`/api/dashboard?date=${dateStr}`);
```

### 4. (Optionnel) Fusionner les routes
Si vous voulez que `/api/dashboard` retourne TOUTES les données (phase, distance, etc.):

1. Copier la logique de `/api/lunar/route.ts` (phase lunaire, distance, etc.)
2. L'intégrer dans `/api/dashboard/route.ts`
3. Supprimer `/api/lunar/route.ts`

Ou garder les deux routes séparées pour le moment.

## 📊 Exemple de données complètes

Pour le **19 décembre 2024** (exemple de votre cahier des charges):

```json
{
  "dashboard_date": "2024-12-19",
  "timezone": "Europe/Paris",
  
  // Données zodiacales (NASA JPL Horizons)
  "moon_lon_deg": 285.42,
  "node_lon_deg": 12.78,
  "moon_zodiac_sign": "Capricorne",
  "moon_element": "Terre",
  "lunar_node_sign": "Bélier",
  "zodiac_ref_time": "2024-12-19T11:00:00.000Z",
  "zodiac_source": "NASA JPL Horizons",
  
  // Données phase lunaire (à ajouter depuis /api/lunar)
  "phase_name": "Gibbeuse décroissante",
  "illumination_pct": 87,
  "cycle_day": 18,
  
  // Données distance (à ajouter depuis /api/lunar)
  "moon_distance_km": 384400,
  "perigee_distance_km": 363300,
  "apogee_distance_km": 405500,
  "perigee_apogee_ratio": 0.52
}
```

## 🔍 Vérification de cohérence

Pour vérifier que les données sont correctes, vous pouvez comparer avec:
- https://ssd.jpl.nasa.gov/horizons/app.html (interface web NASA)
- https://www.astro.com/swisseph/swepha_e.htm (Swiss Ephemeris)

**Paramètres de comparaison**:
- Date: 19 décembre 2024
- Heure: 12:00 Europe/Paris (11:00 UTC en hiver)
- Corps: Lune (301)
- Centre: Terre (399)
- Plan de référence: Écliptique

## 📝 Notes techniques

### Gestion du fuseau horaire
La fonction `getReferenceTimeUTC()` crée une date à 12:00 heure de Paris et la convertit en UTC. Cela garantit que:
- En hiver (UTC+1): 12:00 Paris = 11:00 UTC
- En été (UTC+2): 12:00 Paris = 10:00 UTC

### Robustesse
- Timeouts de 10 secondes sur les appels API
- Parsing défensif (vérification des marqueurs $$SOE/$$EOE)
- Validation des valeurs numériques (isNaN)
- Normalisation des longitudes (0-360°)
- Retour de `null` en cas d'échec (jamais de crash)

### Performance
- Appels parallèles (Promise.all) pour Lune + Nœud
- Cache Supabase (pas de recalcul si données déjà présentes)
- UPDATE sélectif (seulement si champs NULL)

## 🚀 Prochaines étapes suggérées

1. ✅ Appliquer la migration SQL
2. ✅ Tester la route `/api/dashboard`
3. ⏳ Intégrer les données de phase/distance depuis `/api/lunar`
4. ⏳ Mettre à jour le frontend pour utiliser `/api/dashboard`
5. ⏳ Ajouter des tests unitaires pour le parsing NASA
6. ⏳ Documenter l'API (Swagger/OpenAPI)
