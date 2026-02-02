"use client";

import { QuizProfile } from "@/types/quiz";
import { motion } from "framer-motion";
import { BackButton } from "../ui/BackButton";
import { Button } from "../ui/Button";
import { Icon } from "@iconify/react";
import { ShareButton } from "../ui/ShareButton";

interface QuizResultProps {
    profile: QuizProfile & { score?: number; percentage?: number };
    secondaryProfiles?: (QuizProfile & { score?: number; percentage?: number })[];
    resultSubtitle: string;
    onExit: () => void;
    onBack?: () => void;
    hideExitButton?: boolean;
}

export function QuizResult({ profile, secondaryProfiles, resultSubtitle, onExit, onBack, hideExitButton = false }: QuizResultProps) {
    const hasSecondary = secondaryProfiles && secondaryProfiles.length > 0;

    return (
        <div
            className="flex flex-col h-full relative"
        >
            {/* Main Content */}
            <div className="flex-1 w-full overflow-y-auto">
                <div className="min-h-full flex flex-col items-center p-4 pt-0 pb-20 justify-start">

                    {/* Card Container */}
                    <div
                        className="w-full max-w-md mx-auto flex flex-col items-center text-center p-[24px]"
                        style={{
                            borderRadius: "var(--sizes-s, 8px)",
                            background: "linear-gradient(180deg, rgba(24, 39, 46, 0.30) 0%, rgba(24, 39, 46, 0.60) 50%, rgba(24, 39, 46, 0.90) 100%)",
                            gap: "var(--sizes-xl, 24px)",
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

                        {/* Primary Image & Progress */}
                        <div className="flex flex-col items-center gap-[var(--sizes-s,8px)]">
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
                                        borderRadius: "8px",
                                    }}
                                />
                            ) : (
                                <div className="w-[160px] h-[160px] bg-[var(--background-700)] flex items-center justify-center rounded-[8px]">
                                    <Icon icon="mdi:account" className="w-12 h-12 text-[var(--text-disabled)]" />
                                </div>
                            )}

                            {/* Progress Bar */}
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                                className="w-[160px] h-[4px] rounded-[8px] bg-[var(--background-700)] overflow-hidden"
                            >
                                <div
                                    className="h-full bg-[var(--accent-900)] rounded-[8px] shadow-[0_0_8px_var(--accent-500)]"
                                    style={{ width: `${profile.percentage || 100}%` }}
                                />
                            </motion.div>

                            {/* Percentage (if multiple) or just default 100%? If single mode, percentage is 100 usually. User asked to show it. */}
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="para-big font-bold"
                                style={{ color: "var(--accent-700)" }}
                            >
                                {profile.percentage || 100}%
                            </motion.p>
                        </div>

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

                        {/* Secondary Results Section */}
                        {hasSecondary && (
                            <>
                                <div
                                    className="w-full flex flex-col items-center gap-[var(--sizes-xl,32px)] py-4"
                                    style={{ alignSelf: "stretch" }}
                                >
                                    <p className="para-big" style={{ color: "var(--accent-disabled)" }}>
                                        {secondaryProfiles!.length > 1 ? "Autres correspondances" : "Autre correspondance"}
                                    </p>

                                    <div className="flex flex-col gap-6 w-full">
                                        {secondaryProfiles!.map((p) => (
                                            <div key={p.id} className="flex items-start gap-[var(--sizes-m,16px)] w-full text-left">
                                                {/* Left Block: Image + Bar + % */}
                                                <div className="flex flex-col gap-2 w-[80px] shrink-0">
                                                    <div className="w-[80px] h-[80px] rounded-[4px] overflow-hidden bg-white/5">
                                                        {p.image_url ? (
                                                            <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <Icon icon="mdi:account" className="w-full h-full p-4 text-[var(--text-disabled)]" />
                                                        )}
                                                    </div>
                                                    {/* Bar */}
                                                    <div className="w-full h-[4px] rounded-[8px] bg-[var(--background-700)] overflow-hidden">
                                                        <div
                                                            className="h-full bg-[var(--accent-900)] rounded-[8px] shadow-[0_0_8px_var(--accent-500)]"
                                                            style={{ width: `${p.percentage || 0}%` }}
                                                        />
                                                    </div>
                                                    {/* % */}
                                                    <p className="para font-bold text-center" style={{ color: "var(--accent-700)" }}>
                                                        {p.percentage || 0}%
                                                    </p>
                                                </div>

                                                {/* Right Block: Content */}
                                                <div className="flex-1 flex flex-col gap-1">
                                                    <h3 className="title-lit pb-1" style={{ color: "var(--accent-900)" }}>
                                                        {p.name}
                                                    </h3>
                                                    <p className="para-big" style={{ color: "var(--text-primary)" }}>
                                                        {p.description_result || "Aucune description"}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Return Button */}
                        {!hideExitButton && (
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
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}
