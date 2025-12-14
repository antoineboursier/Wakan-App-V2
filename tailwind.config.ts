import type { Config } from "tailwindcss";

export default {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ["var(--font-league-spartan)", "sans-serif"],
                heading: ["var(--font-skranji)", "serif"],
                body: ["var(--font-league-spartan)", "sans-serif"],
            },
            colors: {
                background: {
                    900: "var(--background-900)",
                    800: "var(--background-800)",
                    700: "var(--background-700)",
                    600: "var(--background-600)",
                    500: "var(--background-500)",
                },
                text: {
                    primary: "var(--text-primary)",
                    secondary: "var(--text-secondary)",
                    tertiary: "var(--text-tertiary)",
                    disabled: "var(--text-disabled)",
                },
                accent: {
                    900: "var(--accent-900)",
                    700: "var(--accent-700)",
                    500: "var(--accent-500)",
                },
                rich: {
                    pink: "var(--rich-pink)",
                    purple: "var(--rich-purple)",
                    yellow: "var(--rich-yellow)",
                    blue: "var(--rich-blue)",
                },
            },
        },
    },
    plugins: [],
} satisfies Config;
