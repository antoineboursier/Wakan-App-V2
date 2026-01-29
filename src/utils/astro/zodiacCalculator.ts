export type ZodiacSignSlug =
    | 'aries' | 'taurus' | 'gemini' | 'cancer'
    | 'leo' | 'virgo' | 'libra' | 'scorpio'
    | 'sagittarius' | 'capricorn' | 'aquarius' | 'pisces';

export type ElementSlug = 'fire' | 'earth' | 'air' | 'water';
export type ModalitySlug = 'cardinal' | 'fixed' | 'mutable';

interface ZodiacSignDefinition {
    slug: ZodiacSignSlug;
    element: ElementSlug;
    modality: ModalitySlug;
    startMonth: number; // 1-12
    startDay: number;
    endMonth: number;
    endDay: number;
}

const ZODIAC_DEFINITIONS: ZodiacSignDefinition[] = [
    { slug: 'aries', element: 'fire', modality: 'cardinal', startMonth: 3, startDay: 21, endMonth: 4, endDay: 19 },
    { slug: 'taurus', element: 'earth', modality: 'fixed', startMonth: 4, startDay: 20, endMonth: 5, endDay: 20 },
    { slug: 'gemini', element: 'air', modality: 'mutable', startMonth: 5, startDay: 21, endMonth: 6, endDay: 20 },
    { slug: 'cancer', element: 'water', modality: 'cardinal', startMonth: 6, startDay: 21, endMonth: 7, endDay: 22 },
    { slug: 'leo', element: 'fire', modality: 'fixed', startMonth: 7, startDay: 23, endMonth: 8, endDay: 22 },
    { slug: 'virgo', element: 'earth', modality: 'mutable', startMonth: 8, startDay: 23, endMonth: 9, endDay: 22 },
    { slug: 'libra', element: 'air', modality: 'cardinal', startMonth: 9, startDay: 23, endMonth: 10, endDay: 22 },
    { slug: 'scorpio', element: 'water', modality: 'fixed', startMonth: 10, startDay: 23, endMonth: 11, endDay: 21 },
    { slug: 'sagittarius', element: 'fire', modality: 'mutable', startMonth: 11, startDay: 22, endMonth: 12, endDay: 21 },
    { slug: 'capricorn', element: 'earth', modality: 'cardinal', startMonth: 12, startDay: 22, endMonth: 1, endDay: 19 },
    { slug: 'aquarius', element: 'air', modality: 'fixed', startMonth: 1, startDay: 20, endMonth: 2, endDay: 18 },
    { slug: 'pisces', element: 'water', modality: 'mutable', startMonth: 2, startDay: 19, endMonth: 3, endDay: 20 },
];

export interface ZodiacProfile {
    sunSign: ZodiacSignSlug;
    decan: 1 | 2 | 3;
    element: ElementSlug;
    modality: ModalitySlug;
}

export function calculateZodiacProfile(birthDateString: string): ZodiacProfile | null {
    if (!birthDateString) return null;

    // Parse manuel pour éviter les problèmes de timezone avec new Date()
    const [yStr, mStr, dStr] = birthDateString.split('-');
    if (!yStr || !mStr || !dStr) return null;

    const year = parseInt(yStr, 10);
    const month = parseInt(mStr, 10);
    const day = parseInt(dStr, 10);

    // Validation stricte du jour (tient compte des années bissextiles)
    const daysInMonth = new Date(year, month, 0).getDate();
    if (isNaN(year) || isNaN(month) || isNaN(day) || month < 1 || month > 12 || day < 1 || day > daysInMonth) {
        return null;
    }

    const mmdd = month * 100 + day;

    // 1. Trouver le signe solaire (Logique MMDD)
    const signDef = ZODIAC_DEFINITIONS.find(s => {
        const start = s.startMonth * 100 + s.startDay;
        const end = s.endMonth * 100 + s.endDay;

        if (start <= end) {
            return mmdd >= start && mmdd <= end;
        } else {
            // Cas chevauchant l'année (ex: Capricorne)
            return mmdd >= start || mmdd <= end;
        }
    });

    if (!signDef) return null;

    // 2. Calculer le décan (Approximation fixe lot 1)
    // Decan 1: Jours 1-10 du signe
    // Decan 2: Jours 11-20 du signe
    // Decan 3: Reste

    // Pour calculer le "jour du signe", on doit savoir quand le signe a commencé.
    // Problème : l'année bissextile change légèrement, mais lot 1 = bornes fixes.

    // On va simplifier :
    // Si (month == startMonth) -> jour - startDay
    // Si (month == endMonth) -> (jours dans startMonth - startDay) + jour

    let dayInSign = 0;
    if (month === signDef.startMonth) {
        dayInSign = day - signDef.startDay;
    } else {
        // Mois suivant. Calcul exact basé sur le nombre de jours du mois de début.
        // Un signe dure ~30 jours.
        // Si on est dans le mois de fin, on ajoute le nombre de jours du mois de début restant.
        // Ex: Aries (Mar 21). Si on est le 25 mars -> dayInSign = 4.
        // Si on est le 5 avril -> dayInSign = (31 - 21) + 5 = 15.

        const daysInStartMonth = new Date(2000, signDef.startMonth, 0).getDate(); // Année bissextile 2000 arbitraire pour avoir 29 jours en fév si besoin, ou standard
        dayInSign = (daysInStartMonth - signDef.startDay) + day;
    }

    // Decan logic standard : 0-9 jours (1er), 10-19 jours (2eme), 20+ (3eme)
    let decan: 1 | 2 | 3 = 1;
    if (dayInSign >= 10 && dayInSign < 20) decan = 2;
    if (dayInSign >= 20) decan = 3;

    return {
        sunSign: signDef.slug,
        decan: decan,
        element: signDef.element,
        modality: signDef.modality
    };
}
