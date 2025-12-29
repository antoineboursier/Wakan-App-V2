"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/Button";

interface DrawResultDisplayProps {
    subtitle: string; // intro_subtitle du BO (ex: "Ta rune du jour")
    itemName: string; // Nom de la valeur (ex: "Fehu")
    itemImageUrl?: string | null;
    itemDescription: string; // Description longue de la valeur
    distractorImages: string[];
    shouldAnimate: boolean;
    isReversed?: boolean;
    // Pour le bouton de tirage complexe
    btnSecondEnabled?: boolean;
    btnSecondLabel?: string;
    btnSecondIcon?: string;
    onComplexDraw?: () => void;
    // Premium handling
    isPremium?: boolean;
    isSecondBtnPremium?: boolean;
}

export function DrawResultDisplay({
    subtitle,
    itemName,
    itemImageUrl,
    itemDescription,
    distractorImages,
    shouldAnimate,
    isReversed = false,
    btnSecondEnabled = false,
    btnSecondLabel,
    btnSecondIcon,
    onComplexDraw,
    isPremium = false,
    isSecondBtnPremium = true
}: DrawResultDisplayProps) {
    const [isAnimating, setIsAnimating] = useState(shouldAnimate);
    const [currentImage, setCurrentImage] = useState(distractorImages[0] || itemImageUrl || '/placeholder.png');
    const [speed, setSpeed] = useState(60);
    const [imageIndex, setImageIndex] = useState(0);
    const [blurAmount, setBlurAmount] = useState(12); // Start with blur
    const [iconError, setIconError] = useState(false); // Track if icon failed to load

    // Check if complex draw button should be locked (non-premium user)
    const isSecondLocked = !isPremium && isSecondBtnPremium;

    // Animation cycle for image morphing
    useEffect(() => {
        if (!isAnimating) return;

        const images = distractorImages.length > 0 ? distractorImages : [itemImageUrl || '/placeholder.png'];

        const timeout = setTimeout(() => {
            if (speed > 350) {
                // End: show final image with no blur
                setCurrentImage(itemImageUrl || '/placeholder.png');
                setBlurAmount(0);
                setTimeout(() => setIsAnimating(false), 600);
                return;
            }

            // Next image in cycle
            const nextIndex = (imageIndex + 1) % images.length;
            setCurrentImage(images[nextIndex]);
            setImageIndex(nextIndex);
            setSpeed(prev => prev * 1.12);
            // Progressively reduce blur (from 12 to 0 as speed goes from 60 to 350)
            setBlurAmount(prev => Math.max(0, prev - 0.5));
        }, speed);

        return () => clearTimeout(timeout);
    }, [isAnimating, speed, imageIndex, distractorImages, itemImageUrl]);

    return (
        <div id="draw-result-wrapper" className="w-full">
            {/* Result Card */}
            <div
                id="draw-result-card"
                className="card-gradient"
            >
                {/* Subtitle - Always visible */}
                <p
                    id="draw-result-subtitle"
                    className="title-med text-[var(--accent-500)] text-center"
                >
                    {subtitle || "Ton message"}
                </p>

                {/* Image Container with Reversed indicator */}
                <div
                    id="draw-result-image"
                    className="relative flex items-center justify-center"
                    style={{ minHeight: '100px' }}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentImage}
                            initial={{ opacity: 0.7, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0.5 }}
                            transition={{ duration: isAnimating ? 0.08 : 0.5 }}
                            className="relative"
                        >
                            <img
                                src={currentImage}
                                alt={isAnimating ? "Tirage en cours..." : itemName}
                                className={`w-20 h-20 object-contain transition-[filter] duration-200 ${!isAnimating ? 'effect-glow-yellow' : ''} ${isReversed && !isAnimating ? 'rotate-180' : ''}`}
                                style={isAnimating ? { filter: `blur(${blurAmount}px)` } : undefined}
                            />

                            {/* Reversed indicator - top right of image */}
                            {isReversed && !isAnimating && (
                                <div className="absolute -top-1 -right-3">
                                    <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="text-[var(--text-primary)]"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M18.5472 13.2929C18.1567 12.9024 17.5235 12.9024 17.133 13.2929L12.8401 17.5858L12.8401 9.5C12.8401 8.94772 12.3924 8.5 11.8401 8.5C11.2878 8.5 10.8401 8.94772 10.8401 9.5L10.8401 17.5858L6.54719 13.2929C6.15667 12.9024 5.5235 12.9024 5.13298 13.2929C4.74246 13.6834 4.74246 14.3166 5.13298 14.7071L11.133 20.7071C11.5235 21.0976 12.1567 21.0976 12.5472 20.7071L18.5472 14.7071C18.9377 14.3166 18.9377 13.6834 18.5472 13.2929ZM12.8401 5.5L12.8401 3C12.8401 2.44772 12.3924 2 11.8401 2C11.2878 2 10.8401 2.44772 10.8401 3L10.8401 5.5C10.8401 6.05229 11.2878 6.5 11.8401 6.5C12.3924 6.5 12.8401 6.05229 12.8401 5.5Z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                </div>
                            )}

                            {/* Animated Glow effect during animation */}
                            {isAnimating && (
                                <motion.div
                                    className="absolute inset-0 rounded-full pointer-events-none"
                                    style={{
                                        background: 'radial-gradient(circle, rgba(241,186,91,0.4) 0%, transparent 70%)',
                                    }}
                                    animate={{
                                        scale: [1, 1.3, 1],
                                        opacity: [0.5, 0.9, 0.5]
                                    }}
                                    transition={{
                                        duration: 0.8,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Loading text during animation */}
                <AnimatePresence>
                    {isAnimating && (
                        <motion.div
                            className="flex flex-col items-center gap-2 text-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <motion.h3
                                className="title-med text-[var(--text-primary)]"
                                animate={{ opacity: [0.6, 1, 0.6] }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            >
                                Connexion aux énergies...
                            </motion.h3>
                            <motion.p
                                className="para-lit text-[var(--text-secondary)]"
                                animate={{ opacity: [0.4, 0.8, 0.4] }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: 0.2
                                }}
                            >
                                Concentrez-vous sur votre intention.
                            </motion.p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Name - Animated appearance after animation */}
                <AnimatePresence>
                    {!isAnimating && (
                        <motion.h1
                            id="draw-result-name"
                            className="title-big text-[var(--accent-900)] text-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            {isReversed ? `${itemName} (renversée)` : itemName}
                        </motion.h1>
                    )}
                </AnimatePresence>

                {/* Description - Animated appearance after animation */}
                <AnimatePresence>
                    {!isAnimating && (
                        <motion.p
                            id="draw-result-description"
                            className="para-big text-[var(--text-primary)] text-center leading-relaxed"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            {itemDescription}
                        </motion.p>
                    )}
                </AnimatePresence>

                {/* Complex Draw Button - Only shown after animation if enabled */}
                <AnimatePresence>
                    {!isAnimating && btnSecondEnabled && btnSecondLabel && onComplexDraw && !iconError && (
                        <motion.div
                            className="mt-4 flex justify-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                        >
                            <Button
                                variant={isSecondLocked ? "secondary" : "primary"}
                                onClick={isSecondLocked ? undefined : onComplexDraw}
                                disabled={isSecondLocked}
                                icon={
                                    isSecondLocked ? (
                                        <Icon icon="mingcute:lock-fill" width={16} height={16} />
                                    ) : btnSecondIcon ? (
                                        <Icon
                                            icon={btnSecondIcon}
                                            width={20}
                                            height={20}
                                            onError={() => setIconError(true)}
                                        />
                                    ) : undefined
                                }
                            >
                                {btnSecondLabel}
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
