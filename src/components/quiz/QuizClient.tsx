"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Quiz, QuizQuestion } from "@/types/quiz";
import { calculateQuizResult } from "@/app/actions/quiz-public";
import { QuizIntro } from "./QuizIntro";
import { QuizQuestion as QuizQuestionScreen } from "./QuizQuestion";
import { Loader } from "../ui/Loader";
import { QuizResult } from "./QuizResult";
import { AnimatePresence, motion } from "framer-motion";
import { FullscreenModal } from "../ui/FullscreenModal";

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
    const [result, setResult] = useState<any | null>(null);

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
            setTimeout(() => {
                setCurrentQuestionIndex(prev => prev + 1);
            }, 250);
        } else {
            // Finish
            setStep('calculating');
            try {
                const answerIds = Object.values(newAnswers);
                const calculatedResult = await calculateQuizResult(quiz.id, answerIds);
                setResult(calculatedResult);

                if (calculatedResult) {
                    const { saveQuizResult } = await import('@/utils/quizStorage');
                    saveQuizResult(quiz.id, quiz.slug, calculatedResult);
                }
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
        } else {
            // Back to intro if on first question?
            setStep('intro');
        }
    };

    const handleExit = () => {
        router.push('/quiz');
    };

    const handleOpenResult = () => {
        setStep('result');
    };

    const handleCloseResult = () => {
        setStep('intro');
    };

    // Determine Modal Props based on step
    const isResult = step === 'result';
    const isPlaying = step === 'playing';

    // Back action: 
    // - playing: prev question (or back to intro)
    // - result: back to summary (intro)
    // - intro: none (or exit?) - usually intro has Close button
    const onBackAction = isPlaying ? handlePrev : (isResult ? handleCloseResult : undefined);
    const showBack = isPlaying || isResult;

    return (
        <FullscreenModal
            isOpen={true}
            backgroundImageUrl={quiz.background_image_url}

            // Header Actions
            onClose={handleExit} // Always allow closing via X
            onBack={onBackAction}
            showBack={showBack}
            backLabel={isResult ? "Retour" : "Précédent"}

            // Share (only on result)
            showShare={isResult}
            shareTitle={isResult && result ? `Mon résultat : ${result.primary.name}` : undefined}
            shareText={isResult && result ? (result.primary.description_result || `J'ai obtenu ${result.primary.name}`) : undefined}

            contentClassName="flex flex-col"
        >
            <AnimatePresence mode="wait">

                {step === 'intro' && (
                    <QuizIntro
                        key="intro"
                        quiz={quiz}
                        questionCount={questions.length}
                        onStart={handleStart}
                        onClose={handleExit}
                        lastResult={result?.primary}
                        onOpenResult={handleOpenResult}
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
                        className="flex flex-col items-center justify-center h-full space-y-4 flex-1"
                    >
                        <Loader className="scale-125 mb-4" />
                        <p className="text-[var(--text-secondary)] animate-pulse para-big tracking-widest uppercase">Calcul de votre profil...</p>
                    </motion.div>
                )}

                {step === 'result' && result && (
                    <QuizResult
                        key="result"
                        profile={result.primary}
                        secondaryProfiles={result.secondary}
                        resultSubtitle={quiz.short_title || quiz.title}
                        onExit={handleExit}
                        onBack={handleCloseResult}
                        hideExitButton={true} // Already in modal header
                    />
                )}

            </AnimatePresence>
        </FullscreenModal>
    );
}
