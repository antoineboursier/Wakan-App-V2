"use client";

import { QuizQuestion as IQuizQuestion } from "@/types/quiz";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { Button } from "../ui/Button";
import { BackButton } from "../ui/BackButton";

interface QuizQuestionProps {
    question: IQuizQuestion;
    currentIndex: number;
    totalCount: number;
    quizTitle: string;
    quizImage?: string | null;
    onSelectAnswer: (answerId: string) => void;
    onPrev: () => void;
    onQuit: () => void;
    selectedAnswerId?: string;
}

export function QuizQuestion({ question, currentIndex, totalCount, quizTitle, quizImage, onSelectAnswer, onPrev, onQuit, selectedAnswerId }: QuizQuestionProps) {
    const progress = ((currentIndex + 1) / totalCount) * 100;

    // Helper to get letter prefix (A, B, C...)
    const getPrefix = (idx: number) => String.fromCharCode(65 + idx) + ".";

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col h-full relative"
        >
            {/* Top Bar: Close Button */}
            <div className="absolute top-0 right-0 w-full p-6 z-20 flex justify-end">
                <BackButton
                    onClick={onQuit}
                    label="Quitter le quiz"
                    variant="close"
                    className="flex-row-reverse para-lit"
                />
            </div>

            {/* Main Content Scrollable Area */}
            <div className="flex-1 w-full overflow-y-auto">
                <div className="min-h-full flex flex-col items-center p-4 pt-16 pb-20 justify-center">

                    {/* Styled Card Container */}
                    <div className="w-full max-w-lg mx-auto flex flex-col items-center gap-[24px] rounded-[8px] p-[24px]"
                        style={{
                            background: "linear-gradient(180deg, rgba(24, 39, 46, 0.30) 0%, rgba(24, 39, 46, 0.60) 50%, rgba(24, 39, 46, 0.90) 100%)",
                            alignSelf: "stretch"
                        }}
                    >

                        {/* Header Section (Image + Title + Progress) */}
                        <div className="flex items-center gap-[24px] self-stretch">
                            {/* Thumbnail */}
                            <div className="w-[80px] h-[80px] shrink-0 rounded-[4px] overflow-hidden shadow-lg border border-white-mix">
                                {quizImage ? (
                                    <img src={quizImage} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                                        <Icon icon="mdi:image-filter-hdr" className="text-slate-600" />
                                    </div>
                                )}
                            </div>

                            {/* Meta info & Progress */}
                            <div className="flex-1 flex flex-col justify-center space-y-2">
                                <div>
                                    <p className="para-lit font-medium pb-1" style={{ color: "var(--text-secondary)" }}>{quizTitle}</p>
                                    <p className="para-big uppercase tracking-wide font-bold" style={{ color: "var(--text-primary)" }}>
                                        QUESTION {currentIndex + 1} SUR {totalCount}
                                    </p>
                                </div>
                                {/* Progress Bar */}
                                <div className="w-full h-[4px] rounded-[8px] overflow-hidden" style={{ background: "var(--background-700)" }}>
                                    <motion.div
                                        className="h-full rounded-[8px] shadow-[0_0_8px_var(--accent-500)]"
                                        style={{ background: "var(--accent-900)" }}
                                        initial={{ width: `${((currentIndex) / totalCount) * 100}%` }}
                                        animate={{ width: `${progress}%` }}
                                        transition={{ duration: 0.5, ease: "easeInOut" }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Question Text */}
                        <div className="min-h-[80px] flex items-center justify-center py-2 w-full">
                            <AnimatePresence mode="wait">
                                <motion.h2
                                    key={question.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="title-med text-center drop-shadow-sm w-full"
                                    style={{ color: "var(--accent-900)" }}
                                >
                                    {question.question_text}
                                </motion.h2>
                            </AnimatePresence>
                        </div>

                        {/* Answers List */}
                        <div className="w-full space-y-3">
                            {question.answers?.map((answer, idx) => {
                                const isSelected = selectedAnswerId === answer.id;
                                return (
                                    <motion.div
                                        key={answer.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 * idx }}
                                    >
                                        <Button
                                            variant={isSelected ? "primary" : "secondary"}
                                            onClick={() => onSelectAnswer(answer.id)}
                                            className={`w-full !justify-start !text-left !px-4 !py-4 h-auto ${isSelected ? '' : '!bg-transparent'}`}
                                        >
                                            <span className={`font-bold mr-2 ${isSelected ? "text-[db2777]" : "text-white"}`}>
                                                {getPrefix(idx)}
                                            </span>
                                            <span className={`font-bold text-lg leading-snug ${isSelected ? "text-[#1C3039]" : "text-white"}`}>
                                                {answer.answer_text}
                                            </span>
                                        </Button>
                                    </motion.div>
                                );
                            })}
                        </div>
                        {/* Bottom Navigation (Prev) */}
                        <div className="h-12 w-full flex items-center justify-center mt-6">
                            {currentIndex > 0 && (
                                <Button
                                    variant="secondary"
                                    onClick={onPrev}
                                    icon={
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 order-first text-current">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M12.7381 7.82912C13.2358 7.52036 13.3672 6.89884 13.0316 6.44093C12.696 5.98302 12.0204 5.86211 11.5227 6.17087L4.47422 10.5433C3.61086 11.0789 3.50703 12.2117 4.26072 12.8727L9.79173 17.7238C10.2262 18.1049 10.9143 18.0898 11.3285 17.69C11.7427 17.2903 11.7263 16.6573 11.2918 16.2762L7.55638 13L18.6521 13C19.2524 13 19.7391 12.5523 19.7391 12C19.7391 11.4477 19.2524 11 18.6521 11L7.62654 11L12.7381 7.82912Z" fill="currentColor" />
                                        </svg>
                                    }
                                    className="!bg-transparent !border-0 para-lit !shadow-none hover:bg-transparent hover:!transform-none !flex-row-reverse"
                                    style={{ color: "var(--text-secondary)" }}
                                >
                                    Question précédente
                                </Button>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </motion.div>
    );
}
