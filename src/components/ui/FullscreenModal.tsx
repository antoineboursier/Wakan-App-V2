"use client";

import { motion, AnimatePresence } from "framer-motion";
import { BackButton } from "./BackButton";
import { ShareButton } from "./ShareButton";
import { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface FullscreenModalProps {
    /** Background image URL */
    backgroundImageUrl?: string | null;
    /** Whether the modal is open */
    isOpen: boolean;
    /** Callback when back button is clicked */
    onBack?: () => void;
    /** Callback when close button is clicked (shows X icon on right) */
    onClose?: () => void;
    /** Title for share */
    shareTitle?: string;
    /** Text for share */
    shareText?: string;
    /** Whether to show share button */
    showShare?: boolean;
    /** Label for back button */
    backLabel?: string;
    /** Whether to show back button (default true if onBack provided) */
    showBack?: boolean;
    /** Content to display */
    children: ReactNode;
    /** Additional className for content wrapper (scrollable area) */
    contentClassName?: string;
    /** Additional className for the header container */
    headerClassName?: string;
}

export function FullscreenModal({
    backgroundImageUrl,
    isOpen,
    onBack,
    onClose,
    shareTitle,
    shareText,
    showShare = false,
    backLabel = "Retour",
    showBack = true,
    children,
    contentClassName = "",
    headerClassName = ""
}: FullscreenModalProps) {
    // Portal mounting logic (client-side only)
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    // Prevent scrolling on body when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!mounted) return null;

    const modalContent = (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[9999] text-[var(--text-primary)] overflow-hidden font-sans bg-[var(--background-900,#18272E)]"
                    style={{
                        position: 'fixed', // Force fixed
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                    }}
                >
                    {/* Background Image Layer (Opacity 80%) */}
                    {backgroundImageUrl && (
                        <div
                            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                            style={{
                                backgroundImage: `url(${backgroundImageUrl})`,
                                opacity: 0.8
                            }}
                        />
                    )}

                    {/* Gradient Overlay Layer */}
                    <div
                        className="absolute inset-0 z-0"
                        style={{
                            background: 'linear-gradient(90deg, rgba(24, 39, 46, 0.30) 0%, rgba(24, 39, 46, 0.60) 50%, rgba(24, 39, 46, 0.90) 100%)'
                        }}
                    />

                    {/* Content Layer */}
                    <div className="relative z-10 w-full h-full flex flex-col">
                        {/* Header with back, share and close */}
                        <div className={`w-full p-6 z-20 flex justify-between items-center shrink-0 ${headerClassName}`}>
                            {/* Left: Back Button */}

                            <div className="flex-1">
                                {showBack && onBack && (
                                    <BackButton onClick={onBack} label={backLabel} />
                                )}
                            </div>

                            {/* Right: Actions (Share + Close) */}
                            <div className="flex items-center gap-4">
                                {showShare && shareTitle && shareText && (
                                    <ShareButton
                                        title={shareTitle}
                                        text={shareText}
                                    />
                                )}
                                {onClose && (
                                    <BackButton
                                        onClick={onClose}
                                        variant="close"
                                        label=""
                                        className="!w-auto !flex-none"
                                    />
                                )}
                            </div>
                        </div>

                        {/* Scrollable Content */}
                        <div className={`flex-1 w-full overflow-y-auto ${contentClassName}`}>
                            {children}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    // Use portal to render at root level (above everything including tabbar)
    return createPortal(modalContent, document.body);
}
