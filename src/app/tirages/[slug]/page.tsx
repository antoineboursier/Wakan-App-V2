"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { PageBackground } from "@/components/layout/PageBackground";
import { DrawIntroCard } from "@/components/draws/DrawIntroCard";
import { useEntitlements } from "@/hooks/useEntitlements";
import { useDailyFreeLimit } from "@/hooks/useDailyFreeLimit";
import { Icon } from "@iconify/react";
import Link from "next/link";

export default function DrawIntroPage({ params }: { params: Promise<{ slug: string }> }) {
    const router = useRouter();
    // Unwrap params using React.use()
    const { slug } = use(params);

    const { isPremium } = useEntitlements();
    const { canDrawFree, loadinglimit } = useDailyFreeLimit(slug);

    const title = slug === "rune" ? "Ta rune du jour" : "Tirage Mystère";
    const subtitle = slug === "rune"
        ? "Découvre la prédiction unique des runes scandinaves."
        : "Laisse l'univers te guider.";

    const handleDrawOne = () => {
        // Naviguer vers résultat 1
        router.push(`/tirages/${slug}/result?count=1`);
    };

    const handleDrawThree = () => {
        // Naviguer vers résultat 3 (Premium only logic is in Card but double check here if needed)
        if (isPremium) {
            router.push(`/tirages/${slug}/result?count=3`);
        } else {
            // Show premium modal (TODO)
            alert("Réservé aux membres Premium ! (Ce sera une jolie modal plus tard)");
        }
    };

    return (
        <div className="min-h-screen relative font-body flex flex-col">
            <PageBackground imageSrc="/backgrounds/journal.png" alt="Ambiance mystique" />

            {/* Header Retour Simple */}
            <header className="relative z-20 pt-6 pl-4">
                <Link href="/tirages" className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                    <Icon icon="ph:arrow-left" width="20" height="20" />
                    <span className="para-lit">Retour</span>
                </Link>
            </header>

            <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 pb-24 max-w-lg mx-auto w-full">
                <DrawIntroCard
                    title={title}
                    subtitle={subtitle}
                    onDrawOne={handleDrawOne}
                    onDrawThree={handleDrawThree}
                    canDrawFree={canDrawFree}
                    isPremium={isPremium}
                    isLoading={loadinglimit}
                />
            </div>
        </div>
    );
}
