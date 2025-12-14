"use client";

import { User, MapPin, Calendar, Lock } from "lucide-react";

export default function ProfilPage() {
    return (
        <div className="p-4 md:p-8 space-y-8 max-w-4xl mx-auto">
            <header className="space-y-2 pt-4">
                <h1 className="text-3xl font-heading text-[var(--accent-900)]">Mes Astres</h1>
                <p className="text-[var(--text-secondary)] opacity-80 max-w-lg">
                    Découvrez votre carte du ciel et votre identité cosmique.
                </p>
            </header>

            {/* User Info Card */}
            <div className="bg-[var(--background-800)] border border-[var(--background-600)] rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-[var(--background-700)] border-2 border-[var(--accent-900)] p-1">
                    {/* Avatar Placeholder */}
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-[var(--background-600)] to-[var(--background-900)] flex items-center justify-center text-[var(--accent-900)]">
                        <User size={40} />
                    </div>
                </div>

                <div className="text-center md:text-left flex-1 space-y-2">
                    <h2 className="text-2xl font-heading text-[var(--text-primary)]">Paul</h2>
                    <div className="flex flex-wrap justify-center md:justify-start gap-3 text-sm text-[var(--text-secondary)]">
                        <span className="flex items-center gap-1 bg-[var(--background-900)] px-3 py-1 rounded-full border border-[var(--background-600)]">
                            <Calendar size={14} /> 12 Octobre 1990
                        </span>
                        <span className="flex items-center gap-1 bg-[var(--background-900)] px-3 py-1 rounded-full border border-[var(--background-600)]">
                            <MapPin size={14} /> Paris, France
                        </span>
                    </div>
                </div>

                <button className="px-6 py-2 rounded-full bg-[var(--accent-900)] text-[var(--background-900)] font-bold text-sm hover:bg-[var(--accent-700)] transition-colors">
                    Modifier
                </button>
            </div>

            {/* Astral Identity Grid */}
            <h3 className="text-xl font-heading text-[var(--text-primary)]">Mon Trinité Astrale</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Soleil */}
                <div className="bg-[var(--background-800)] border border-[var(--background-600)] rounded-2xl p-6 flex flex-col items-center justify-center gap-4 text-center hover:border-[var(--rich-yellow)] transition-colors group">
                    <div className="w-16 h-16 rounded-full bg-[var(--rich-yellow)]/10 text-[var(--rich-yellow)] flex items-center justify-center group-hover:scale-110 transition-transform">
                        <span className="font-heading text-2xl">☉</span>
                    </div>
                    <div>
                        <span className="text-xs uppercase tracking-widest text-[var(--text-tertiary)] font-bold">Signe Solaire</span>
                        <h4 className="text-xl font-bold text-[var(--text-primary)] mt-1">Balance</h4>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)]">Votre essence profonde, votre ego.</p>
                </div>

                {/* Ascendant */}
                <div className="bg-[var(--background-800)] border border-[var(--background-600)] rounded-2xl p-6 flex flex-col items-center justify-center gap-4 text-center hover:border-[var(--rich-pink)] transition-colors group">
                    <div className="w-16 h-16 rounded-full bg-[var(--rich-pink)]/10 text-[var(--rich-pink)] flex items-center justify-center group-hover:scale-110 transition-transform">
                        <span className="font-heading text-2xl">ASC</span>
                    </div>
                    <div>
                        <span className="text-xs uppercase tracking-widest text-[var(--text-tertiary)] font-bold">Ascendant</span>
                        <h4 className="text-xl font-bold text-[var(--text-primary)] mt-1">Scorpion</h4>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)]">Votre masque social, votre apparence.</p>
                </div>

                {/* Lune (Locked example provided) */}
                <div className="relative overflow-hidden bg-[var(--background-800)] border border-[var(--background-600)] rounded-2xl p-6 flex flex-col items-center justify-center gap-4 text-center opacity-80">
                    <div className="absolute inset-0 bg-[var(--background-900)]/60 backdrop-blur-[1px] z-10 flex items-center justify-center">
                        <Lock className="text-[var(--text-tertiary)]" size={32} />
                    </div>
                    <div className="w-16 h-16 rounded-full bg-[var(--rich-purple)]/10 text-[var(--rich-purple)] flex items-center justify-center">
                        <span className="font-heading text-2xl">☽</span>
                    </div>
                    <div>
                        <span className="text-xs uppercase tracking-widest text-[var(--text-tertiary)] font-bold">Signe Lunaire</span>
                        <h4 className="text-xl font-bold text-[var(--text-primary)] mt-1 blur-sm text-opacity-50">Inconnu</h4>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)]">Vos émotions, votre monde intérieur.</p>
                </div>
            </div>
        </div>
    );
}
