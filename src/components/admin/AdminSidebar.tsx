'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";
import clsx from "clsx";
import { useState } from "react";

export function AdminSidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const links = [
        { href: "/admin", label: "Dashboard", icon: "mdi:view-dashboard-outline" },
        { href: "/admin/draw-types", label: "Tirages", icon: "mdi:cards-outline" },
        { href: "/admin/quizzes", label: "Quiz", icon: "mdi:puzzle-outline" },
        { href: "/admin/astral", label: "Profils Astraux", icon: "mdi:stars" },
        { href: "/design-system", label: "Design System", icon: "mdi:palette-outline" },
    ];

    return (
        <>
            {/* Mobile Header Bar */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-4 z-50">
                <span className="font-bold text-xl text-white tracking-tight">Wakan<span className="text-blue-500">Admin</span></span>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 text-slate-300 hover:text-white"
                >
                    <Icon icon={isOpen ? "mdi:close" : "mdi:menu"} width="24" />
                </button>
            </div>

            {/* Sidebar Overlay (Mobile) */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden animate-in fade-in"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Content */}
            <aside className={clsx(
                "fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-800 border-r border-slate-700 transition-transform duration-300 ease-in-out md:translate-x-0 flex flex-col",
                isOpen ? "translate-x-0 pt-16 md:pt-0" : "-translate-x-full"
            )}>
                {/* Logo Area (Desktop) */}
                <div className="h-16 hidden md:flex items-center px-6 border-b border-slate-700">
                    <span className="font-bold text-xl text-white tracking-tight">Wakan<span className="text-blue-500">Admin</span></span>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {links.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className={clsx(
                                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                                        : "text-slate-400 hover:text-white hover:bg-slate-700"
                                )}
                            >
                                <Icon icon={link.icon} width="20" />
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer Actions */}
                <div className="p-4 border-t border-slate-700">
                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-slate-900 hover:bg-slate-700 text-slate-400 hover:text-white rounded text-sm font-medium transition-colors border border-slate-700"
                    >
                        <Icon icon="mdi:arrow-left" /> Retour App
                    </Link>
                </div>
            </aside>
        </>
    );
}
