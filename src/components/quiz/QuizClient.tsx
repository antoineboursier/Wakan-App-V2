"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Quiz, QuizQuestion, QuizProfile } from "@/types/quiz";
import { calculateQuizResult } from "@/app/actions/quiz-public";
import { QuizIntro } from "./QuizIntro";
import { QuizQuestion as QuizQuestionScreen } from "./QuizQuestion";
import { Loader } from "../ui/Loader";
import { QuizResult } from "./QuizResult";
import { AnimatePresence, motion } from "framer-motion";

interface QuizClientProps {
    quiz: Quiz;
    questions: QuizQuestion[];
}

type StepState = 'intro' | 'playing' | 'calculating' | 'result';

export function QuizClient({ quiz, questions }: QuizClientProps) {
    const router = useRouter();

    // State
    const [step, setStep] = useState<StepState>('intro');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({}); // questionId -> answerId
    const [result, setResult] = useState<QuizProfile | null>(null);

    // Helpers
    const currentQuestion = questions[currentQuestionIndex];
    const totalQuestions = questions.length;

    // Actions
    const handleStart = () => {
        setStep('playing');
        setCurrentQuestionIndex(0);
    };

    const handleAnswerSelect = async (answerId: string) => {
        // Optimistic UI: save answer
        const newAnswers = { ...answers, [currentQuestion.id]: answerId };
        setAnswers(newAnswers);

        // Next Question or Finish
        if (currentQuestionIndex < totalQuestions - 1) {
            // Delay slightly for visual feedback? 
            // Better to update instantly for "snappy" feel, transition handles the rest.
            setTimeout(() => {
                setCurrentQuestionIndex(prev => prev + 1);
            }, 250); // Petit délai pour laisser le temps de voir le click
        } else {
            // Finish
            setStep('calculating');
            try {
                // Extract answer IDs array
                const answerIds = Object.values(newAnswers);
                const calculatedProfile = await calculateQuizResult(quiz.id, answerIds);
                setResult(calculatedProfile);
                setStep('result');
            } catch (e) {
                console.error(e);
                alert("Une erreur est survenue lors du calcul du résultat.");
                handleExit();
            }
        }
    };

    const handlePrev = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const handleExit = () => {
        // Return to hub
        router.push('/quiz');
    };

    return (
        <div className="fixed inset-0 z-[100] bg-slate-950 text-white overflow-hidden font-sans">
            {/* Background Layer */}
            <div className="absolute inset-0 z-0">
                {quiz.background_image_url ? (
                    <img src={quiz.background_image_url} alt="" className="w-full h-full object-cover opacity-30 blur-sm" />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-900 to-black" />
                )}
                <div className="absolute inset-0 bg-black/40" /> {/* Overlay darkening */}
            </div>

            {/* Content Layer */}
            <div className="relative z-10 w-full h-full">
                <AnimatePresence mode="wait">

                    {step === 'intro' && (
                        <QuizIntro
                            key="intro"
                            quiz={quiz}
                            questionCount={questions.length}
                            onStart={handleStart}
                            onClose={handleExit}
                        />
                    )}

                    {step === 'playing' && (
                        <QuizQuestionScreen
                            key={`q-${currentQuestion?.id || 'end'}`}
                            question={currentQuestion}
                            currentIndex={currentQuestionIndex}
                            totalCount={totalQuestions}
                            quizTitle={quiz.title}
                            quizImage={quiz.image_url}
                            onSelectAnswer={handleAnswerSelect}
                            onPrev={handlePrev}
                            onQuit={handleExit}
                            selectedAnswerId={answers[currentQuestion.id]}
                        />
                    )}

                    {step === 'calculating' && (
                        <motion.div
                            key="calc"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center h-full space-y-4"
                        >
                            <Loader className="scale-125 mb-4" />
                            <p className="text-white/70 animate-pulse text-lg tracking-widest uppercase">Calcul de votre profil...</p>
                        </motion.div>
                    )}

                    {step === 'result' && result && (
                        <QuizResult
                            key="res"
                            profile={result}
                            resultSubtitle={quiz.short_title || quiz.title}
                            onExit={handleExit}
                        />
                    )}

                </AnimatePresence>
            </div>
        </div>
    );
}
