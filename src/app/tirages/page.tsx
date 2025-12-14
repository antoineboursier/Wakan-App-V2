"use client";

import { ScanEye, Dna, Sparkles, ScrollText, ArrowRight } from "lucide-react";
import Link from "next/link";

const DECKS = [
    {
        id: "tarot-marseille",
        name: "Tarot de Marseille",
        description: "La sagesse ancestrale pour éclairer votre chemin.",
        icon: ScrollText,
        color: "from-purple-900 to-indigo-900",
        accent: "text-indigo-300",
    },
    {
        id: "oracle-wakan",
        name: "L'Oracle Wakan",
        description: "Connectez-vous à l'esprit de la nature et du cosmos.",
        icon: Sparkles,
        color: "from-[var(--accent-900)] to-[var(--rich-pink)]",
        accent: "text-[var(--rich-yellow)]",
    },
    {
        id: "runes",
        name: "Runes Nordiques",
        description: "Les symboles anciens pour des réponses directes.",
        icon: Dna, // Placeholder for Runes
        color: "from-slate-800 to-slate-900",
        accent: "text-cyan-300",
    },
    {
        id: "lenormand",
        name: "Petit Lenormand",
        description: "Une guidance pratique pour le quotidien.",
        icon: ScanEye,
        color: "from-emerald-900 to-teal-900",
        accent: "text-emerald-300",
    },
];

export default function TiragesPage() {
    return (
        <div className="p-4 md:p-8 space-y-8 max-w-4xl mx-auto">
            <header className="space-y-2 pt-4">
                <h1 className="text-3xl font-heading text-[var(--accent-900)]">Espace Divinatoire</h1>
                <p className="text-[var(--text-secondary)] opacity-80 max-w-lg">
                    Choisissez votre support de divination pour recevoir les messages de l'Univers.
                    Laissez votre intuition vous guider vers le tirage qui résonne en vous aujourd'hui.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {DECKS.map((deck) => (
                    <Link
                        key={deck.id}
                        href={`/tirages/${deck.id}`}
                        className="group relative overflow-hidden rounded-3xl border border-[var(--background-600)] bg-[var(--background-800)] p-6 transition-all hover:border-[var(--accent-700)] hover:shadow-lg hover:shadow-[var(--accent-900)]/20"
                    >
                        {/* Background Gradient */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${deck.color} opacity-20 transition-opacity group-hover:opacity-30`} />

                        <div className="relative z-10 flex flex-col h-full justify-between gap-4">
                            <div className="flex justify-between items-start">
                                <div className={`p-3 rounded-2xl bg-[var(--background-900)]/50 backdrop-blur-sm border border-[var(--background-600)] ${deck.accent}`}>
                                    <deck.icon size={28} />
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity -mr-2 -mt-2">
                                    <div className="w-8 h-8 rounded-full bg-[var(--background-900)] flex items-center justify-center text-[var(--text-primary)]">
                                        <ArrowRight size={16} />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-heading text-[var(--text-primary)] mb-1 group-hover:text-[var(--accent-500)] transition-colors">
                                    {deck.name}
                                </h3>
                                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                                    {deck.description}
                                </p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
