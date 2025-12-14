"use client";

import { Plus, Book, Calendar, Edit3, Moon } from "lucide-react";

const ENTRIES = [
    {
        id: 1,
        type: "tirage",
        title: "Tirage du matin",
        date: "Aujourd'hui, 08:30",
        preview: "Carte tirée : La Papesse. Une journée sous le signe de l'intuition et du mystère...",
        icon: Calendar,
    },
    {
        id: 2,
        type: "reve",
        title: "Rêve étrange",
        date: "Hier, 07:15",
        preview: "J'ai rêvé que je volais au-dessus d'une forêt de cristaux géants. La lumière était...",
        icon: Moon,
    },
    {
        id: 3,
        type: "note",
        title: "Réflexion",
        date: "12 Oct, 22:45",
        preview: "Je sens que je dois travailler sur mon ancrage. La méditation de ce soir était difficile.",
        icon: Edit3,
    },
];

export default function JournalPage() {
    return (
        <div className="p-4 md:p-8 space-y-8 max-w-4xl mx-auto min-h-screen flex flex-col">
            <header className="flex justify-between items-start pt-4">
                <div className="space-y-2">
                    <h1 className="text-3xl font-heading text-[var(--accent-900)]">Journal</h1>
                    <p className="text-[var(--text-secondary)] opacity-80">
                        Gardez une trace de votre voyage spirituel.
                    </p>
                </div>
                <button className="bg-[var(--accent-900)] text-[var(--background-900)] p-3 rounded-full hover:bg-[var(--accent-700)] transition-colors shadow-lg shadow-[var(--accent-900)]/20">
                    <Plus size={24} />
                </button>
            </header>

            {/* Timeline */}
            <div className="relative pl-8 space-y-8 before:absolute before:inset-0 before:ml-3.5 before:w-0.5 before:-translate-x-1/2 before:bg-gradient-to-b before:from-[var(--accent-900)] before:via-[var(--background-600)] before:to-transparent before:h-full">
                {ENTRIES.map((entry) => (
                    <div key={entry.id} className="relative">
                        {/* Timeline Dot */}
                        <div className="absolute left-0 -ml-[1.4rem] mt-1.5 w-4 h-4 rounded-full border-2 border-[var(--background-900)] bg-[var(--accent-900)] z-10"></div>

                        <div className="bg-[var(--background-800)] border border-[var(--background-600)] rounded-2xl p-5 hover:border-[var(--accent-700)] transition-colors cursor-pointer group">
                            <div className="flex items-center gap-2 mb-2">
                                <entry.icon size={16} className="text-[var(--accent-500)]" />
                                <span className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-wider">{entry.date}</span>
                            </div>

                            <h3 className="text-lg font-heading text-[var(--text-primary)] mb-2 group-hover:text-[var(--accent-500)] transition-colors">
                                {entry.title}
                            </h3>

                            <p className="text-sm text-[var(--text-secondary)] line-clamp-2">
                                {entry.preview}
                            </p>
                        </div>
                    </div>
                ))}

                <div className="relative pt-8 text-center text-[var(--text-tertiary)] opacity-50 text-sm">
                    Fin de l'historique
                </div>
            </div>
        </div>
    );
}
