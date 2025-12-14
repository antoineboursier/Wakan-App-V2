"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Layers, HelpCircle, Star, Book } from "lucide-react";

// Figma labels: Accueil, Tirages, Quiz, Mes astres, Journal
const NAV_ITEMS = [
    { name: "Accueil", href: "/", icon: Sparkles }, // Triangle icon in Figma, Sparkles fits the mystical vibe
    { name: "Tirages", href: "/tirages", icon: Layers }, // Cards
    { name: "Quiz", href: "/quiz", icon: HelpCircle },
    { name: "Mes astres", href: "/profil", icon: Star }, // Was Profil, now Mes astres
    { name: "Journal", href: "/journal", icon: Book },
];

export function Navigation() {
    const pathname = usePathname();

    return (
        <>
            {/* Mobile Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--background-800)] border-t border-[var(--background-600)] md:hidden pb-safe">
                <div className="flex justify-around items-center h-16">
                    {NAV_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex flex-col items-center justify-center w-full h-full gap-1 ${isActive ? "text-[var(--accent-900)]" : "text-[var(--text-primary)] opacity-60"
                                    }`}
                            >
                                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                                <span className="text-[10px] font-medium font-body">{item.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* Desktop Sidebar */}
            <nav className="hidden md:flex flex-col w-64 fixed left-0 top-0 bottom-0 bg-[var(--background-800)] border-r border-[var(--background-600)] p-4">
                <div className="mb-8 px-4 py-2">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-[var(--accent-900)] to-[var(--accent-500)] bg-clip-text text-transparent font-heading">
                        Wakan
                    </h1>
                </div>

                <div className="flex flex-col gap-2">
                    {NAV_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                    ? "bg-[var(--accent-900)] text-[var(--background-900)] shadow-lg shadow-[var(--accent-900)]/20"
                                    : "text-[var(--text-primary)] opacity-70 hover:opacity-100 hover:bg-[var(--background-700)]"
                                    }`}
                            >
                                <Icon size={20} />
                                <span className="font-medium font-body">{item.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </>
    );
}
