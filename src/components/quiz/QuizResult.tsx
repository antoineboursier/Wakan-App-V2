"use client";

import { QuizProfile } from "@/types/quiz";
import { motion } from "framer-motion";
import { BackButton } from "../ui/BackButton";
import { Button } from "../ui/Button";
import { Icon } from "@iconify/react";
import { ShareButton } from "../ui/ShareButton";

interface QuizResultProps {
    profile: QuizProfile;
    resultSubtitle: string;
    onExit: () => void;
}

export function QuizResult({ profile, resultSubtitle, onExit }: QuizResultProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col h-full relative"
        >
            {/* Header: Retour & Partager */}
            <div className="w-full p-6 z-20 flex justify-between items-center">
                <BackButton onClick={onExit} label="Retour" />

                <ShareButton
                    title={`Mon résultat : ${profile.name}`}
                    text={profile.description_result || `J'ai obtenu le profil ${profile.name} !`}
                />
            </div>

            {/* Main Content */}
            <div className="flex-1 w-full overflow-y-auto">
                <div className="min-h-full flex flex-col items-center p-4 pt-0 pb-20 justify-center">

                    {/* Card Container - Matching QuizIntro style */}
                    <div
                        className="w-full max-w-md mx-auto flex flex-col items-center text-center gap-[24px] p-[24px]"
                        style={{
                            borderRadius: "var(--sizes-s, 8px)",
                            background: "linear-gradient(180deg, rgba(24, 39, 46, 0.30) 0%, rgba(24, 39, 46, 0.60) 50%, rgba(24, 39, 46, 0.90) 100%)",
                            // No border
                        }}
                    >

                        {/* Short Title */}
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="para-big"
                            style={{ color: "var(--text-disabled)" }}
                        >
                            {resultSubtitle}
                        </motion.p>

                        {/* Image */}
                        {profile.image_url ? (
                            <motion.img
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                src={profile.image_url}
                                alt={profile.name}
                                style={{
                                    width: "160px",
                                    height: "160px",
                                    objectFit: "cover",
                                    borderRadius: "8px", // Intro uses 4px but let's see. Intro uses 4px. User asked 160x160.
                                }}
                            />
                        ) : (
                            <div className="w-[160px] h-[160px] bg-white/5 flex items-center justify-center rounded-[8px]">
                                <Icon icon="mdi:account" className="w-12 h-12 text-white/20" />
                            </div>
                        )}

                        {/* Profile Name */}
                        <motion.h1
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="title-big"
                            style={{ color: "var(--accent-900)" }}
                        >
                            {profile.name}
                        </motion.h1>

                        {/* Description */}
                        <motion.p
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="para-big leading-relaxed"
                            style={{ color: "var(--text-primary)" }}
                        >
                            {profile.description_result || "Un profil mystérieux..."}
                        </motion.p>

                        {/* Return Button */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="w-full pt-4 flex justify-center"
                        >
                            <Button
                                variant="primary"
                                onClick={onExit}
                                icon={<Icon icon="material-symbols:quiz" width={24} />}
                                className="justify-center"
                            >
                                Retour aux quizs
                            </Button>
                        </motion.div>

                    </div>
                </div>
            </div>
        </motion.div>
    );
}
