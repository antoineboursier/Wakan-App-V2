import { createClient } from "@supabase/supabase-js";
import { PageBackground } from "@/components/layout/PageBackground";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const dynamic = 'force-dynamic';

export default async function DrawResultPage({
    params,
    searchParams
}: {
    params: Promise<{ slug: string }>,
    searchParams: Promise<{ ids?: string; r_ids?: string; count?: string }>
}) {
    const slug = (await params).slug;
    const { ids, r_ids } = await searchParams;

    // --- Fetch Draw Type for context
    const { data: drawType } = await supabase
        .from('draw_types')
        .select('*')
        .eq('slug', slug)
        .single();

    if (!drawType) return <div className="text-white p-10">Tirage introuvable</div>;

    // --- Fetch Items if IDs provided
    let items: any[] = [];
    if (ids) {
        const idList = ids.split(',');
        const reversedList = r_ids ? r_ids.split(',') : [];

        const { data } = await supabase
            .from('draw_items')
            .select('*')
            .in('id', idList);

        if (data) {
            // Map data to display items, handling reversals
            items = idList.map(id => {
                const item = data.find(d => d.id === id);
                if (!item) return null;
                const isReversed = reversedList.includes(id);

                return {
                    ...item,
                    isReversed,
                    displayName: isReversed ? `${item.name} (renversée)` : item.name,
                    displayDescription: isReversed ? (item.reversed_description || item.long_description) : item.long_description,
                };
            }).filter(Boolean);
        }
    }

    return (
        <div className="min-h-screen relative font-body flex flex-col items-center">
            <PageBackground imageSrc={drawType.background_image_url || "/backgrounds/journal.png"} alt="Résultat" />

            <div className="relative z-10 w-full max-w-4xl p-6 flex flex-col gap-8 pb-32">

                {/* Header Navigation */}
                <div className="flex justify-between items-center text-white">
                    <Link href="/tirages" className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
                        <Icon icon="mdi:arrow-left" /> Retour aux oracles
                    </Link>
                </div>

                <div className="text-center space-y-4">
                    <h1 className="title-big text-[var(--accent-500)] drop-shadow-lg">
                        Votre message
                    </h1>
                    <p className="text-[var(--text-secondary)] italic max-w-md mx-auto">
                        "{drawType.title}" vous révèle ses secrets...
                    </p>
                </div>

                {/* Cards Display */}
                <div className={`grid gap-8 ${items.length === 1 ? 'grid-cols-1 max-w-md mx-auto' : 'grid-cols-1 md:grid-cols-3'}`}>
                    {items.map((item, idx) => (
                        <div key={`${item.id}-${idx}`} className="animate-in fade-in zoom-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: `${idx * 200}ms` }}>
                            <GlassCard className="p-0 overflow-hidden bg-[var(--background-800)/60]">
                                <div className="aspect-[2/3] w-full relative bg-slate-900/50 overflow-hidden">
                                    {/* Image Container with optional rotation */}
                                    <div className={`w-full h-full transition-transform duration-700 ${item.isReversed ? 'rotate-180' : ''}`}>
                                        {item.image_url ? (
                                            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-600">
                                                <Icon icon="mdi:image-off" width="48" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--background-900)] to-transparent opacity-80 pointer-events-none" />

                                    <div className="absolute bottom-0 left-0 w-full p-6 text-center z-10">
                                        {item.isReversed && (
                                            <div className="flex justify-center mb-2 animate-bounce">
                                                <img src="/arrow_down.svg" alt="Renversée" className="w-6 h-6 text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
                                            </div>
                                        )}
                                        <h2 className="title-med text-[var(--text-primary)] mb-2 capitalize leading-tight">
                                            {item.displayName}
                                        </h2>
                                    </div>
                                </div>

                                <div className="p-6 space-y-4">
                                    <div className="text-[var(--text-secondary)] leading-relaxed text-sm">
                                        {item.displayDescription}
                                    </div>
                                    <div className="pt-4 border-t border-[var(--text-tertiary)]/20">
                                        <h3 className="text-[var(--accent-500)] font-bold text-xs uppercase tracking-widest mb-2">Conseil</h3>
                                        {/* Fallback mock text if no specific 'advice' field yet */}
                                        <p className="text-xs text-[var(--text-tertiary)] italic">
                                            Méditez sur cette image et laissez votre intuition vous guider vers la réponse qui résonne en vous.
                                        </p>
                                    </div>
                                </div>
                            </GlassCard>
                        </div>
                    ))}

                    {items.length === 0 && (
                        <div className="col-span-full text-center p-12 bg-black/20 rounded-xl">
                            <p className="text-red-400 mb-4">Impossible de lire le tirage.</p>
                            <Link href="/tirages" className="underline text-white">Recommencer</Link>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
