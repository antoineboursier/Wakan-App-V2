import { ZodiacSignSlug, ElementSlug, ModalitySlug } from "@/utils/astro/zodiacCalculator";

export interface BoContent {
    displayName: string;
    descriptionMain: string;
    iconGlow?: string; // Iconify ID or Image URL
    heroImage?: string; // URL asset
    backgroundImage?: string; // Special background URL
}

export const ZODIAC_SIGNS_CONTENT: Record<ZodiacSignSlug, BoContent> = {
    aries: {
        displayName: "Bélier",
        descriptionMain: "Audacieux et pionnier, vous ouvrez la voie avec énergie.",
        iconGlow: "mdi:zodiac-aries",
        heroImage: "/zodiac/aries-hero.png" // Placeholder
    },
    taurus: {
        displayName: "Taureau",
        descriptionMain: "Stable et sensoriel, vous bâtissez pour durer.",
        iconGlow: "mdi:zodiac-taurus",
        heroImage: "/zodiac/taurus-hero.png"
    },
    gemini: {
        displayName: "Gémeaux",
        descriptionMain: "Curieux et adaptable, vous connectez les idées et les gens.",
        iconGlow: "mdi:zodiac-gemini",
        heroImage: "/zodiac/gemini-hero.png"
    },
    cancer: {
        displayName: "Cancer",
        descriptionMain: "Protecteur et intuitif, vous veillez sur votre clan.",
        iconGlow: "mdi:zodiac-cancer",
        heroImage: "/zodiac/cancer-hero.png"
    },
    leo: {
        displayName: "Lion",
        descriptionMain: "Rayonnant et créatif, vous inspirez par votre présence.",
        iconGlow: "mdi:zodiac-leo",
        heroImage: "/zodiac/leo-hero.png"
    },
    virgo: {
        displayName: "Vierge",
        descriptionMain: "Précis et serviable, vous cherchez la perfection au quotidien.",
        iconGlow: "mdi:zodiac-virgo",
        heroImage: "/zodiac/virgo-hero.png"
    },
    libra: {
        displayName: "Balance",
        descriptionMain: "Harmonieux et diplomate, vous cherchez l'équilibre en tout.",
        iconGlow: "mdi:zodiac-libra",
        heroImage: "/zodiac/libra-hero.png"
    },
    scorpio: {
        displayName: "Scorpion",
        descriptionMain: "Intense et perspicace, vous allez au fond des choses.",
        iconGlow: "mdi:zodiac-scorpio",
        heroImage: "/zodiac/scorpio-hero.png"
    },
    sagittarius: {
        displayName: "Sagittaire",
        descriptionMain: "Optimiste et aventurier, vous visez toujours plus loin.",
        iconGlow: "mdi:zodiac-sagittarius",
        heroImage: "/zodiac/sagittarius-hero.png"
    },
    capricorn: {
        displayName: "Capricorne",
        descriptionMain: "Ambitieux et persévérant, vous gravissez les sommets.",
        iconGlow: "mdi:zodiac-capricorn",
        heroImage: "/zodiac/capricorn-hero.png"
    },
    aquarius: {
        displayName: "Verseau",
        descriptionMain: "Original et visionnaire, vous réinventez le futur.",
        iconGlow: "mdi:zodiac-aquarius",
        heroImage: "/zodiac/aquarius-hero.png"
    },
    pisces: {
        displayName: "Poissons",
        descriptionMain: "Sensible et rêveur, vous êtes connecté à l'invisible.",
        iconGlow: "mdi:zodiac-pisces",
        heroImage: "/zodiac/pisces-hero.png"
    }
};

export const ELEMENTS_CONTENT: Record<ElementSlug, BoContent> = {
    fire: {
        displayName: "Feu",
        descriptionMain: "Énergie, action, impulsion. Le feu transforme et illumine.",
        iconGlow: "mdi:fire",
    },
    earth: {
        displayName: "Terre",
        descriptionMain: "Stabilité, réalisme, construction. La terre nourrit et soutient.",
        iconGlow: "mdi:earth",
    },
    air: {
        displayName: "Air",
        descriptionMain: "Intellect, communication, mouvement. L'air relie et disperse.",
        iconGlow: "mdi:weather-windy",
    },
    water: {
        displayName: "Eau",
        descriptionMain: "Émotion, intuition, fluidité. L'eau ressent et purifie.",
        iconGlow: "mdi:water",
    }
};

export const MODALITIES_CONTENT: Record<ModalitySlug, BoContent> = {
    cardinal: {
        displayName: "Cardinal",
        descriptionMain: "Ceux qui initient. La force de démarrage des saisons.",
        iconGlow: "mdi:arrow-up-bold-circle",
    },
    fixed: {
        displayName: "Fixe",
        descriptionMain: "Ceux qui stabilisent. La force de persévérance au cœur des saisons.",
        iconGlow: "mdi:checkbox-blank-circle",
    },
    mutable: {
        displayName: "Mutable",
        descriptionMain: "Ceux qui adaptent. La force de transition vers la saison suivante.",
        iconGlow: "mdi:sync",
    }
};
