"use client";

import React from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils"; // Assuming utility exists, or use generic class concatenation

export interface TabItem {
    id: string;
    label: string;
    icon: string;
}

interface AnimatedTabsProps {
    tabs: TabItem[];
    activeTab: string;
    onTabChange: (id: string) => void;
    className?: string;
}

export function AnimatedTabs({ tabs, activeTab, onTabChange, className }: AnimatedTabsProps) {
    return (
        <div
            className={cn(
                "flex w-fit items-center p-2 bg-[var(--background-800)] rounded-[16px] gap-1 border border-[var(--background-600)] relative",
                className
            )}
        >
            {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={cn(
                            "w-max relative flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-[12px] text-sm font-bold transition-colors z-10 whitespace-nowrap group",
                            isActive ? "text-[var(--accent-900)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                        )}
                        style={{
                            fontFamily: '"League Spartan", sans-serif',
                            fontSize: '16px',
                        }}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="active-tab-bg"
                                className="absolute inset-0 bg-[var(--background-700)] rounded-[12px] shadow-[0_4px_8px_var(--background-900)] border border-[var(--background-500)]"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                initial={false}
                                style={{ zIndex: -1 }} // Place behind text
                            />
                        )}

                        <Icon
                            icon={tab.icon}
                            className={cn(
                                "w-6 h-6 transition-colors",
                                isActive ? "text-[var(--accent-900)]" : "text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]"
                            )}
                        />
                        <span className="relative z-10 pt-1">{tab.label}</span>
                    </button>
                );
            })}
        </div>
    );
}
