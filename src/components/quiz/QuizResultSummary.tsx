import { QuizProfile } from "@/types/quiz";
import { Icon } from "@iconify/react";
import React from "react";

interface QuizResultSummaryProps {
    profile: QuizProfile;
    quizTitle: string; // "Ta pierre du moment" etc
    onClick: () => void;
}

export function QuizResultSummary({ profile, quizTitle, onClick }: QuizResultSummaryProps) {
    const handleShare = (e: React.MouseEvent) => {
        e.stopPropagation();
        const shareData = {
            title: `Mon résultat : ${profile.name}`,
            text: profile.description_result || `J'ai obtenu le profil ${profile.name} !`,
            url: window.location.href,
        };
        if (navigator.share) {
            navigator.share(shareData).catch((err) => console.log("Share failed", err));
        } else {
            console.warn("Share API not supported");
        }
    };

    return (
        <div
            onClick={onClick}
            className="w-full h-full cursor-pointer flex flex-col items-start hover:brightness-110 transition-all duration-200"
            style={{
                display: "flex",
                padding: "var(--sizes-l, 24px)",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "var(--sizes-m, 16px)",
                alignSelf: "stretch",
                borderRadius: "0 0 var(--sizes-s, 8px) var(--sizes-s, 8px)",
                background: "linear-gradient(90deg, rgba(24, 39, 46, 0.30) 0%, rgba(24, 39, 46, 0.60) 50%, rgba(24, 39, 46, 0.90) 100%)",
                backdropFilter: "blur(2px)",
                WebkitBackdropFilter: "blur(2px)",
                // Small trick to ensure visual connection
                marginTop: "0px"
            }}
        >
            {/* Header Row */}
            <div className="flex w-full justify-between items-center">
                <p className="para-big text-[var(--text-secondary)]">{quizTitle}</p>
                <button
                    onClick={handleShare}
                    className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors p-1 -mr-1"
                >
                    <Icon icon="ri:share-fill" width={24} height={24} />
                </button>
            </div>

            {/* Identity Row */}
            <div className="flex items-center gap-4 w-full">
                {/* Thumbnail */}
                <div className="w-[80px] h-[80px] shrink-0 rounded-[4px] overflow-hidden bg-white/10">
                    {profile.image_url ? (
                        <img src={profile.image_url} alt={profile.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Icon icon="mdi:account" className="w-8 h-8 text-white/20" />
                        </div>
                    )}
                </div>
                {/* Name */}
                <h3
                    className="title-big text-[var(--accent-900)] line-clamp-1 text-left"
                >
                    {profile.name}
                </h3>
            </div>

            {/* Description */}
            <p className="para text-[var(--text-primary)] line-clamp-5 text-left w-full">
                {profile.description_result || "Aucune description."}
            </p>
        </div>
    );
}
