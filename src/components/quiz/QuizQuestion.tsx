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


            {/* Main Content Scrollable Area */}
            <div className="flex-1 w-full overflow-y-auto">
                <div className="min-h-full flex flex-col items-center p-4 pt-4 pb-20 justify-start">

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
                                            <span className={`font-bold mr-2 ${isSelected ? "text-[var(--accent-500)]" : "text-[var(--text-primary)]"}`}>
                                                {getPrefix(idx)}
                                            </span>
                                            <span className={`font-bold para-big leading-snug ${isSelected ? "text-[var(--background-900)]" : "text-[var(--text-primary)]"}`}>
                                                {answer.answer_text}
                                            </span>
                                        </Button>
                                    </motion.div>
                                );
                            })}
                        </div>

                    </div>

                </div>
            </div>
        </motion.div>
    );
}
