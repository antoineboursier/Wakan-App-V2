"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { Button } from "../ui/Button";
import { Separator } from "../ui/Separator";
import { Loader } from "../ui/Loader";

interface ComplexDrawItem {
    id: string;
    name: string;
    imageUrl: string;
    description: string;
    isReversed: boolean;
}

interface ComplexDrawDisplayProps {
    subtitle: string;
    items: ComplexDrawItem[];
    distractorImages: string[];
    shouldAnimate: boolean;
    skipFirstAnimation?: boolean; // If true, first item won't animate (already displayed)
    // Action Logic
    onComplexDraw?: () => void;
    btnSecondLabel?: string;
    btnSecondIcon?: string;
    isSecondBtnPremium?: boolean; // Default true in BO logic usually
    isPremium?: boolean;
    isLoadingComplex?: boolean;
}

interface SingleItemDisplayProps {
    item: ComplexDrawItem;
    distractorImages: string[];
    shouldAnimate: boolean;
    isMain: boolean; // true for first item (large), false for others (compact)
    animationDelay: number; // Delay in ms before starting this item's animation
    onAnimationComplete?: () => void;
}

function SingleItemDisplay({
    item,
    distractorImages,
    shouldAnimate,
    isMain,
    animationDelay,
    onAnimationComplete
}: SingleItemDisplayProps) {
    const [isAnimating, setIsAnimating] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);
    const [currentImage, setCurrentImage] = useState(distractorImages[0] || item.imageUrl);
    const [speed, setSpeed] = useState(60);
    const [imageIndex, setImageIndex] = useState(0);
    const [blurAmount, setBlurAmount] = useState(12);

    // Start animation after delay
    useEffect(() => {
        if (!shouldAnimate) {
            setHasStarted(true);
            setIsAnimating(false);
            setCurrentImage(item.imageUrl);
            return;
        }

        const startTimer = setTimeout(() => {
            setHasStarted(true);
            setIsAnimating(true);
        }, animationDelay);

        return () => clearTimeout(startTimer);
    }, [shouldAnimate, animationDelay, item.imageUrl]);

    // Animation cycle
    useEffect(() => {
        if (!isAnimating || !hasStarted) return;

        const images = distractorImages.length > 0 ? distractorImages : [item.imageUrl];

        const timeout = setTimeout(() => {
            if (speed > 350) {
                setCurrentImage(item.imageUrl);
                setBlurAmount(0);
                setTimeout(() => {
                    setIsAnimating(false);
                    onAnimationComplete?.();
                }, 600);
                return;
            }

            const nextIndex = (imageIndex + 1) % images.length;
            setCurrentImage(images[nextIndex]);
            setImageIndex(nextIndex);
            setSpeed(prev => prev * 1.12);
            setBlurAmount(prev => Math.max(0, prev - 0.5));
        }, speed);

        return () => clearTimeout(timeout);
    }, [isAnimating, hasStarted, speed, imageIndex, distractorImages, item.imageUrl, onAnimationComplete]);

    if (!hasStarted) {
        return null; // Don't render until animation starts
    }

    const imageSize = isMain ? "w-20 h-20" : "w-10 h-10";
    const titleClass = isMain ? "title-big text-[var(--accent-900)]" : "title-med text-[var(--accent-900)]";
    const descriptionClass = isMain ? "para-big" : "para";

    return (
        <motion.div
            className="flex flex-col items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            {/* Image Container */}
            <div
                className="relative flex items-center justify-center"
                style={{ minHeight: isMain ? '100px' : '60px' }}
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
                            alt={isAnimating ? "Tirage en cours..." : item.name}
                            className={`${imageSize} object-contain transition-[filter] duration-200 ${!isAnimating ? 'effect-glow-yellow' : ''} ${item.isReversed && !isAnimating ? 'rotate-180' : ''}`}
                            style={isAnimating ? { filter: `blur(${blurAmount}px)` } : undefined}
                        />

                        {/* Reversed indicator */}
                        {item.isReversed && !isAnimating && (
                            <div className={`absolute ${isMain ? '-top-1 -right-3' : '-top-0.5 -right-2'}`}>
                                <svg
                                    width={isMain ? "24" : "16"}
                                    height={isMain ? "24" : "16"}
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

                        {/* Animated glow during animation */}
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
                        className="flex flex-col items-center gap-1 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <motion.h3
                            className={isMain ? "title-med text-[var(--text-primary)]" : "para text-[var(--text-primary)]"}
                            animate={{ opacity: [0.6, 1, 0.6] }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            Connexion aux énergies...
                        </motion.h3>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Final Content: Name & Description */}
            <AnimatePresence>
                {!isAnimating && (
                    <motion.div
                        className="flex flex-col gap-2 items-center w-full"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                    >
                        <h2 className={`${titleClass} text-center`}>
                            {item.isReversed ? `${item.name} (renversée)` : item.name}
                        </h2>
                        <p className={`${descriptionClass} text-[var(--text-primary)] text-center leading-relaxed`}>
                            {item.description}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export function ComplexDrawDisplay({
    subtitle,
    items,
    distractorImages,
    shouldAnimate,
    skipFirstAnimation = false,

    // Action Logic
    onComplexDraw,
    btnSecondLabel,
    btnSecondIcon,
    isSecondBtnPremium = true,
    isPremium = false,
    isLoadingComplex = false
}: ComplexDrawDisplayProps) {
    const [currentItemIndex, setCurrentItemIndex] = useState(0);
    const [completedItems, setCompletedItems] = useState<number[]>([]);

    // If skipping animation, we assume main item is complete
    useEffect(() => {
        if (skipFirstAnimation && !completedItems.includes(0)) {
            setCompletedItems(prev => prev.includes(0) ? prev : [...prev, 0]);
        }
    }, [skipFirstAnimation, completedItems]);

    const handleItemAnimationComplete = (index: number) => {
        setCompletedItems(prev => [...prev, index]);
        // Start next item animation
        if (index < items.length - 1) {
            setCurrentItemIndex(index + 1);
        }
    };

    // Calculate animation delays based on completion
    const getAnimationDelay = (index: number) => {
        if (!shouldAnimate) return 0;
        // If skipping first animation, reduce delay for subsequent items
        const baseDelay = skipFirstAnimation ? 500 : 3500; // Start sooner if first is already shown
        return skipFirstAnimation
            ? (index - 1) * 3500 + baseDelay  // First additional item starts quickly
            : index * 3500; // Standard staggered delay
    };

    const mainItem = items[0];
    const additionalItems = items.slice(1);

    // Logic for button
    const showComplexButton = additionalItems.length === 0 && !!onComplexDraw && !!btnSecondLabel;
    const isSecondLocked = !isPremium && isSecondBtnPremium;

    // We only show the button when the main item animation is complete (or skipped)
    const isMainDisplayComplete = completedItems.includes(0) || skipFirstAnimation || !shouldAnimate;

    return (
        <div id="complex-draw-wrapper" className="w-full">
            <div id="complex-draw-card" className="card-gradient">
                {/* Subtitle */}
                <p className="title-med text-[var(--accent-500)] text-center mb-6">
                    {subtitle || "Ton tirage complet"}
                </p>

                {/* Main Item (first draw) */}
                {mainItem && (
                    <SingleItemDisplay
                        item={mainItem}
                        distractorImages={distractorImages}
                        shouldAnimate={shouldAnimate && !skipFirstAnimation}
                        isMain={true}
                        animationDelay={0}
                        onAnimationComplete={() => handleItemAnimationComplete(0)}
                    />
                )}

                {/* Complex Draw Button (Visible only if simple draw context) */}
                <AnimatePresence>
                    {showComplexButton && isMainDisplayComplete && (
                        <motion.div
                            className="mt-6 flex flex-col items-center gap-4 w-full"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            <Button
                                variant={isSecondLocked ? "secondary" : "primary"}
                                onClick={isSecondLocked ? undefined : onComplexDraw}
                                disabled={isSecondLocked || isLoadingComplex}
                                icon={
                                    isLoadingComplex ? (
                                        <Loader className="h-5 w-auto" />
                                    ) : isSecondLocked ? (
                                        <Icon icon="mingcute:lock-fill" width={16} height={16} />
                                    ) : btnSecondIcon ? (
                                        <Icon icon={btnSecondIcon} width={20} height={20} />
                                    ) : undefined
                                }
                            >
                                {isLoadingComplex ? "Tirage en cours..." : btnSecondLabel}
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Separator - Visible only if we have additional items */}
                {additionalItems.length > 0 && (
                    <motion.div
                        className="w-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="w-full h-px bg-[var(--text-tertiary)] opacity-30 my-6" />
                    </motion.div>
                )}

                {/* Additional Items (compact) */}
                <div className="flex flex-col gap-6">
                    {additionalItems.map((item, index) => (
                        <SingleItemDisplay
                            key={`${item.id}-${index}`}
                            item={item}
                            distractorImages={distractorImages}
                            shouldAnimate={shouldAnimate}
                            isMain={false}
                            animationDelay={getAnimationDelay(index + 1)}
                            onAnimationComplete={() => handleItemAnimationComplete(index + 1)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
