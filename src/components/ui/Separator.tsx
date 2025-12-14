import React from "react";

export function Separator() {
    return (
        <div className="flex items-center justify-center w-full py-12">
            {/* Point gauche */}
            <div className="animate-shrink-grow w-1.5 h-1.5 rounded-full bg-[var(--text-primary)]"></div>

            {/* SVG Animé - Inline pour contrôle CSS */}
            <svg
                width="61"
                height="38"
                viewBox="0 0 61 38"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="block"
            >
                {/* Cercle central fixe (Accent 900) */}
                <circle
                    className="animate-shrink-grow"
                    cx="30"
                    cy="19.0618"
                    r="10.75"
                    stroke="var(--accent-900)"
                    strokeWidth="1.5"
                />

                {/* Cercle fin fixe (Accent 500) */}
                <circle
                    cx="30"
                    cy="19.0618"
                    r="14.25"
                    stroke="var(--accent-500)"
                    strokeWidth="0.5"
                />

                {/* Point central (Text Primary) */}
                <circle cx="30" cy="19.0618" r="2.5" fill="var(--text-primary)" />

                {/* Cercle pointillé ANIMÉ (Accent 700) */}
                {/* J'ajoute la classe d'animation ici */}
                <circle
                    className="animate-spin"
                    cx="30"
                    cy="19.0618"
                    r="17.5"
                    stroke="var(--accent-700)"
                    strokeLinecap="round"
                    strokeDasharray="2 3"
                    style={{ transformOrigin: "30px 19.0618px" }}
                />
            </svg>

            {/* Point droit */}
            <div className="animate-shrink-grow w-1.5 h-1.5 rounded-full bg-[var(--text-primary)]"></div>
        </div>
    );
}
