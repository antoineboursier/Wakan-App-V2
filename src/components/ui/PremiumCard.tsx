"use client";

import React from "react";

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

            {/* Flèche SVG */}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="24"
                viewBox="0 0 22 24"
                fill="none"
                style={{ flexShrink: 0 }}
            >
                <path
                    d="M8.60734e-07 11.0141L6.73368e-07 12.9859C6.21648e-07 13.5302 0.161912 13.9949 0.485735 14.38C0.809557 14.7651 1.23053 14.9576 1.74864 14.9576L12.2704 14.9576L7.8913 19.4865C7.51268 19.8562 7.32337 20.3184 7.32337 20.8729C7.32337 21.4275 7.51268 21.8896 7.8913 22.2593L9.01223 23.43C9.38089 23.81 9.82926 24 10.3573 24C10.8755 24 11.3288 23.81 11.7174 23.43L21.447 13.3864C21.8157 13.0064 22 12.5443 22 12C22 11.466 21.8157 10.9987 21.447 10.5982L11.7174 0.585365C11.3388 0.195121 10.8854 -8.93934e-07 10.3573 -9.36407e-07C9.83922 -9.78079e-07 9.39085 0.195121 9.01223 0.585365L7.89131 1.72529C7.51268 2.11553 7.32337 2.5828 7.32337 3.12709C7.32337 3.67137 7.51268 4.13864 7.89131 4.52888L12.2704 9.04236L1.74864 9.04236C1.23053 9.04236 0.809558 9.23492 0.485736 9.62002C0.161912 10.0051 9.12455e-07 10.4698 8.60734e-07 11.0141Z"
                    fill="#F4EFEB"
                />
            </svg>
        </div>
    );
}
