"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface MorphingLoaderProps {
    images: string[]; // List of URLs (distractors)
    finalImage: string; // The result image to land on
    onComplete: () => void;
}

export function MorphingLoader({ images, finalImage, onComplete }: MorphingLoaderProps) {
    const [currentImage, setCurrentImage] = useState(images[0]);
    const [index, setIndex] = useState(0);
    const [speed, setSpeed] = useState(50); // Start fast (50ms)

    useEffect(() => {
        let timeout: NodeJS.Timeout;

        const cycle = () => {
            // Logic:
            // 1. Cycle through images
            // 2. Increase delay (slow down) over time
            // 3. When slow enough, switch to finalImage and stop

            if (speed > 400) {
                // End sequence
                setCurrentImage(finalImage);
                // Wait a moment on the final image then trigger completion
                setTimeout(onComplete, 800);
                return;
            }

            // Next image
            const nextIndex = (index + 1) % images.length;
            setCurrentImage(images[nextIndex]);
            setIndex(nextIndex);

            // Decelerate: Increase speed (delay)
            // e.g. 50 -> 60 -> 72 -> ...
            setSpeed((prev) => prev * 1.15);
        };

        timeout = setTimeout(cycle, speed);
        return () => clearTimeout(timeout);
    }, [speed, index, images, finalImage, onComplete]);

    return (
        <div className="flex flex-col items-center justify-center p-8 bg-[var(--background-800)/90] backdrop-blur-md rounded-2xl border border-[var(--accent-500)/30] shadow-2xl">
            <div className="relative w-48 h-64 md:w-64 md:h-80">
                <motion.img
                    key={currentImage} // Trigger Animation on change
                    src={currentImage}
                    alt="Mystical Card"
                    className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(241,186,91,0.3)]"
                    initial={{ opacity: 0.8, scale: 0.95, filter: "blur(2px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: speed > 200 ? 0.3 : 0.1 }}
                />

                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--accent-500)/20] to-transparent rounded-xl pointer-events-none" />
            </div>

            <motion.p
                className="mt-6 text-[var(--accent-500)] font-heading text-xl tracking-widest uppercase"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
            >
                Connexion...
            </motion.p>
        </div>
    );
}
