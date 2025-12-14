"use client";

import { Icon } from "@iconify/react";

export function PremiumCard() {
    return (
        <div
            style={{
                borderRadius: "var(--sizes-s)",
                border: "1px dashed var(--accent-900)",
                background: "rgba(24, 39, 46, 0.30)",
                backdropFilter: "blur(2px)",
                display: "flex",
                padding: "var(--sizes-m)",
                justifyContent: "space-between", /* Changed to space-between to push arrow right */
                alignItems: "center",
                gap: "16px",
                alignSelf: "stretch",
                width: "100%",
                cursor: "pointer",
            }}
        >
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>

                {/* "Accès premium" */}
                <span className="para" style={{ color: "var(--text-secondary)", fontSize: "15px" }}>
                    Accès premium
                </span>

                {/* "2€/mois" */}
                <span className="title-lit" style={{ color: "var(--accent-900)", marginTop: "4px" }}>
                    2€/mois
                </span>

                {/* "Débloque tout..." */}
                <span className="para" style={{ color: "var(--accent-700)", fontWeight: "bold", marginTop: "4px" }}>
                    Débloque tout, sans mauvaise suprise.
                </span>

                {/* "Et bien sûr..." */}
                <span className="para" style={{ color: "var(--accent-500)" }}>
                    Et bien sûr, c’est sans engagement.
                </span>
            </div>

            {/* Flèche Iconify */}
            <Icon
                icon="fa:arrow-right"
                className="text-[var(--text-primary)]"
                style={{ fontSize: "24px", flexShrink: 0 }}
            />
        </div>
    );
}
