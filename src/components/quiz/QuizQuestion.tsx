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
                    className="flex-row-reverse text-white/60 hover:text-white"
                />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col items-center justify-center p-4 w-full max-w-lg mx-auto">

                {/* Header Section (Image + Title + Progress) */}
                <div className="w-full flex gap-4 items-end mb-8 relative">
                    {/* Thumbnail */}
                    <div className="w-20 h-20 rounded-lg overflow-hidden shadow-lg border border-white/10 shrink-0">
                        {quizImage ? (
                            <img src={quizImage} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                                <Icon icon="mdi:image-filter-hdr" className="text-slate-600" />
                            </div>
                        )}
                    </div>

                    {/* Meta info & Progress */}
                    <div className="flex-1 flex flex-col justify-end space-y-2 pb-1">
                        <div>
                            <p className="text-xs text-slate-400 font-medium">{quizTitle}</p>
                            <h3 className="text-xl font-bold text-white uppercase tracking-wide font-display">
                                QUESTION {currentIndex + 1} SUR {totalCount}
                            </h3>
                        </div>
                        {/* Progress Bar */}
                        <div className="w-full h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full rounded-full"
                                style={{ background: "var(--accent-900)" }}
                                initial={{ width: `${((currentIndex) / totalCount) * 100}%` }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                            />
                        </div>
                    </div>
                </div>

                {/* Question Text */}
                <div className="min-h-[120px] flex items-center justify-center py-4 mb-4">
                    <AnimatePresence mode="wait">
                        <motion.h2
                            key={question.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-center font-display text-2xl md:text-3xl leading-tight drop-shadow-sm"
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
                                    <span className={`font-bold mr-4 ${isSelected ? "text-[db2777]" : "text-white"}`}>
                                        {getPrefix(idx)}
                                    </span>
                                    <span className={`font-medium text-lg leading-snug ${isSelected ? "text-[#1C3039]" : "text-white"}`}>
                                        {answer.answer_text}
                                    </span>
                                </Button>
                            </motion.div>
                        );
                    })}
                </div>

                <div className="h-12 w-full flex items-center justify-center mt-6">
                    {currentIndex > 0 && (
                        <Button
                            variant="secondary"
                            onClick={onPrev}
                            icon={<Icon icon="solar:arrow-left-linear" className="text-current w-5 h-5" />}
                            className="!bg-transparent !border-0 text-slate-400 hover:text-white !shadow-none hover:bg-transparent hover:!transform-none"
                        >
                            Question précédente
                        </Button>
                    )}
                </div>

            </div>
        </motion.div>
    );
}
