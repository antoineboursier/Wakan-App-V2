"use client";

import { Moon, Star, Zap, Lock, PlayCircle } from "lucide-react";
import { PageBackground } from "@/components/layout/PageBackground";

const QUIZZES = [
    {
        id: 1,
        title: "Les bases de l'Astrologie",
        description: "Apprenez à reconnaître les signes, planètes et maisons.",
        duration: "5 min",
        questions: 10,
        locked: false,
        difficulty: "Débutant",
        icon: Star,
    },
    {
        id: 2,
        title: "Intuition & Ressenti",
        description: "Développez votre sixième sens à travers des exercices pratiques.",
        duration: "8 min",
        questions: 15,
        locked: false,
        difficulty: "Intermédiaire",
        icon: Moon,
    },
    {
        id: 3,
        title: "Les Arcanes Majeurs",
        description: "Plongez dans la signification profonde du Tarot de Marseille.",
        duration: "12 min",
        questions: 22,
        locked: true,
        difficulty: "Avancé",
        icon: Zap,
    },
];

export default function QuizPage() {
    return (
        <div className="relative min-h-screen">
            <PageBackground imageSrc="/backgrounds/quiz.png" />
            <div className="p-4 md:p-8 space-y-8 max-w-4xl mx-auto relative z-10">
                <header className="space-y-2 pt-4">
                    <h1 className="text-3xl font-heading text-[var(--accent-900)]">Quiz & Apprentissage</h1>
                    <p className="text-[var(--text-secondary)] opacity-80 max-w-lg">
                        Testez vos connaissances et progressez dans votre éveil spirituel.
                        Gagnez des points d'expérience pour chaque bonne réponse.
                    </p>
                </header>

                <div className="space-y-4">
                    {QUIZZES.map((quiz) => (
                        <div
                            key={quiz.id}
                            className={`group relative overflow-hidden rounded-2xl border ${quiz.locked
                                ? "border-[var(--background-600)] bg-[var(--background-800)]/50 opacity-70"
                                : "border-[var(--background-600)] bg-[var(--background-800)] hover:border-[var(--accent-700)] hover:shadow-lg cursor-pointer"
                                } p-5 transition-all`}
                        >
                            <div className="flex items-center gap-4">
                                <div
                                    className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${quiz.locked
                                        ? "bg-[var(--background-700)] text-[var(--text-tertiary)]"
                                        : "bg-[var(--accent-900)]/10 text-[var(--accent-500)]"
                                        }`}
                                >
                                    {quiz.locked ? <Lock size={20} /> : <quiz.icon size={24} />}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-lg font-heading text-[var(--text-primary)] truncate pr-4">
                                            {quiz.title}
                                        </h3>
                                        {!quiz.locked && (
                                            <span className="text-xs font-bold text-[var(--rich-pink)] bg-[var(--rich-pink)]/10 px-2 py-1 rounded-full whitespace-nowrap">
                                                {quiz.difficulty}
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-sm text-[var(--text-secondary)] mt-1 truncate">
                                        {quiz.description}
                                    </p>

                                    <div className="flex items-center gap-4 mt-3 text-xs text-[var(--text-tertiary)] uppercase tracking-wider font-bold">
                                        <span>{quiz.questions} Questions</span>
                                        <span className="w-1 h-1 rounded-full bg-[var(--text-tertiary)]"></span>
                                        <span>{quiz.duration}</span>
                                    </div>
                                </div>

                                {!quiz.locked && (
                                    <div className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-[var(--accent-900)] text-[var(--background-900)] opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                                        <PlayCircle size={20} />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
