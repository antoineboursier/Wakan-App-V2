"use client";

import { useRouter } from "next/navigation";
import { DrawIntroCard } from "@/components/draws/DrawIntroCard";
import { useEntitlements } from "@/hooks/useEntitlements";

interface QuizCardWrapperProps {
    slug: string;
    title: string;
    subtitle: string;
    imageUrl?: string | null;
    isPremium?: boolean;
    publishedAt?: string | null;
    btnLabel?: string | null;
    btnIcon?: string | null;
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
}: QuizCardWrapperProps) {
    const router = useRouter();
    const { isPremium } = useEntitlements();

    // Check if new (published within 30 days)
    const isNew = publishedAt ? (new Date().getTime() - new Date(publishedAt).getTime()) < (30 * 24 * 60 * 60 * 1000) : false;

    const handleStartQuiz = () => {
        if (isQuizPremium && !isPremium) {
            alert("Ce quiz est réservé aux membres Premium !");
            return;
        }
        router.push(`/quiz/${slug}`);
    };

    return (
        <DrawIntroCard
            title={title}
            subtitle={subtitle}
            imageUrl={imageUrl ?? undefined}

            // Custom Style for Quiz Card
            className="rounded-[8px] border-[1px] border-[#969491] bg-[#18272E] backdrop-blur-[2px]"

            // Badge
            badge={isNew && (
                <div className="flex px-2 py-2 items-center justify-center gap-2 absolute right-2 top-2 rounded-[8px] bg-[rgba(28,45,57,0.70)] backdrop-blur-[2px] z-10">
                    <span className="para text-[var(--text-primary)] font-bold">Nouveau</span>
                    <div className="w-2 h-2 rounded-full bg-[var(--accent-900)]"></div>
                </div>
            )}

            // Main Button (Configurable)
            btnMainLabel={btnLabel || "Commencer le quiz"}
            btnMainIcon={btnIcon || "mdi:play-circle-outline"}
            onDrawOne={handleStartQuiz}
            isPremium={isPremium}
            isMainPremium={isQuizPremium}

            // Disable secondary button and limits
            onDrawThree={() => { }}
            btnSecondEnabled={false}
            btnMainLimitEnabled={false}
            canDrawFree={true} // Always allow unless premium locked
            remainingDraws={0} // Not used when limit disabled
            premiumText={null}
        />
    );
}
