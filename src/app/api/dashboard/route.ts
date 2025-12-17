import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import * as Astronomy from 'astronomy-engine'

// ============================================================================
// CONFIGURATION
// ============================================================================

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// ============================================================================
// UTILITAIRES TIMEZONE
// ============================================================================

/**
 * Retourne la date du jour au fuseau horaire de Paris (YYYY-MM-DD).
 */
function getTodayDateParis(): string {
    const now = new Date()
    const parisDate = new Date(
        now.toLocaleString('en-US', { timeZone: 'Europe/Paris' })
    )
    return parisDate.toISOString().split('T')[0]
}

/**
 * Crée un objet Date pour 12:00 Europe/Paris à la date donnée.
 * Retourne l'heure UTC correspondante.
 */
function getReferenceTimeUTC(dateStr: string): Date {
    // Créer une date à 12:00 heure locale Paris
    // Format: YYYY-MM-DDTHH:MM:SS
    const parisTimeStr = `${dateStr}T12:00:00`

    // Convertir en UTC (Paris est UTC+1 ou UTC+2 selon DST)
    // On utilise Intl.DateTimeFormat pour gérer le DST automatiquement
    const parisDate = new Date(parisTimeStr)
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Europe/Paris',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    })

    // Créer la date en assumant qu'elle est en heure de Paris
    const parts = formatter.formatToParts(new Date(`${dateStr}T12:00:00`))
    const dateMap: Record<string, string> = {}
    parts.forEach(part => {
        if (part.type !== 'literal') {
            dateMap[part.type] = part.value
        }
    })

    // Construire la date UTC en tenant compte du décalage
    // Simple: on parse directement avec le timezone
    const utcDate = new Date(`${dateStr}T12:00:00+01:00`) // Paris standard (ajuster si DST)

    return utcDate
}

// ============================================================================
// MAPPING ZODIACAL
// ============================================================================

const zodiacSigns = [
    'Bélier', 'Taureau', 'Gémeaux', 'Cancer',
    'Lion', 'Vierge', 'Balance', 'Scorpion',
    'Sagittaire', 'Capricorne', 'Verseau', 'Poissons'
]

const zodiacElements: Record<string, string> = {
    'Bélier': 'Feu',
    'Taureau': 'Terre',
    'Gémeaux': 'Air',
    'Cancer': 'Eau',
    'Lion': 'Feu',
    'Vierge': 'Terre',
    'Balance': 'Air',
    'Scorpion': 'Eau',
    'Sagittaire': 'Feu',
    'Capricorne': 'Terre',
    'Verseau': 'Air',
    'Poissons': 'Eau'
}

/**
 * Convertit une longitude écliptique (0-360°) en signe zodiacal.
 */
function zodiacFromLongitude(longitude: number): string {
    // Normaliser entre 0 et 360
    let lon = longitude % 360
    if (lon < 0) lon += 360

    const index = Math.floor(lon / 30) % 12
    return zodiacSigns[index]
}

/**
 * Calcule le signe opposé pour le Nœud Sud.
 * south = signs[(index + 6) % 12]
 */
function oppositeSign(sign: string): string {
    const index = zodiacSigns.indexOf(sign)
    if (index === -1) return 'Inconnu'

    // Décalage de 6 signes (180°)
    const oppositeIndex = (index + 6) % 12
    return zodiacSigns[oppositeIndex]
}

// ============================================================================
// NASA JPL HORIZONS API
// ============================================================================

/**
 * Récupère la longitude écliptique de la Lune via NASA JPL Horizons (VECTORS).
 * Retourne la longitude en degrés (0-360).
 */
async function fetchMoonLongitude(refTime: Date): Promise<number | null> {
    const baseUrl = "https://ssd.jpl.nasa.gov/api/horizons.api"

    // Format: 'YYYY-MM-DD HH:MM' (avec apostrophes simples)
    const startTime = `'${refTime.toISOString().slice(0, 16).replace('T', ' ')}'`
    const stopDate = new Date(refTime.getTime() + 3600000) // +1 heure
    const stopTime = `'${stopDate.toISOString().slice(0, 16).replace('T', ' ')}'`

    const params = new URLSearchParams({
        format: "text",
        COMMAND: "301",           // Moon
        CENTER: "@399",           // Earth
        EPHEM_TYPE: "VECTORS",
        REF_PLANE: "ECLIPTIC",
        START_TIME: startTime,
        STOP_TIME: stopTime,
        STEP_SIZE: "1h",
        CSV_FORMAT: "YES",
        OBJ_DATA: "NO"
    })

    try {
        const res = await fetch(`${baseUrl}?${params.toString()}`, {
            signal: AbortSignal.timeout(10000)
        })

        if (!res.ok) {
            console.error('Horizons API error (Moon VECTORS):', res.status)
            return null
        }

        const text = await res.text()

        // Parser la section $$SOE ... $$EOE
        const soeIndex = text.indexOf('$$SOE')
        const eoeIndex = text.indexOf('$$EOE')

        if (soeIndex === -1 || eoeIndex === -1) {
            console.error('No $$SOE/$$EOE markers found in Moon VECTORS response')
            return null
        }

        const dataBlock = text.slice(soeIndex + 5, eoeIndex).trim()
        const lines = dataBlock.split('\n').filter(l => l.trim())

        if (lines.length === 0) {
            console.error('No data lines in Moon VECTORS response')
            return null
        }

        // Première ligne de données
        const line = lines[0]
        const parts = line.split(',').map(p => p.trim())

        // Format CSV VECTORS: JDTDB, Calendar Date, X, Y, Z, VX, VY, VZ
        // Index: 0=JDTDB, 1=Date, 2=X, 3=Y, 4=Z
        if (parts.length < 5) {
            console.error('Insufficient columns in Moon VECTORS CSV')
            return null
        }

        const X = parseFloat(parts[2])
        const Y = parseFloat(parts[3])

        if (isNaN(X) || isNaN(Y)) {
            console.error('Invalid X/Y coordinates in Moon VECTORS')
            return null
        }

        // Calcul longitude écliptique
        let lonRad = Math.atan2(Y, X)
        let lonDeg = lonRad * (180 / Math.PI)

        // Normaliser entre 0 et 360
        if (lonDeg < 0) lonDeg += 360

        return lonDeg

    } catch (error) {
        console.error('Error fetching Moon longitude from Horizons:', error)
        return null
    }
}

/**
 * Récupère la longitude du nœud lunaire via NASA JPL Horizons (ELEMENTS).
 * Retourne la longitude en degrés (0-360).
 */
async function fetchNodeLongitude(refTime: Date): Promise<number | null> {
    const baseUrl = "https://ssd.jpl.nasa.gov/api/horizons.api"

    const startTime = `'${refTime.toISOString().slice(0, 16).replace('T', ' ')}'`
    const stopDate = new Date(refTime.getTime() + 3600000)
    const stopTime = `'${stopDate.toISOString().slice(0, 16).replace('T', ' ')}'`

    const params = new URLSearchParams({
        format: "text",
        COMMAND: "301",           // Moon
        CENTER: "@399",           // Earth
        EPHEM_TYPE: "ELEMENTS",
        REF_PLANE: "ECLIPTIC",
        START_TIME: startTime,
        STOP_TIME: stopTime,
        STEP_SIZE: "1h",
        CSV_FORMAT: "YES",
        OBJ_DATA: "NO"
    })

    try {
        const res = await fetch(`${baseUrl}?${params.toString()}`, {
            signal: AbortSignal.timeout(10000)
        })

        if (!res.ok) {
            console.error('Horizons API error (Moon ELEMENTS):', res.status)
            return null
        }

        const text = await res.text()

        const soeIndex = text.indexOf('$$SOE')
        const eoeIndex = text.indexOf('$$EOE')

        if (soeIndex === -1 || eoeIndex === -1) {
            console.error('No $$SOE/$$EOE markers found in Moon ELEMENTS response')
            return null
        }

        const dataBlock = text.slice(soeIndex + 5, eoeIndex).trim()
        const lines = dataBlock.split('\n').filter(l => l.trim())

        if (lines.length === 0) {
            console.error('No data lines in Moon ELEMENTS response')
            return null
        }

        const line = lines[0]
        const parts = line.split(',').map(p => p.trim())

        // Format CSV ELEMENTS: JDTDB, Calendar Date, EC, QR, IN, OM, W, Tp, N, MA, TA, A, AD, PR
        // Index: 0=JDTDB, 1=Date, 2=EC, 3=QR, 4=IN, 5=OM
        // OM = Longitude of Ascending Node (Ω)
        if (parts.length < 6) {
            console.error('Insufficient columns in Moon ELEMENTS CSV')
            return null
        }

        const OM = parseFloat(parts[5])

        if (isNaN(OM)) {
            console.error('Invalid OM (node longitude) in Moon ELEMENTS')
            return null
        }

        // Normaliser entre 0 et 360
        let nodeLon = OM % 360
        if (nodeLon < 0) nodeLon += 360

        return nodeLon

    } catch (error) {
        console.error('Error fetching Node longitude from Horizons:', error)
        return null
    }
}

/**
 * Calcule les données zodiacales (Lune + Nœud) via NASA JPL Horizons.
 * Retourne les longitudes brutes + signes + élément.
 */
async function fetchZodiacalData(refTime: Date): Promise<{
    moon_lon_deg: number | null
    node_lon_deg: number | null
    moon_zodiac_sign: string | null
    moon_element: string | null
    lunar_node_sign: string | null
    lunar_node_north_sign: string | null
    lunar_node_south_sign: string | null
}> {
    // Appels en parallèle
    const [moonLon, nodeLon] = await Promise.all([
        fetchMoonLongitude(refTime),
        fetchNodeLongitude(refTime)
    ])

    let moonSign: string | null = null
    let moonElement: string | null = null
    let nodeSign: string | null = null
    let nodeSouth: string | null = null

    if (moonLon !== null) {
        moonSign = zodiacFromLongitude(moonLon)
        moonElement = zodiacElements[moonSign] || null
    }

    if (nodeLon !== null) {
        nodeSign = zodiacFromLongitude(nodeLon)

        // Calcul du Nœud Sud (opposé du Nord/Node normal)
        nodeSouth = oppositeSign(nodeSign)
    }

    return {
        moon_lon_deg: moonLon,
        node_lon_deg: nodeLon,
        moon_zodiac_sign: moonSign,
        moon_element: moonElement,
        lunar_node_sign: nodeSign, // Legacy field, kept for compatibility if needed
        lunar_node_north_sign: nodeSign, // Explicit North Node
        lunar_node_south_sign: nodeSouth // Explicit South Node
    }
}

// ============================================================================
// PHASE LUNAIRE & CYCLE
// ============================================================================

/**
 * Récupère la phase lunaire actuelle et son taux d'illumination.
 * Source : API Farmsense (gratuite, publique).
 * Si l'API est indisponible, utilise un calcul algorithmique de secours.
 */
async function fetchMoonPhase(date: Date) {
    const timestamp = Math.floor(date.getTime() / 1000)

    try {
        const res = await fetch(
            `https://api.farmsense.net/v1/moonphases/?d=${timestamp}`,
            { signal: AbortSignal.timeout(5000) }
        )

        if (!res.ok) throw new Error('API response not OK')

        const data = await res.json()
        const phaseEn = data[0]?.Phase
        const illumination = Math.round(Number(data[0]?.Illumination) || 0)

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

        let finalName = phaseMap[phaseEn] ?? phaseEn ?? 'Inconnue'

        return {
            phase_name: finalName,
            illumination_pct: illumination
        }
    } catch (error) {
        console.warn('Farmsense API unavailable, using algorithmic fallback', error)

        const knownNewMoon = new Date('2000-01-06T18:14:00Z').getTime()
        const lunarCycle = 29.53058867 * 24 * 60 * 60 * 1000

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

        const knownNewMoon = new Date('2000-01-06T18:14:00Z').getTime()
        const lunarCycle = 29.53058867 * 24 * 60 * 60 * 1000

        const cyclesSince = Math.floor((date.getTime() - knownNewMoon) / lunarCycle)
        const lastNewMoonTime = knownNewMoon + (cyclesSince * lunarCycle)

        return new Date(lastNewMoonTime)
    }
}

/**
 * Calcule le jour actuel du cycle lunaire (J1 à J29/30).
 */
function calculateCycleDay(lastNewMoon: Date, today: Date): number {
    const diffMs = today.getTime() - lastNewMoon.getTime()
    return Math.max(1, Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1)
}

// ============================================================================
// DISTANCE LUNAIRE
// ============================================================================

/**
 * Calcule les données de distance lunaire, périgée et apogée.
 * Utilise astronomy-engine pour la précision.
 */
function fetchMoonDistanceAndApsides(date: Date) {
    const vec = Astronomy.GeoVector(Astronomy.Body.Moon, date, true)
    const distanceKm = Math.sqrt(vec.x * vec.x + vec.y * vec.y + vec.z * vec.z) * 149597870.7

    const startScan = new Date(date.getTime() - 40 * 24 * 3600 * 1000)

    let lastPerigeeDist = 362600
    let lastApogeeDist = 405400

    let iterDate = startScan
    for (let i = 0; i < 15; i++) {
        const apsis = Astronomy.SearchLunarApsis(iterDate)
        if (!apsis) break
        if (apsis.time.date > date) break

        const v = Astronomy.GeoVector(Astronomy.Body.Moon, apsis.time, true)
        const dist = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z) * 149597870.7

        if (apsis.kind === 0) lastPerigeeDist = dist
        else lastApogeeDist = dist

        iterDate = new Date(apsis.time.date.getTime() + 24 * 3600 * 1000)
    }

    const range = lastApogeeDist - lastPerigeeDist
    let ratio = range !== 0 ? (distanceKm - lastPerigeeDist) / range : 0.5
    ratio = Math.max(0, Math.min(1, ratio))

    return {
        distanceKm: Math.round(distanceKm),
        perigeeKm: Math.round(lastPerigeeDist),
        apogeeKm: Math.round(lastApogeeDist),
        ratio: Number(ratio.toFixed(4))
    }
}

// ============================================================================
// ROUTE API PRINCIPALE
// ============================================================================

/**
 * Route GET /api/dashboard?date=YYYY-MM-DD
 * 
 * Retourne les données du dashboard pour une date donnée.
 * Gère le cache Supabase et recalcule les données zodiacales si nécessaire.
 */
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const dateParam = searchParams.get('date')

    // Date cible (Paris timezone)
    const targetDate = dateParam || getTodayDateParis()

    // Heure de référence pour les calculs zodiacaux (12:00 Paris → UTC)
    const refTime = getReferenceTimeUTC(targetDate)

    // Date pour les autres calculs (midi UTC pour cohérence)
    const targetDateObj = new Date(targetDate + 'T12:00:00Z')

    try {
        // Étape 1 : Vérifier si la ligne existe déjà
        const { data: existing, error: fetchError } = await supabase
            .from('dashboard_daily')
            .select('*')
            .eq('dashboard_date', targetDate)
            .single()

        if (fetchError && fetchError.code !== 'PGRST116') {
            console.error('Supabase fetch error:', fetchError)
            return NextResponse.json({ error: fetchError.message }, { status: 500 })
        }

        // Étape 2 : Déterminer si on doit (re)calculer les données zodiacales
        // On recalcule si lunar_node_north_sign (nouveau champ) est manquant
        const needsZodiacCalculation = !existing ||
            existing.moon_lon_deg === null ||
            existing.node_lon_deg === null ||
            !existing.lunar_node_north_sign

        // Étape 3 : Si la ligne existe avec toutes les données → retour direct
        if (existing && !needsZodiacCalculation) {
            return NextResponse.json(existing)
        }

        // Étape 4 : Calculer les données manquantes
        let zodiacData = null
        let phaseData = null
        let cycleDay = null
        let distanceData = null

        if (needsZodiacCalculation) {
            console.log(`Calculating zodiacal data for ${targetDate} at ${refTime.toISOString()}`)
            zodiacData = await fetchZodiacalData(refTime)
        }

        // Si la ligne n'existe pas, calculer TOUTES les données
        if (!existing) {
            console.log(`Calculating all data for ${targetDate}`)

            // Phase lunaire
            phaseData = await fetchMoonPhase(targetDateObj)

            // Cycle day
            const lastNewMoonDate = await fetchLastNewMoon(targetDateObj)
            cycleDay = calculateCycleDay(lastNewMoonDate, targetDateObj)

            // Distance
            distanceData = fetchMoonDistanceAndApsides(targetDateObj)
        }

        // Étape 5 : UPDATE si la ligne existe mais manque de données zodiacales
        if (existing && needsZodiacCalculation && zodiacData) {
            const updatePayload = {
                moon_lon_deg: zodiacData.moon_lon_deg,
                node_lon_deg: zodiacData.node_lon_deg,
                moon_zodiac_sign: zodiacData.moon_zodiac_sign,
                moon_element: zodiacData.moon_element,
                lunar_node_sign: zodiacData.lunar_node_sign,
                lunar_node_north_sign: zodiacData.lunar_node_north_sign,
                lunar_node_south_sign: zodiacData.lunar_node_south_sign,
                zodiac_ref_time: refTime.toISOString(),
                zodiac_source: 'NASA JPL Horizons'
            }

            const { data: updated, error: updateError } = await supabase
                .from('dashboard_daily')
                .update(updatePayload)
                .eq('dashboard_date', targetDate)
                .select()
                .single()

            if (updateError) {
                console.error('Supabase update error:', updateError)
                return NextResponse.json({ error: updateError.message }, { status: 500 })
            }

            return NextResponse.json(updated)
        }

        // Étape 6 : INSERT si la ligne n'existe pas
        if (!existing) {
            if (!zodiacData || !phaseData || !distanceData) {
                return NextResponse.json({
                    error: 'Failed to calculate required data'
                }, { status: 500 })
            }

            const insertPayload = {
                dashboard_date: targetDate,
                timezone: 'Europe/Paris',

                // Données zodiacales (NASA JPL Horizons)
                moon_lon_deg: zodiacData.moon_lon_deg,
                node_lon_deg: zodiacData.node_lon_deg,
                moon_zodiac_sign: zodiacData.moon_zodiac_sign,
                moon_element: zodiacData.moon_element,
                lunar_node_sign: zodiacData.lunar_node_sign,
                lunar_node_north_sign: zodiacData.lunar_node_north_sign,
                lunar_node_south_sign: zodiacData.lunar_node_south_sign,
                zodiac_ref_time: refTime.toISOString(),
                zodiac_source: 'NASA JPL Horizons',

                // Données phase lunaire (Farmsense)
                phase_name: phaseData.phase_name,
                illumination_pct: phaseData.illumination_pct,
                cycle_day: cycleDay,

                // Données distance (Astronomy Engine)
                moon_distance_km: distanceData.distanceKm,
                perigee_distance_km: distanceData.perigeeKm,
                apogee_distance_km: distanceData.apogeeKm,
                perigee_apogee_ratio: distanceData.ratio
            }

            const { data: inserted, error: insertError } = await supabase
                .from('dashboard_daily')
                .insert(insertPayload)
                .select()
                .single()

            if (insertError) {
                console.error('Supabase insert error:', insertError)
                return NextResponse.json({ error: insertError.message }, { status: 500 })
            }

            return NextResponse.json(inserted)
        }

        // Cas improbable : ne devrait jamais arriver
        return NextResponse.json({ error: 'Unexpected state' }, { status: 500 })

    } catch (error) {
        console.error('Unexpected error in /api/dashboard:', error)
        return NextResponse.json({
            error: 'Internal server error',
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 })
    }
}
