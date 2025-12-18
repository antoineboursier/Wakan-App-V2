"use client";

import { useEffect, useState, useRef } from "react";
import { GlassCard } from "@/components/ui/GlassCard";

const RUNIC_GLYPHS = "ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛜᛞᛟ";

interface DrawAnimationProps {
    onComplete: () => void;
    resultName?: string; // Nom final pour le reveal (non utilisé en V1 pure slot machine glyphs, mais utile si on veut afficher le nom à la fin)
    duration?: number;
}

export function DrawAnimation({ onComplete, duration = 2000 }: DrawAnimationProps) {
    const [glyph, setGlyph] = useState("ᚠ");
    const [isSlowingDown, setIsSlowingDown] = useState(false);

    // Ref pour gérer l'intervalle
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const startTimeRef = useRef<number>(Date.now());
    const speedRef = useRef<number>(50); // Vitesse initiale (ms)

    useEffect(() => {
        let currentSpeed = 50;

        const tick = () => {
            // Changer de glyphe
            const char = RUNIC_GLYPHS.charAt(Math.floor(Math.random() * RUNIC_GLYPHS.length));
            setGlyph(char);

            const elapsed = Date.now() - startTimeRef.current;

            if (elapsed < duration * 0.6) {
                // Phase rapide constante
                intervalRef.current = setTimeout(tick, 50);
            } else if (elapsed < duration) {
                // Phase ralentissement
                setIsSlowingDown(true);
                // On augmente le délai exponentiellement
                const progress = (elapsed - duration * 0.6) / (duration * 0.4);
                currentSpeed = 50 + (progress * 300); // Ralentit jusqu'à 350ms
                intervalRef.current = setTimeout(tick, currentSpeed);
            } else {
                // Fin
                onComplete();
            }
        };

        tick();

        return () => {
            if (intervalRef.current) clearTimeout(intervalRef.current);
        };
    }, [duration, onComplete]);

    return (
        <div className="flex flex-col items-center justify-center animate-in fade-in duration-500">
            <div className="relative flex items-center justify-center w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-[var(--accent-500)] bg-[var(--background-800)] shadow-[0_0_40px_rgba(246,174,49,0.3)]">
                {/* Effet Glow interne */}
                <div className="absolute inset-0 rounded-full bg-[var(--accent-900)] opacity-10 blur-xl animate-pulse"></div>

                <span className="text-6xl md:text-8xl text-[var(--text-primary)] font-heading drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                    {glyph}
                </span>
            </div>
            <p className="mt-8 text-[var(--accent-500)] uppercase tracking-widest text-sm animate-pulse">
                {isSlowingDown ? "Révélation..." : "Connexion aux énergies..."}
            </p>
        </div>
    );
}
