"use client";

import { use, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageBackground } from "@/components/layout/PageBackground";
import { DrawAnimation } from "@/components/draws/DrawAnimation";
import { DrawResultCardSimple } from "@/components/draws/DrawResultCardSimple";
import { useEntitlements } from "@/hooks/useEntitlements";
import { useDailyFreeLimit } from "@/hooks/useDailyFreeLimit";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { GlassCard } from "@/components/ui/GlassCard";

export default function DrawResultPage({ params }: { params: Promise<{ slug: string }> }) {
    const router = useRouter();
    const { slug } = use(params);
    const searchParams = useSearchParams();
    const count = parseInt(searchParams.get("count") || "1", 10);

    const { isPremium } = useEntitlements();
    const { consumeFreeDraw, canDrawFree } = useDailyFreeLimit(slug);

    const [step, setStep] = useState<"anim" | "result">("anim");
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    // Lancer le fetch au montage
    useEffect(() => {
        // Si pas le droit et pas premium, redirect (sauf si on vient de tirer, mais hook logique a revoir)
        // Ici on assume que si on est là, on a cliqué le bouton. On vérifie la logique.

        // Fetch data
        const fetchData = async () => {
            try {
                const res = await fetch(`/api/draws/${slug}?count=${count}`);
                if (!res.ok) throw new Error("Erreur tirage");
                const json = await res.json();
                setData(json);

                // Consommer le tirage gratuit si user non premium et tirage simple
                // ATTENTION : en React Strict Mode (dev), useEffect peut tourner 2 fois.
                // consumeFreeDraw utilise localStorage, c'est synchrone.
                if (!isPremium && count === 1) {
                    consumeFreeDraw();
                }

            } catch (err) {
                console.error(err);
                setError("Impossible de lire les runes...");
                setStep("result"); // Passer direct à l'écran d'erreur
            }
        };

        fetchData();
    }, [slug, count, isPremium]);

    const handleAnimComplete = () => {
        if (data || error) {
            setStep("result");
        } else {
            // Si animation finie mais pas encore de data (connexion lente), on attend
            // (En V1 simple, on laisse le loading state ou on boucle l'anim)
            // Ici DrawAnimation appelle onComplete une seule fois.
            // On ajoutera un petit listener sur data
        }
    };

    // Petit hack si data arrive après l'anim
    useEffect(() => {
        // Si l'anim est finie (step=result ? non on veut déclencher le changement quand les 2 sont prêts)
        // DrawAnimation gère sa durée. onComplete est appelé à la fin de la durée.
    }, [data]);

    return (
        <div className="min-h-screen relative font-body flex flex-col">
            <PageBackground imageSrc="/backgrounds/journal.png" />

            {/* Header (caché pendant anim pour immersion ?) -> visible sur screen résultat */}
            {step === "result" && (
                <header className="relative z-20 pt-6 pl-4 flex justify-between pr-4 items-center">
                    <Link href={`/tirages/${slug}`} className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                        <Icon icon="ph:arrow-left" width="20" height="20" />
                        <span className="para-lit">Retour</span>
                    </Link>
                </header>
            )}

            <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 pb-12">

                {step === "anim" && (
                    <DrawAnimation onComplete={handleAnimComplete} />
                )}

                {step === "result" && error && (
                    <div className="text-center p-8 bg-red-900/50 rounded-xl border border-red-500 text-white">
                        <p>{error}</p>
                        <button onClick={() => router.back()} className="mt-4 underline">Retour</button>
                    </div>
                )}

                {step === "result" && data && !error && (
                    <>
                        {count === 1 ? (
                            <DrawResultCardSimple
                                item={data.item}
                                isPremium={isPremium}
                                onGoDeeper={() => {
                                    if (isPremium) {
                                        // Reload with count=3 -> ATTENTION, ça relancerait tout le process (fetch random).
                                        // Idéalement "Approfondir" garde la 1ere rune et en tire 2 autres.
                                        // V1 simple : on relance un tirage complet de 3.
                                        router.push(`/tirages/${slug}/result?count=3`);
                                    } else {
                                        alert("Premium requis !");
                                    }
                                }}
                            />
                        ) : (
                            /* RESULTAT 3 RUNES (Placeholder V1 simple) */
                            <GlassCard className="max-w-md w-full p-6 text-center">
                                <h2 className="title-med mb-4">Passé, Présent, Futur</h2>
                                <div className="flex flex-col gap-4">
                                    {data.items?.map((it: any, idx: number) => (
                                        <div key={it.id || idx} className="bg-black/20 p-3 rounded-lg flex items-center gap-4 text-left">
                                            <div className="w-10 h-10 bg-[var(--accent-900)] rounded-full flex items-center justify-center font-bold text-[var(--background-900)]">
                                                {it.slug?.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="font-heading text-[var(--accent-500)]">{it.name}</h3>
                                                <p className="text-xs text-[var(--text-secondary)] line-clamp-2">{it.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <p className="mt-6 text-sm italic opacity-70">
                                    Interprétation complète bientôt disponible...
                                </p>
                            </GlassCard>
                        )}
                    </>
                )}

            </div>
        </div>
    );
}
