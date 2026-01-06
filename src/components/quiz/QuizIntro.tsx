"use client";

import { Quiz, QuizProfile } from "@/types/quiz";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { BackButton } from "../ui/BackButton";
import { Button } from "../ui/Button";
import { QuizResultSummary } from "./QuizResultSummary";

interface QuizIntroProps {
    quiz: Quiz;
    questionCount: number;
    onStart: () => void;
    onClose: () => void;
    lastResult?: QuizProfile;
    onOpenResult?: () => void;
}

export function QuizIntro({ quiz, questionCount, onStart, onClose, lastResult, onOpenResult }: QuizIntroProps) {
    const description = quiz.long_description || quiz.description;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col h-full relative"
        >
            {/* Top Bar: Retour */}
            <div className="w-full p-6 z-20 flex justify-start">
                <BackButton onClick={onClose} label="Retour" />
            </div>

            {/* Main Content */}
            <div className="flex-1 w-full overflow-y-auto">
                <div className="min-h-full flex flex-col items-center p-4 pt-0 pb-20">

                    {/* Card Container */}
                    <div
                        className="w-full max-w-md mx-auto flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-500"
                        style={{
                            borderRadius: lastResult ? "8px 8px 0 0" : "var(--sizes-s, 8px)",
                            background: "linear-gradient(180deg, rgba(24, 39, 46, 0.30) 0%, rgba(24, 39, 46, 0.60) 50%, rgba(24, 39, 46, 0.90) 100%)",
                            display: "flex",
                            padding: "var(--sizes-l, 24px)",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "var(--sizes-l, 24px)",
                            alignSelf: "stretch"
                        }}
                    >

                        {/* Image Header */}
                        {quiz.image_url ? (
                            <img
                                src={quiz.image_url}
                                alt={quiz.title}
                                style={{
                                    height: "160px",
                                    alignSelf: "stretch",
                                    objectFit: "cover",
                                    borderRadius: "4px"
                                }}
                            />
                        ) : (
                            <div
                                style={{
                                    height: "160px",
                                    alignSelf: "stretch",
                                    background: "rgba(255,255,255,0.05)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                            >
                                <Icon icon="mdi:image-filter-hdr" className="w-12 h-12 text-slate-700" />
                            </div>
                        )}

                        {/* Title */}
                        <h1
                            className="font-display"
                            style={{
                                color: "var(--accent-900, #F6AE31)",
                                textAlign: "center",
                                textShadow: "0px 4px 8px var(--background-800, #1C3039)",
                                fontFamily: "Skranji",
                                fontSize: "32px",
                                fontStyle: "normal",
                                fontWeight: 400,
                                lineHeight: "100%",
                                margin: 0
                            }}
                        >
                            {quiz.title}
                        </h1>

                        {/* Description */}
                        <div
                            className="para-big"
                            style={{
                                color: "var(--text-primary)",
                                textAlign: "center"
                            }}
                        >
                            {description || "Prêt à découvrir ce que ce quiz Révèle sur vous ?"}
                        </div>

                        {/* Stats */}
                        <div
                            className="title-med"
                            style={{
                                color: "var(--accent-900)",
                                textAlign: "center"
                            }}
                        >
                            {questionCount} questions
                        </div>

                        {/* CTA Button */}
                        <div className="w-full pt-2 flex justify-center">
                            <Button
                                onClick={onStart}
                                variant="primary"
                                className="justify-center"
                                icon={<Icon icon="fa:arrow-right" className="text-current text-xl" />}
                            >
                                {lastResult ? "Recommencer le quiz" : "Démarrer le quiz"}
                            </Button>
                        </div>
                    </div>

                    {/* Result Summary (Attached Below) */}
                    {lastResult && onOpenResult && (
                        <QuizResultSummary
                            profile={lastResult}
                            quizTitle={quiz.short_title || quiz.title}
                            onClick={onOpenResult}
                        />
                    )}
                </div>
            </div>
        </motion.div>
    );
}
