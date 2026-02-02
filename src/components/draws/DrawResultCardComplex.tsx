"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Icon } from "@iconify/react";

interface DrawResultCardComplexProps {
    items: Array<{
        slug: string;
        name: string;
        description?: string;
        positionLabel?: string;
    }>;
    globalDescription: string;
    onReset?: () => void;
}

export function DrawResultCardComplex({ items, globalDescription, onReset }: DrawResultCardComplexProps) {

    const mainItem = items[0];
    const otherItems = items.slice(1);

    return (
        <GlassCard
            className="w-full max-w-sm mx-auto p-6 flex flex-col gap-4 relative overflow-hidden text-left border border-white-mix"
            style={{
                background: 'linear-gradient(180deg, rgba(24, 39, 46, 0.30) 0%, rgba(24, 39, 46, 0.60) 50%, rgba(24, 39, 46, 0.90) 100%)',
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)'
            }}
        >

            {/* Header */}
            <div className="flex w-full justify-between items-center">
                <h2 className="para-big font-bold text-[var(--text-secondary)]">Runes du Destin</h2>
                <button className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                    <Icon icon="ri:share-fill" width="24" height="24" />
                </button>
            </div>

            {/* Main Item (First One) */}
            {mainItem && (
                <div className="flex items-center gap-4 animate-in slide-in-from-bottom duration-500">
                    <div className="w-[40px] h-[40px] relative flex-shrink-0 flex items-center justify-center effect-glow-yellow">
                        <div className="w-full h-full bg-[var(--accent-700)] rounded-lg flex items-center justify-center text-[var(--background-900)] font-bold title-lit">
                            {mainItem.slug.charAt(0).toUpperCase()}
                        </div>
                    </div>
                    <h3 className="title-big text-[var(--accent-900)] leading-tight">
                        {mainItem.name}
                    </h3>
                </div>
            )}

            {/* Other Items (Container gap-2 -> 8px) */}
            {otherItems.length > 0 && (
                <div className="flex flex-col gap-2 w-full mt-2">
                    {otherItems.map((item, index) => (
                        <div key={index + 1} className="flex items-center gap-4 animate-in slide-in-from-bottom duration-500" style={{ animationDelay: `${(index + 1) * 150}ms` }}>
                            <div className="w-[40px] h-[40px] relative flex-shrink-0 flex items-center justify-center effect-glow-yellow">
                                <div className="w-full h-full bg-[var(--accent-700)] rounded-lg flex items-center justify-center text-[var(--background-900)] font-bold title-lit">
                                    {item.slug.charAt(0).toUpperCase()}
                                </div>
                            </div>
                            <h3 className="title-med text-[var(--accent-700)] leading-tight">
                                {item.name}
                            </h3>
                        </div>
                    ))}
                </div>
            )}

            {/* Global Description */}
            <p className="para-big text-[var(--text-primary)] leading-relaxed opacity-90 mt-2">
                {globalDescription}
            </p>

            {/* Synthesis or Action */}
            <div className="">
                {onReset && (
                    <Button
                        variant="primary"
                        className=""
                        onClick={onReset}
                        disabled={true} // Visual request
                        icon={<Icon icon="mingcute:lock-fill" />}
                    >
                        Nouveau tirage
                    </Button>
                )}
            </div>

        </GlassCard>
    );
}
