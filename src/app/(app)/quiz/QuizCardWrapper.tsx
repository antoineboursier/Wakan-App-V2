"use client";

import { useRouter } from "next/navigation";
import { DrawIntroCard } from "@/components/draws/DrawIntroCard";
import { useEntitlements } from "@/hooks/useEntitlements";
import { QuizResultSummary } from "@/components/quiz/QuizResultSummary";
import { useState, useEffect } from "react";
import { getQuizResult, type StoredQuizResult } from "@/utils/quizStorage";
import { QuizResult } from "@/components/quiz/QuizResult";
import { AnimatePresence, motion } from "framer-motion";
import { FullscreenModal } from "@/components/ui/FullscreenModal";

interface QuizCardWrapperProps {
    slug: string;
    title: string;
    subtitle: string;
    imageUrl?: string | null;
    isPremium?: boolean;
    publishedAt?: string | null;
    btnLabel?: string | null;
    btnIcon?: string | null;
    limitEnabled?: boolean;
    limitCount?: number;
    backgroundImageUrl?: string | null;
}

export function QuizCardWrapper({
    slug,
    title,
    subtitle,
    imageUrl,
    isPremium: isQuizPremium = false,
    publishedAt,
    btnLabel,
    btnIcon,
    limitEnabled = false,
    limitCount = 1,
    backgroundImageUrl,
}: QuizCardWrapperProps) {
    const router = useRouter();
    const { isPremium } = useEntitlements();
    const [quizResult, setQuizResult] = useState<StoredQuizResult | null>(null);
    const [showResultModal, setShowResultModal] = useState(false);

    // Load saved result on mount
    useEffect(() => {
        const result = getQuizResult(slug);
        setQuizResult(result);
    }, [slug]);

    // Check if new (published within 30 days)
    const isNew = publishedAt ? (new Date().getTime() - new Date(publishedAt).getTime()) < (30 * 24 * 60 * 60 * 1000) : false;

    const handleStartQuiz = () => {
        if (isQuizPremium && !isPremium) {
            alert("Ce quiz est réservé aux membres Premium !");
            return;
        }
        router.push(`/quiz/${slug}`);
    };

    const handleOpenResultDetail = () => {
        setShowResultModal(true);
    };

    const handleCloseResultModal = () => {
        setShowResultModal(false);
    };

    return (
        <>
            <div className="relative">
                <DrawIntroCard
                    title={title}
                    subtitle={subtitle}
                    imageUrl={imageUrl ?? undefined}

                    // Custom Style for Quiz Card - adjust border radius if result exists
                    className={`border-[1px] border-[#969491] bg-[#18272E] backdrop-blur-[2px] !h-auto ${quizResult ? 'rounded-t-[8px] rounded-b-none' : 'rounded-[8px]'
                        }`}

                    // Badge
                    badge={isNew && (
                        <div className="flex px-2 py-2 items-center justify-center gap-2 absolute right-2 top-2 rounded-[8px] bg-[rgba(28,45,57,0.70)] backdrop-blur-[2px] z-10">
                            <span className="para text-[var(--text-primary)] font-bold">Nouveau</span>
                            <div className="w-2 h-2 rounded-full bg-[var(--accent-900)]"></div>
                        </div>
                    )}

                    // Main Button - respects premium status and result
                    btnMainLabel={quizResult ? "Recommencer le quiz" : (btnLabel || "Commencer le quiz")}
                    btnMainIcon={quizResult ? "mdi:refresh" : (btnIcon || "mdi:play-circle-outline")}
                    onDrawOne={handleStartQuiz}
                    isPremium={isPremium}
                    isMainPremium={isQuizPremium}

                    // Disable secondary button
                    onDrawThree={() => { }}
                    btnSecondEnabled={false}

                    // Limitations from BO: Use limit_enabled and limit_count
                    // Premium users bypass all limits
                    // Non-premium users follow BO configuration
                    btnMainLimitEnabled={!isPremium && limitEnabled && !!quizResult}
                    canDrawFree={isPremium || !quizResult || !limitEnabled}
                    remainingDraws={quizResult && limitEnabled ? 0 : (limitCount || 1)}
                    btnMainLimitCount={limitCount || 1}
                    premiumText={null}
                />

                {/* Result Summary (Attached Below Card) */}
                {quizResult && (
                    <QuizResultSummary
                        profile={quizResult.primary}
                        quizTitle={title}
                        onClick={handleOpenResultDetail}
                    />
                )}
            </div>

            {/* Result Detail Modal - Exact replica of QuizClient result view */}
            {/* Result Detail Modal - Using FullscreenModal */}
            <FullscreenModal
                isOpen={showResultModal && !!quizResult}
                backgroundImageUrl={backgroundImageUrl}
                onBack={handleCloseResultModal}
                showShare={true}
                shareTitle={`Mon résultat : ${quizResult?.primary.name}`}
                shareText={quizResult?.primary.description_result || `J'ai obtenu le profil ${quizResult?.primary.name} !`}
            >
                {quizResult && (
                    <QuizResult
                        profile={quizResult.primary}
                        secondaryProfiles={quizResult.secondary}
                        resultSubtitle={title}
                        onExit={handleCloseResultModal}
                        onBack={handleCloseResultModal}
                        hideExitButton={true}
                    />
                )}
            </FullscreenModal>
        </>
    );
}
