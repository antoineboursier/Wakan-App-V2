"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";

// Configuration des items de navigation
// Icones issues de Iconify (Collection Phosphor recommandée pour ce style)
const NAV_ITEMS = [
    {
        name: "Accueil",
        href: "/",
        icon: "ph:tipi-bold" // Tipi pour l'accueil
    },
    {
        name: "Tirages",
        href: "/tirages",
        icon: "mdi:cards-playing-heart-multiple",
        hasNotification: true // Point jaune demandé
    },
    {
        name: "Quiz",
        href: "/quiz",
        icon: "material-symbols:quiz"
    },
    {
        name: "Mes astres",
        href: "/profil",
        icon: "solar:star-bold-duotone"
    },
    {
        name: "Journal",
        href: "/journal",
        icon: "tdesign:book-filled"
    },
];

export function Navigation() {
    const pathname = usePathname();

    return (
        // Conteneur global fixe en bas (positionne la barre mais laisse passer les clics autour)
        <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-2 pointer-events-none">

            {/* La TabBar elle-même (interactive) */}
            <nav
                className="pointer-events-auto flex items-start p-[8px] gap-[4px] rounded-[16px] w-full max-w-[800px] transition-all"
                style={{
                    // Gradient spécifique demandé
                    background: "linear-gradient(90deg, var(--background-800, #1C3039) 0%, #365C6E 100%)",
                    // Ombre spécifique demandée
                    boxShadow: "0 12px 32px 0 var(--background-900, #18272E)"
                }}
            >
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    // Opacité : 100% si actif, 50% sinon
                    const activeClass = isActive ? "opacity-100" : "opacity-50 hover:opacity-75";

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center flex-1 py-1 gap-1 transition-opacity duration-200 ${activeClass}`}
                            style={{ padding: "4px 0" }} // Padding explicite Figma zones de clic
                        >
                            <div className="relative p-1">
                                <Icon
                                    icon={item.icon}
                                    className="text-[var(--text-primary)] w-7 h-7"
                                />

                                {/* Notification Dot (Tirages) */}
                                {item.hasNotification && (
                                    <span
                                        className="absolute top-1 right-0 w-[10px] h-[10px] bg-[var(--accent-500)] rounded-full border-2 border-[var(--background-800)]"
                                        aria-label="Notification disponible"
                                    />
                                )}
                            </div>

                            <span
                                className="text-[13px] font-body text-[var(--text-secondary)] text-center font-normal leading-[120%]"
                            >
                                {item.name}
                            </span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
