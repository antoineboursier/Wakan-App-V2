"use client";

import { Button } from "@/components/ui/Button";
import { BackButton } from "@/components/ui/BackButton";
import { Icon } from "@iconify/react";

export default function DesignSystemPage() {
    return (
        <div className="min-h-screen bg-[var(--background-main)] text-[var(--text-primary)] p-8 space-y-12">

            <header className="space-y-4">
                <h1 className="title-big text-[var(--accent-500)]">Design System Lab</h1>
                <p className="para-big text-[var(--text-secondary)]">Test environment for all UI components to ensure visual consistency.</p>
            </header>

            {/* Typography Section */}
            <section className="space-y-6">
                <h2 className="title-med border-b border-white/10 pb-2">Typography</h2>
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <p className="text-sm text-slate-500 font-mono">.title-big (Skranji)</p>
                        <h1 className="title-big">The Quick Brown Fox</h1>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm text-slate-500 font-mono">.title-med (Skranji)</p>
                        <h2 className="title-med">The Quick Brown Fox</h2>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm text-slate-500 font-mono">.title-lit (Skranji)</p>
                        <h3 className="title-lit">The Quick Brown Fox</h3>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm text-slate-500 font-mono">.para-big (DM Sans)</p>
                        <p className="para-big">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm text-slate-500 font-mono">.para (DM Sans)</p>
                        <p className="para">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm text-slate-500 font-mono">.para-lit (DM Sans)</p>
                        <p className="para-lit">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    </div>
                </div>
            </section>

            {/* Buttons Section */}
            <section className="space-y-6">
                <h2 className="title-med border-b border-white/10 pb-2">Buttons</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Primary Variant */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-[var(--accent-500)]">Primary</h3>
                        <div className="flex flex-wrap gap-4 items-center">
                            <Button variant="primary">Primary Button</Button>
                            <Button variant="primary" icon={<Icon icon="mdi:rocket-launch" className="text-current text-xl" />}>
                                With Icon
                            </Button>
                            <Button variant="primary" disabled>Disabled</Button>
                        </div>
                    </div>

                    {/* Secondary Variant */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-[var(--accent-500)]">Secondary</h3>
                        <div className="flex flex-wrap gap-4 items-center p-4 bg-slate-900/50 rounded-lg">
                            <Button variant="secondary">Secondary Button</Button>
                            <Button variant="secondary" icon={<Icon icon="mdi:cog" className="text-current text-xl" />}>
                                With Icon
                            </Button>
                            <Button variant="secondary" disabled>Disabled</Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Back Button Section */}
            <section className="space-y-6">
                <h2 className="title-med border-b border-white/10 pb-2">Navigation</h2>
                <div className="flex flex-col gap-4 items-start p-4 bg-slate-800/30 rounded-lg">
                    <BackButton />
                    <BackButton label="Custom Label" />
                    <BackButton variant="close" label="Fermer" />
                    <BackButton variant="close" label="Quitter (reversed)" className="flex-row-reverse" />
                </div>
            </section>

            {/* Colors Section - Full Palette */}
            <section className="space-y-6">
                <h2 className="title-med border-b border-white/10 pb-2">Colors & Tokens</h2>

                {/* Backgrounds */}
                <h3 className="title-lit text-[var(--accent-500)] mt-4">Backgrounds</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    <ColorCard name="--background-900" varName="var(--background-900)" />
                    <ColorCard name="--background-800" varName="var(--background-800)" />
                    <ColorCard name="--background-700" varName="var(--background-700)" />
                    <ColorCard name="--background-600" varName="var(--background-600)" />
                    <ColorCard name="--background-500" varName="var(--background-500)" />
                    <ColorCard name="--background-400" varName="var(--background-400)" />
                    <ColorCard name="--background-300" varName="var(--background-300)" />
                    <ColorCard name="--background-200" varName="var(--background-200)" />
                    <ColorCard name="--background-100" varName="var(--background-100)" />
                </div>

                {/* Accents */}
                <h3 className="title-lit text-[var(--accent-500)] mt-4">Accents (Gold)</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    <ColorCard name="--accent-900" varName="var(--accent-900)" />
                    <ColorCard name="--accent-700" varName="var(--accent-700)" />
                    <ColorCard name="--accent-500" varName="var(--accent-500)" />
                    <ColorCard name="--accent-disabled" varName="var(--accent-disabled)" />
                </div>

                {/* Text */}
                <h3 className="title-lit text-[var(--text-primary)] mt-4">Text & Content</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <ColorCard name="--text-primary" varName="var(--text-primary)" />
                    <ColorCard name="--text-secondary" varName="var(--text-secondary)" />
                    <ColorCard name="--text-tertiary" varName="var(--text-tertiary)" />
                    <ColorCard name="--text-disabled" varName="var(--text-disabled)" />
                    <ColorCard name="--accent-text-on-900" varName="var(--accent-text-on-900)" />
                    <ColorCard name="--accent-text-on-700" varName="var(--accent-text-on-700)" />
                </div>

                {/* Rich Colors */}
                <h3 className="title-lit text-[var(--rich-pink)] mt-4">Rich Colors</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <ColorCard name="--rich-pink" varName="var(--rich-pink)" />
                    <ColorCard name="--rich-purple" varName="var(--rich-purple)" />
                    <ColorCard name="--rich-yellow" varName="var(--rich-yellow)" />
                    <ColorCard name="--rich-blue" varName="var(--rich-blue)" />
                </div>

                {/* UI Feedback */}
                <h3 className="title-lit text-[var(--ui-on-positive)] mt-4">UI Feedback</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <ColorCard name="--ui-positive" varName="var(--ui-positive)" />
                    <ColorCard name="--ui-on-positive" varName="var(--ui-on-positive)" />
                    <ColorCard name="--ui-warning" varName="var(--ui-warning)" />
                    <ColorCard name="--ui-on-warning" varName="var(--ui-on-warning)" />
                    <ColorCard name="--ui-alert" varName="var(--ui-alert)" />
                    <ColorCard name="--ui-on-alert" varName="var(--ui-on-alert)" />
                </div>
            </section>

            <footer className="pt-10 border-t border-white/10 text-center">
                <p className="para-lit text-[var(--text-disabled)]">Wakan Design System v2.0</p>
            </footer>

        </div>
    );
}

function ColorCard({ name, varName }: { name: string, varName: string }) {
    return (
        <div className="flex flex-col gap-2 p-2 rounded hover:bg-white/5 transition-colors">
            <div className="h-12 w-full rounded border border-white/10 shadow-sm relative overflow-hidden group">
                <div
                    className="absolute inset-0"
                    style={{ backgroundColor: varName }}
                />
            </div>
            <div className="flex flex-col">
                <span className="font-mono text-xs font-bold text-[var(--text-primary)]">{name}</span>
                <span className="font-mono text-[10px] text-[var(--text-secondary)]">{varName}</span>
            </div>
        </div>
    );
}
