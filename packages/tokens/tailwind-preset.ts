import type { Config } from "tailwindcss";
import { colors, typography, spacing, radius } from "./src";

const config: Config = {
    content: [],
    theme: {
        extend: {
            colors: {
                ...colors, // Flattening might be needed depending on usage, but usually works for structured extensions
            },
            fontFamily: {
                skranji: ["Skranji", "cursive"],
                spartan: ["LeagueSpartan_400Regular", "sans-serif"],
            },
            fontSize: {
                "title-big": [`${typography.fontSize.titleBig}px`, { lineHeight: `${typography.lineHeight.title}` }],
                "title-med": [`${typography.fontSize.titleMed}px`, { lineHeight: `${typography.lineHeight.title}` }],
                "title-lit": [`${typography.fontSize.titleLit}px`, { lineHeight: `${typography.lineHeight.title}` }],
                "para-big": [`${typography.fontSize.paraBig}px`, { lineHeight: `${typography.lineHeight.body}` }],
                "para": [`${typography.fontSize.para}px`, { lineHeight: `${typography.lineHeight.body}` }],
                "para-lit": [`${typography.fontSize.paraLit}px`, { lineHeight: `${typography.lineHeight.body}` }],
                "legend": [`${typography.fontSize.legend}px`, { lineHeight: `${typography.lineHeight.body}` }],
            },
            spacing: {
                ...spacing,
            },
            borderRadius: {
                ...radius,
            }
        },
    },
    plugins: [],
};

export default config;
