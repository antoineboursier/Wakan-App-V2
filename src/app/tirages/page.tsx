"use client";

import { useRouter } from "next/navigation";
import { PageBackground } from "@/components/layout/PageBackground";
import { DrawIntroCard } from "@/components/draws/DrawIntroCard";
import { DrawResultCardSimple } from "@/components/draws/DrawResultCardSimple";
import { DrawResultCardComplex } from "@/components/draws/DrawResultCardComplex";
import { useEntitlements } from "@/hooks/useEntitlements";
import { useDailyFreeLimit } from "@/hooks/useDailyFreeLimit";
import { WakanLogo } from "@/components/ui/WakanLogo";

export default function TiragesListPage() {
    const router = useRouter();

    // Mock hooks/logic for the "Functional" card (Intro)
    const slug = "rune";
    const { isPremium } = useEntitlements();
    const { canDrawFree, loadinglimit } = useDailyFreeLimit(slug);

    const title = "Ta rune du jour";
    const subtitle = "Découvre la prédiction unique des runes scandinaves.";

    const handleDrawOne = () => {
        router.push(`/tirages/${slug}/result?count=1`);
    };

    const handleDrawThree = () => {
        if (isPremium) {
            router.push(`/tirages/${slug}/result?count=3`);
        } else {
            alert("Réservé aux membres Premium !");
        }
    };

    // Mock Data for "Already Drawn" states
    const mockSingleDraw = {
        slug: "fehu",
        name: "Fehu",
        description: "Abondance, richesse mobile, nouveau départ, énergie créatrice. Fehu est le feu primordial, la force de devenir."
    };

    const mockThreeDraw = [
        { slug: "uruz", name: "Uruz", description: "Force vitale, santé, persévérance. Le pouvoir de la formation et de la manifestation." },
        { slug: "thurisaz", name: "Thurisaz", description: "Force réactive, protection, conflit. Le géant, l'épine, la porte." },
        { slug: "ansuz", name: "Ansuz", description: "Communication, inspiration divine, sagesse. Le souffle d'Odin." }
    ];

    return (
        <div className="min-h-screen relative font-body flex flex-col overflow-y-auto">
            <PageBackground imageSrc="/backgrounds/journal.png" alt="Bibliothèque mystique" />

            <div className="relative z-10 flex-1 flex flex-col items-center gap-6 p-4 pb-8 max-w-lg mx-auto w-full">

                {/* État 1 : Intro (Défaut) */}
                <div className="w-full">
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

                {/* État 2 : Résultat Simple (Déjà tiré) */}
                <div className="w-full">
                    <DrawResultCardSimple
                        item={mockSingleDraw}
                        isPremium={isPremium}
                        onGoDeeper={() => alert("Upgrade to Premium")}
                    />
                </div>

                {/* État 3 : Résultat Complexe (Déjà tiré) */}
                <div className="w-full">
                    <DrawResultCardComplex
                        items={mockThreeDraw}
                        globalDescription="Ton passé, présent et futur s'alignent vers une transformation majeure. Les signes sont clairs : le changement est inévitable mais positif."
                        onReset={() => { }}
                    />
                </div>

            </div>
        </div>
    );
}
