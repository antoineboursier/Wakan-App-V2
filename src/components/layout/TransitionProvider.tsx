"use client";

import { AnimatePresence, motion, Variants } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// --- Définition des pages principales et sous-pages ---
const MAIN_PAGES = ["/", "/tirages", "/quiz", "/profil", "/journal"];

function isMainPage(path: string): boolean {
    // Exact match
    if (MAIN_PAGES.includes(path)) return true;
    // Si c'est juste query param sur une main page ? (ex: /tirages?search=...)
    // On considère que le pathname de base suffit.
    return false;
}

function isSubPage(path: string): boolean {
    if (isMainPage(path)) return false;
    // Une sous-page commence par une root connue (ex: /tirages/rune)
    return MAIN_PAGES.some(main => main !== "/" && path.startsWith(main + "/"));
}

type TransitionType = "none" | "push" | "pop" | "tabs";

function getTransitionType(currentPath: string, prevPath: string): TransitionType {
    if (currentPath === prevPath) return "none";

    const currentIsMain = isMainPage(currentPath);
    const prevIsMain = isMainPage(prevPath);
    const currentIsSub = isSubPage(currentPath);
    const prevIsSub = isSubPage(prevPath);

    // Entre pages principales -> Pas de transition (ou fade discret)
    if (currentIsMain && prevIsMain) {
        return "none";
    }

    // Main -> Sub -> PUSH (volet arrive de droite, Main reste en dessous)
    if (prevIsMain && currentIsSub) {
        return "push";
    }

    // Sub -> Main -> POP (volet part à droite, Main réapparaît en dessous)
    if (prevIsSub && currentIsMain) {
        return "pop";
    }

    // Sub -> Sub (Deep nav) -> PUSH
    if (prevIsSub && currentIsSub) {
        return "push";
    }

    return "none";
}

export function TransitionProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const prevPathRef = useRef(pathname);

    // On garde le type de transition en ref pour que les variants y accèdent sans re-render intempestif
    const transitionTypeRef = useRef<TransitionType>("none");

    // Calcul immédiat du type de transition
    if (pathname !== prevPathRef.current) {
        transitionTypeRef.current = getTransitionType(pathname, prevPathRef.current);
        prevPathRef.current = pathname;
    }

    // Scroll handling: Reset scroll ONLY if needed, or rely on layout
    useEffect(() => {
        // En mode Pop (Retour), Idéalement on voudrait restaurer le scroll, 
        // mais Next.js le fait parfois nativement.
        // On force le haut de page pour éviter les sauts bizarres dans les layouts absolus.
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, [pathname]);

    const animDuration = 0.4;
    const animEase = [0.32, 0.72, 0, 1] as const;

    // Simulation de "Stack":
    // Push: Enter vient de droite (+100%). Exit part en parallax (-20% opacity).
    // Pop: Enter vient de parallax (-20% opacity). Exit part à droite (+100%).
    const variants: Variants = {
        enter: (type: TransitionType) => {
            if (type === "push") {
                // La nouvelle page (Sub) arrive de la droite
                return { x: "100%", opacity: 1, zIndex: 50 };
            }
            if (type === "pop") {
                // La nouvelle page (Main) réapparaît du fond (légèrement sombre/décalée)
                return { x: "-20%", opacity: 0.8, zIndex: 0 };
            }
            // None
            return { x: 0, opacity: 0, zIndex: 1 };
        },
        center: (type: TransitionType) => {
            if (type === "push" || type === "pop") {
                return {
                    x: 0,
                    opacity: 1,
                    zIndex: type === "push" ? 50 : 0, // Si on push, on est au dessus. Si on pop, on est en dessous (on attend que l'autre parte).
                    transition: { duration: animDuration, ease: animEase }
                };
            }
            // None: Fade in rapide
            return { x: 0, opacity: 1, zIndex: 1, transition: { duration: 0.2 } };
        },
        exit: (type: TransitionType) => {
            if (type === "push") {
                // L'ancienne page (Main) recule un peu et s'assombrit
                return {
                    x: "-20%",
                    opacity: 0.8,
                    zIndex: 0,
                    transition: { duration: animDuration, ease: animEase }
                };
            }
            if (type === "pop") {
                // L'ancienne page (Sub) repart à droite
                return {
                    x: "100%",
                    opacity: 1,
                    zIndex: 50,
                    transition: { duration: animDuration, ease: animEase }
                };
            }
            // None: Fade out
            return { x: 0, opacity: 0, zIndex: 1, transition: { duration: 0.2 } };
        }
    };

    return (
        <div className="relative w-full h-[100dvh] bg-[var(--background-800)] overflow-hidden">
            <AnimatePresence mode="popLayout" custom={transitionTypeRef.current} initial={false}>
                <motion.div
                    key={pathname}
                    custom={transitionTypeRef.current}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="w-full h-[100dvh] bg-[var(--background-800)] shadow-2xl pb-32 no-scrollbar"
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        overflowY: "scroll", // Force scroll behavior
                        overflowX: "hidden",
                        WebkitOverflowScrolling: "touch", // Smooth scroll iOS
                        overscrollBehaviorY: "contain" // Prevent body scroll chain
                    }}
                >
                    {children}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
