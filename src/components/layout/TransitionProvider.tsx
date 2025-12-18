"use client";

import { AnimatePresence, motion, Variants } from "framer-motion";
import { usePathname } from "next/navigation";
import { useContext, useEffect, useRef } from "react";
import { LayoutRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";

// --- Configuration des ordres de TabBar ---
const TAB_ORDER = ["/", "/tirages", "/quiz", "/profil", "/journal"];

function getTabOrder(path: string) {
    // On ne garde que la racine ou le path exact pour l'ordre
    // Si c'est une sous-page, ça n'a pas d'index "Tab" direct, on retourne -1
    // Sauf si on veut que /tirages/xyz soit considéré comme "Tirages" (index 1)

    // Stratégie simple : Match exact ou préfixe
    const index = TAB_ORDER.findIndex(p => p !== "/" ? path.startsWith(p) : path === "/");
    return index;
}

export function TransitionProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const prevPathRef = useRef(pathname);

    const directionRef = useRef({ direction: 0, mode: "tab" as "tab" | "stack" });

    // Calcul de la direction avant le rendu (pour que 'custom' le chope)
    const currentPath = pathname;
    const prevPath = prevPathRef.current;

    // Si le path a changé
    if (currentPath !== prevPath) {
        const curIndex = getTabOrder(currentPath);
        const prevIndex = getTabOrder(prevPath);

        // Cas 1 : Navigation TabBar (Top Level)
        if (curIndex !== -1 && prevIndex !== -1 && curIndex !== prevIndex) {
            directionRef.current = { direction: curIndex > prevIndex ? 1 : -1, mode: 'tab' };
        }
        // Cas 2 : Deep linking (Aller vers une sous-page) -> STACK PUSH
        else if (currentPath.startsWith(prevPath) && prevPath !== "/") {
            directionRef.current = { direction: 1, mode: 'stack' };
        }
        // Cas 3 : Retour arrière (Revenir d'une sous-page) -> STACK POP
        else if (prevPath.startsWith(currentPath) && currentPath !== "/") {
            directionRef.current = { direction: -1, mode: 'stack' };
        }
        // Cas par défaut
        else {
            directionRef.current = { direction: 0, mode: 'tab' };
        }

        prevPathRef.current = currentPath;
    }

    const trans = { duration: 0.35, ease: [0.25, 1, 0.5, 1] as const };

    // Variantes d'animation
    // "custom" est l'objet passée via <motion.div custom={directionRef.current}>
    const variants: Variants = {
        enter: ({ direction, mode }: { direction: number, mode: "tab" | "stack" }) => {
            // Stack Push: Le nouveau vient de la droite (surcouche)
            if (mode === 'stack' && direction === 1) {
                return { x: "100%", zIndex: 50, position: "absolute", top: 0, width: "100%", boxShadow: "-5px 0 25px rgba(0,0,0,0.1)" };
            }
            // Stack Pop: Le "nouveau" (le parent) revient de la gauche (parallax)
            if (mode === 'stack' && direction === -1) {
                return { x: "-25%", zIndex: 0, position: "absolute", top: 0, width: "100%", opacity: 0.5 };
            }

            // Tab: Classique
            return {
                x: direction > 0 ? "100%" : "-100%",
                zIndex: 1,
                position: "absolute",
                top: 0,
                width: "100%",
                opacity: 0 // Fade in pour tab
            };
        },
        center: ({ mode, direction }: { direction: number, mode: "tab" | "stack" }) => ({
            x: 0,
            // Si c'est un push ou si on est la sous-page (stack pop source), on est au dessus
            zIndex: (mode === 'stack' && direction === 1) ? 50 : 10,
            opacity: 1,
            position: "relative",
            width: "100%",
            transition: trans
        }),
        exit: ({ direction, mode }: { direction: number, mode: "tab" | "stack" }) => {
            // Stack Push: L'ancien (le parent) part en parallax gauche et s'assombrit
            if (mode === 'stack' && direction === 1) {
                return { x: "-25%", zIndex: 0, position: "absolute", top: 0, width: "100%", opacity: 0.5, transition: trans };
            }
            // Stack Pop: L'ancien (la sous-page) part vers la droite
            if (mode === 'stack' && direction === -1) {
                return { x: "100%", zIndex: 50, position: "absolute", top: 0, width: "100%", boxShadow: "-5px 0 25px rgba(0,0,0,0.1)", transition: trans };
            }

            // Tab: Sortie Parallax légère
            return {
                x: direction > 0 ? "-25%" : "25%",
                zIndex: 0,
                position: "absolute",
                top: 0,
                width: "100%",
                opacity: 0,
                transition: trans
            };
        }
    };

    return (
        <AnimatePresence mode="popLayout" custom={directionRef.current} initial={false}>
            <motion.div
                key={pathname}
                custom={directionRef.current}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                className="w-full h-full pt-8" // Padding moved here to prevent jumps during absolute positioning
            >
                {/* 
                   FrozenRouter logic omitted for simplicity. 
                */}
                {children}
            </motion.div>
        </AnimatePresence>
    );
}
