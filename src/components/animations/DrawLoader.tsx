"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function DrawLoader() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(timer);
                    return 100;
                }
                return prev + 2; // ~2.5s duration
            });
        }, 50);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center p-8 gap-6 text-center">

            <div className="relative w-32 h-32">
                {/* Rotating Circle */}
                <motion.div
                    className="absolute inset-0 rounded-full border-4 border-[var(--accent-500)] border-t-transparent"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />

                {/* Center Pulsing Orb */}
                <motion.div
                    className="absolute inset-4 rounded-full bg-[var(--accent-900)] opacity-50 blur-xl"
                    animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                />

                <div className="absolute inset-0 flex items-center justify-center text-[var(--accent-300)] font-mono font-bold text-xl">
                    {progress}%
                </div>
            </div>

            <div className="space-y-2">
                <h3 className="title-med text-[var(--text-primary)]">Connexion aux énergies...</h3>
                <p className="para-lit text-[var(--text-secondary)]">Concentrez-vous sur votre intention.</p>
            </div>

        </div>
    );
}
