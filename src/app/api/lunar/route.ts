import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import * as Astronomy from 'astronomy-engine';

// ============================================================================
// SECTION 1 : CONFIGURATION & UTILITAIRES
// ============================================================================

/**
 * Client Supabase configuré avec les credentials de service (admin).
 * Utilisé pour lire/écrire dans la table `dashboard_daily`.
 */
const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * Retourne la date du jour au fuseau horaire de Paris (YYYY-MM-DD).
 * Cela garantit que la "journée" est alignée avec l'utilisateur français.
 */
function getTodayDateParis(): string {
    const now = new Date()
    const parisDate = new Date(
        now.toLocaleString('en-US', { timeZone: 'Europe/Paris' })
    )
    return parisDate.toISOString().split('T')[0]
}

// ============================================================================
// SECTION 2 : RÉCUPÉRATION DES DONNÉES EXTERNES (API FARMSENSE)
// ============================================================================

/**
 * Récupère la phase lunaire actuelle et son taux d'illumination.
 * Source : API Farmsense (gratuite, publique).
 * Si l'API est indisponible, utilise un calcul algorithmique de secours.
 * 
 * @param date - Date pour laquelle récupérer les infos lunaires
 * @returns Objet { phase_name, illumination_pct }
 */
async function fetchMoonPhase(date: Date) {
    const timestamp = Math.floor(date.getTime() / 1000)

    try {
        const res = await fetch(
            `https://api.farmsense.net/v1/moonphases/?d=${timestamp}`,
            { signal: AbortSignal.timeout(5000) } // Timeout 5 secondes
        )

        if (!res.ok) throw new Error('API response not OK')

        const data = await res.json()
        const phaseEn = data[0]?.Phase
        const illumination = Math.round(Number(data[0]?.Illumination) || 0)

        // Traduction des phases lunaires en français
        const phaseMap: Record<string, string> = {
            'New Moon': 'Nouvelle Lune',
            'Waxing Crescent': 'Premier croissant',
            'First Quarter': 'Premier quartier',
            'Waxing Gibbous': 'Gibbeuse croissante',
            'Full Moon': 'Pleine Lune',
            'Waning Gibbous': 'Gibbeuse décroissante',
            'Last Quarter': 'Dernier quartier',
            'Waning Crescent': 'Dernier croissant'
        }

        let finalName = phaseMap[phaseEn] ?? phaseEn ?? 'Inconnue';

        return {
            phase_name: finalName,
            illumination_pct: illumination
        }
    } catch (error) {
        console.warn('Farmsense API unavailable, using algorithmic fallback', error)

        // Fallback : calcul algorithmique basé sur le cycle lunaire
        // Référence : Nouvelle Lune connue = 1er janvier 2000 à 18:14 UTC
        const knownNewMoon = new Date('2000-01-06T18:14:00Z').getTime()
        const lunarCycle = 29.53058867 * 24 * 60 * 60 * 1000 // ms

        const daysSinceNewMoon = ((date.getTime() - knownNewMoon) % lunarCycle) / (24 * 60 * 60 * 1000)
        const illumination = Math.round(50 * (1 - Math.cos(2 * Math.PI * daysSinceNewMoon / 29.53)))

        let phase_name = 'Nouvelle Lune'
        if (daysSinceNewMoon < 1) phase_name = 'Nouvelle Lune'
        else if (daysSinceNewMoon < 7.4) phase_name = 'Premier croissant'
        else if (daysSinceNewMoon < 7.4 + 1) phase_name = 'Premier quartier'
        else if (daysSinceNewMoon < 14.8) phase_name = 'Gibbeuse croissante'
        else if (daysSinceNewMoon < 14.8 + 1) phase_name = 'Pleine Lune'
        else if (daysSinceNewMoon < 22.1) phase_name = 'Gibbeuse décroissante'
        else if (daysSinceNewMoon < 22.1 + 1) phase_name = 'Dernier quartier'
        else phase_name = 'Dernier croissant'

        return { phase_name, illumination_pct: illumination }
    }
}

/**
 * Trouve la date de la dernière nouvelle lune avant (ou égale à) une date donnée.
 * Indispensable pour calculer le "jour du cycle lunaire".
 * Si l'API est indisponible, utilise un calcul basé sur le cycle moyen.
 * 
 * @param date - Date de référence
 * @returns Date de la dernière Nouvelle Lune
 */
async function fetchLastNewMoon(date: Date): Promise<Date> {
    const timestamp = Math.floor(date.getTime() / 1000)

    try {
        const res = await fetch(
            `https://api.farmsense.net/v1/moonphases/?d=${timestamp}`,
            { signal: AbortSignal.timeout(5000) }
        )

        if (!res.ok) throw new Error('API response not OK')

        const data = await res.json()
        const newMoon = data.find((p: any) => p.Phase === 'New Moon')

        if (!newMoon || !newMoon.Date) {
            throw new Error('No New Moon data found')
        }

        return new Date(newMoon.Date)
    } catch (error) {
        console.warn('Farmsense API unavailable for New Moon, using algorithmic fallback', error)

        // Fallback : calcul algorithmique
        const knownNewMoon = new Date('2000-01-06T18:14:00Z').getTime()
        const lunarCycle = 29.53058867 * 24 * 60 * 60 * 1000

        const cyclesSince = Math.floor((date.getTime() - knownNewMoon) / lunarCycle)
        const lastNewMoonTime = knownNewMoon + (cyclesSince * lunarCycle)

        return new Date(lastNewMoonTime)
    }
}


/**
 * Récupère le signe zodiacal de la Lune et son nœud via l'API NASA JPL Horizons.
 * - Signe Lunaire : calculé depuis le vecteur position écliptique.
 * - Nœud Lunaire : extrait des éléments orbitaux (OM = Ascending Node).
 */
async function fetchMoonAndNodeLongitude(date: Date = new Date()): Promise<{
    moonSign: string
    moonElement: string
    lunarNodeSign: string
}> {
    const formatDate = (d: Date) => d.toISOString().split('T')[0];
    const startTime = formatDate(date);
    const stopTime = formatDate(new Date(date.getTime() + 24 * 60 * 60 * 1000));

    // URLs de l'API Horizons
    const baseUrl = "https://ssd.jpl.nasa.gov/api/horizons.api";

    // 1. Position de la Lune (VECTORS) pour le Signe
    // COMMAND=301 (Lune), CENTER=@399 (Terre), REF_PLANE=ECLIPTIC
    const paramsVector = new URLSearchParams({
        format: "text",
        COMMAND: "301",
        OBJ_DATA: "NO",
        MAKE_EPHEM: "YES",
        EPHEM_TYPE: "VECTORS",
        CENTER: "@399",
        START_TIME: startTime,
        STOP_TIME: stopTime,
        STEP_SIZE: "1d",
        REF_PLANE: "ECLIPTIC",
        CSV_FORMAT: "YES"
    });

    // 2. Éléments Orbitaux (ELEMENTS) pour le Nœud (OM)
    const paramsElements = new URLSearchParams({
        format: "text",
        COMMAND: "301",
        OBJ_DATA: "NO",
        MAKE_EPHEM: "YES",
        EPHEM_TYPE: "ELEMENTS",
        CENTER: "@399",
        START_TIME: startTime,
        STOP_TIME: stopTime,
        STEP_SIZE: "1d",
        REF_PLANE: "ECLIPTIC",
        CSV_FORMAT: "YES"
    });

    try {
        // Exécution en parallèle avec timeout
        const fetchWithTimeout = (url: string) => fetch(url, { signal: AbortSignal.timeout(8000) });

        const [resVector, resElements] = await Promise.all([
            fetchWithTimeout(`${baseUrl}?${paramsVector.toString()}`),
            fetchWithTimeout(`${baseUrl}?${paramsElements.toString()}`)
        ]);

        if (!resVector.ok || !resElements.ok) throw new Error("JPL Horizons API Error");

        const txtVector = await resVector.text();
        const txtElements = await resElements.text();

        // --- Parsing Signe Lunaire ---
        // On cherche entre $$SOE et $$EOE
        const vecBlock = txtVector.split("$$SOE")[1]?.split("$$EOE")[0];
        let moonSign = "Bélier"; // Fallback

        if (vecBlock) {
            const line = vecBlock.trim().split('\n')[0];
            const parts = line.split(',');
            // Selon format Horizons CSV VECTORS : Date, X, Y, Z...
            // Indices tyipques : 0=JDTDB, 1=Date, 2=X, 3=Y (en UA)
            const X = parseFloat(parts[2]);
            const Y = parseFloat(parts[3]);

            if (!isNaN(X) && !isNaN(Y)) {
                // Calcul Longitude Ecliptique
                // atan2(y, x) retourne radians entre -PI et PI
                let lonRad = Math.atan2(Y, X);
                let lonDeg = lonRad * (180 / Math.PI);
                if (lonDeg < 0) lonDeg += 360;

                moonSign = zodiacFromLongitude(lonDeg);
            }
        }

        // --- Parsing Nœud Lunaire ---
        // Format CSV Elements : ... EC, QR, IN, OM, W, Tp ...
        // OM = Longitude of Ascending Node
        const elBlock = txtElements.split("$$SOE")[1]?.split("$$EOE")[0];
        let nodeSign = "Capricorne"; // Fallback

        if (elBlock) {
            const line = elBlock.trim().split('\n')[0];
            const parts = line.split(',');
            // Indices typiques ELEMENTS : 0=JDTDB, 1=Date, 2=EC, 3=QR, 4=IN, 5=OM
            const OM = parseFloat(parts[5]);

            if (!isNaN(OM)) {
                nodeSign = zodiacFromLongitude(OM);
            }
        }

        return {
            moonSign: moonSign,
            moonElement: zodiacElements[moonSign] || 'Feu',
            lunarNodeSign: nodeSign
        };

    } catch (error) {
        console.warn("Horizons API failure, using fallback defaults:", error);
        // Fallback safe (simulé)
        return {
            moonSign: 'Scorpion',
            moonElement: 'Eau',
            lunarNodeSign: 'Capricorne'
        };
    }
}

// ============================================================================
// SECTION 3 : CALCULS ASTROLOGIQUES
// ============================================================================

/**
 * Correspondance signe zodiacal → élément (Feu, Terre, Air, Eau).
 */
const zodiacElements: Record<string, string> = {
    Bélier: 'Feu',
    Taureau: 'Terre',
    Gémeaux: 'Air',
    Cancer: 'Eau',
    Lion: 'Feu',
    Vierge: 'Terre',
    Balance: 'Air',
    Scorpion: 'Eau',
    Sagittaire: 'Feu',
    Capricorne: 'Terre',
    Verseau: 'Air',
    Poissons: 'Eau'
}

/**
 * Convertit une longitude zodiacale (0-360°) en signe astrologique.
 * Chaque signe = 30° (Bélier = 0-30, Taureau = 30-60, etc.).
 * 
 * @param longitude - Longitude en degrés (0-360)
 * @returns Nom du signe zodiacal en français
 */
function zodiacFromLongitude(longitude: number): string {
    const signs = [
        'Bélier', 'Taureau', 'Gémeaux', 'Cancer',
        'Lion', 'Vierge', 'Balance', 'Scorpion',
        'Sagittaire', 'Capricorne', 'Verseau', 'Poissons'
    ]
    return signs[Math.floor(longitude / 30) % 12]
}

/**
 * Calcule le jour actuel du cycle lunaire (J1 à J29/30).
 * Base : nombre de jours écoulés depuis la dernière Nouvelle Lune + 1.
 * 
 * @param lastNewMoon - Date de la dernière Nouvelle Lune
 * @param today - Date du jour
 * @returns Numéro du jour (minimum 1)
 */
function calculateCycleDay(lastNewMoon: Date, today: Date): number {
    const diffMs = today.getTime() - lastNewMoon.getTime()
    return Math.max(1, Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1)
}

/**
 * Calcule les données de distance lunaire, périgée et apogée.
 * Utilise astronomy-engine pour la précision.
 */
function fetchMoonDistanceAndApsides(date: Date) {
    const vec = Astronomy.GeoVector(Astronomy.Body.Moon, date, true);
    // 1 UA = 149,597,870.7 km
    const distanceKm = Math.sqrt(vec.x * vec.x + vec.y * vec.y + vec.z * vec.z) * 149597870.7;

    // Scan des 40 derniers jours pour trouver le dernier perigee/apogee
    const startScan = new Date(date.getTime() - 40 * 24 * 3600 * 1000);

    let lastPerigeeDist = 362600;
    let lastApogeeDist = 405400;

    let iterDate = startScan;
    for (let i = 0; i < 15; i++) {
        const apsis = Astronomy.SearchLunarApsis(iterDate);
        if (!apsis) break;
        if (apsis.time.date > date) break;

        const v = Astronomy.GeoVector(Astronomy.Body.Moon, apsis.time, true);
        const dist = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z) * 149597870.7;

        if (apsis.kind === 0) lastPerigeeDist = dist;
        else lastApogeeDist = dist;

        iterDate = new Date(apsis.time.date.getTime() + 24 * 3600 * 1000);
    }

    const range = lastApogeeDist - lastPerigeeDist;
    let ratio = range !== 0 ? (distanceKm - lastPerigeeDist) / range : 0.5;
    ratio = Math.max(0, Math.min(1, ratio));

    return {
        distanceKm: Math.round(distanceKm),
        perigeeKm: Math.round(lastPerigeeDist),
        apogeeKm: Math.round(lastApogeeDist),
        ratio: Number(ratio.toFixed(4))
    };
}

// ============================================================================
// SECTION 4 : ROUTE API PRINCIPALE
// ============================================================================

/**
 * Route GET /api/lunar?date=YYYY-MM-DD
 * 
 * Retourne les données lunaires pour une date donnée (ou aujourd'hui si non spécifiée).
 * - Phase lunaire, illumination, jour du cycle
 * - Signe lunaire, élément, nœud lunaire
 * 
 * Logique :
 * 1. Récupère la date depuis query string ou utilise aujourd'hui (Paris)
 * 2. Vérifie si les données existent déjà en BDD pour cette date (cache)
 * 3. Sinon, récupère les infos via API externes, calcule les valeurs
 * 4. Insère en BDD et retourne le résultat
 */
export async function GET(request: Request) {
    // Récupérer le paramètre date de l'URL (?date=YYYY-MM-DD)
    const { searchParams } = new URL(request.url)
    const dateParam = searchParams.get('date')

    // Si date fournie, l'utiliser ; sinon, prendre aujourd'hui à Paris
    const targetDate = dateParam || getTodayDateParis()

    // Créer un objet Date pour les calculs (en UTC pour cohérence)
    const targetDateObj = new Date(targetDate + 'T12:00:00Z') // Midi UTC pour éviter les problèmes de timezone

    // Étape 1 : Vérifier si on a déjà les données de cette date en cache
    const { data: existing } = await supabase
        .from('dashboard_daily')
        .select('*')
        .eq('dashboard_date', targetDate)
        .single()

    if (existing) {
        return NextResponse.json(existing)
    }

    // Étape 2 : Récupérer les données depuis les APIs externes

    // Infos de phase lunaire (API Farmsense)
    const { phase_name, illumination_pct } = await fetchMoonPhase(targetDateObj)

    // Calcul du jour du cycle (nécessite la dernière Nouvelle Lune)
    const lastNewMoonDate = await fetchLastNewMoon(targetDateObj)
    const cycle_day = calculateCycleDay(lastNewMoonDate, targetDateObj)

    // Infos astrologiques (Lune en signe, élément, nœud lunaire)
    const {
        moonSign,
        moonElement,
        lunarNodeSign
    } = await fetchMoonAndNodeLongitude(targetDateObj)

    // Calculs Périgée / Apogée (Astronomy Engine)
    const moonDistData = fetchMoonDistanceAndApsides(targetDateObj)

    // Étape 3 : Construire le payload pour Supabase
    const payload = {
        dashboard_date: targetDate, // YYYY-MM-DD
        timezone: 'Europe/Paris',
        phase_name: phase_name || 'Inconnue', // Fallback string safe
        illumination_pct: illumination_pct ?? 0, // Fallback number safe
        cycle_day: cycle_day || 1, // Fallback number safe
        moon_zodiac_sign: moonSign || 'Bélier',
        moon_element: moonElement || 'Feu',

        // Données distance
        moon_distance_km: moonDistData.distanceKm,
        perigee_distance_km: moonDistData.perigeeKm,
        apogee_distance_km: moonDistData.apogeeKm,
        perigee_apogee_ratio: moonDistData.ratio,
        lunar_node_sign: lunarNodeSign || 'Capricorne'
    }

    // DEBUG: Voir ce qu'on envoie
    console.log('Inserting Lunar Payload:', JSON.stringify(payload, null, 2))

    // Étape 4 : Insérer en BDD
    const { data: inserted, error } = await supabase
        .from('dashboard_daily')
        .insert(payload)
        .select()
        .single()

    if (error) {
        console.error("Supabase Insert Error:", error)
        return NextResponse.json({ error: error.message, details: error }, { status: 500 })
    }

    return NextResponse.json(inserted)
}
