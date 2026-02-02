"use client";

import React, { useState, useMemo } from 'react';
import { Icon } from '@iconify/react';
import { CorrectionDataModal } from './CorrectionDataModal';
import { Button } from '../ui/Button';
import { cn } from '@/lib/utils';

interface AstralDataPoint {
    label: string;
    value?: string;
    iconUrl?: string;
    isLocked?: boolean;
    missingRequirement?: 'birthTime' | 'birthPlace' | 'birthDate';
}

interface ZodiacProfileCardProps {
    signName: string;
    signIconUrl: string;
    heroImageUrl?: string;
    decan?: string;
    ascendant?: AstralDataPoint;
    rulingPlanet?: AstralDataPoint;
    onAddInfo: (data: { time?: string; place?: any }) => void;
    onViewDetail: () => void;
    className?: string;
}

/**
 * Détermine la priorité de tri d'un data point :
 * 0 = Info remplie (a une valeur, pas de missing, pas locked)
 * 1 = Info manquante (missingRequirement)
 * 2 = Info premium verrouillée (isLocked)
 */
function getSortPriority(dp: AstralDataPoint): number {
    // Si on a une valeur et pas de contrainte → rempli
    if (dp.value && !dp.missingRequirement && !dp.isLocked) return 0;
    // Si info manquante → bouton Add
    if (dp.missingRequirement) return 1;
    // Si premium verrouillé
    if (dp.isLocked) return 2;
    // Fallback (devrait pas arriver)
    return 3;
}

export function ZodiacProfileCard({
    signName,
    signIconUrl,
    heroImageUrl,
    decan,
    ascendant,
    rulingPlanet,
    onAddInfo,
    onViewDetail,
    className
}: ZodiacProfileCardProps) {
    const [isCorrectionModalOpen, setIsCorrectionModalOpen] = useState(false);
    const [missingFields, setMissingFields] = useState<Array<'birthTime' | 'birthPlace'>>([]);

    const handleOpenCorrection = (requirement: 'birthTime' | 'birthPlace' | 'birthDate') => {
        if (requirement === 'birthTime') setMissingFields(['birthTime']);
        if (requirement === 'birthPlace') setMissingFields(['birthPlace']);
        setIsCorrectionModalOpen(true);
    };

    // Tri automatique des data points selon leur état
    const sortedDataPoints = useMemo(() => {
        const points: AstralDataPoint[] = [];
        if (ascendant) points.push(ascendant);
        if (rulingPlanet) points.push(rulingPlanet);

        return points.sort((a, b) => getSortPriority(a) - getSortPriority(b));
    }, [ascendant, rulingPlanet]);

    return (
        <>
            <div
                className={cn(
                    "flex flex-col items-start self-stretch rounded-[var(--sizes-s,8px)] border border-[var(--text-tertiary)] bg-[var(--background-900)] backdrop-blur-[2px] overflow-hidden",
                    className
                )}
            >
                {/* Hero Image avec gradient overlay */}
                <div
                    className="h-[160px] w-full self-stretch relative overflow-hidden"
                    style={{
                        borderRadius: 'var(--sizes-s, 8px) var(--sizes-s, 8px) 0 0',
                        background: heroImageUrl
                            ? `linear-gradient(180deg, rgba(24, 39, 46, 0.00) 0%, var(--background-900, #18272E) 100%), url(${heroImageUrl}) lightgray 50% / cover no-repeat`
                            : 'var(--background-800)'
                    }}
                >
                    {!heroImageUrl && (
                        <div className="w-full h-full flex items-center justify-center text-[var(--text-tertiary)]">
                            <Icon icon="mdi:image-filter-hdr" width={48} opacity={0.5} />
                        </div>
                    )}
                </div>

                {/* Content Container - Overlap sur l'image */}
                <div className="flex flex-col items-start p-[24px] gap-[24px] self-stretch -mt-10 relative z-10">

                    {/* Header: Badge & Main Sign */}
                    <div className="w-full flex flex-col items-start gap-4">
                        {/* Badge Profil */}
                        <div className="flex py-[8px] px-[8px] items-center rounded-[var(--sizes-s,8px)] bg-[var(--background-800)]">
                            <span className="title-lit text-[var(--text-primary)]">Profil Zodiac</span>
                        </div>

                        {/* Main Sign Info */}
                        <div className="flex justify-center items-center gap-[24px] self-stretch">
                            {/* Icon Signe */}
                            <div className="w-[40px] h-[40px] relative flex-shrink-0">
                                <img
                                    src={signIconUrl}
                                    alt="Icon"
                                    className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(246,174,49,0.6)]"
                                />
                            </div>

                            {/* Text Info */}
                            <div className="flex flex-col justify-center items-start gap-[4px] flex-1">
                                <h2
                                    className="title-big text-[var(--accent-900)]"
                                    style={{ textShadow: "0 4px 8px var(--background-800)" }}
                                >
                                    {signName}
                                </h2>
                                {decan && (
                                    <span className="para-big text-[var(--accent-700)]">
                                        {decan}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Specific Infos - Auto sorted: Filled > Missing > Locked */}
                    <div className="flex flex-col gap-4 w-full">
                        {sortedDataPoints.map((dp, index) => (
                            <DataPointRow
                                key={dp.label + index}
                                data={dp}
                                onAdd={() => handleOpenCorrection(dp.missingRequirement!)}
                            />
                        ))}
                    </div>

                    {/* Footer Action */}
                    <Button
                        variant="secondary"
                        fullWidth
                        className="justify-between"
                        icon={<Icon icon="mdi:arrow-right" />}
                        onClick={onViewDetail}
                    >
                        Voir le détail
                    </Button>

                </div>
            </div>

            <CorrectionDataModal
                isOpen={isCorrectionModalOpen}
                onClose={() => setIsCorrectionModalOpen(false)}
                missingFields={missingFields}
                onSave={onAddInfo}
            />
        </>
    );
}

// Sub-component for a row (Ascendant, Planet...)
function DataPointRow({ data, onAdd }: { data?: AstralDataPoint, onAdd: () => void }) {
    if (!data) return null;

    // cas A: Manque info calcul -> Afficher Add
    if (data.missingRequirement) {
        return (
            <div className="flex items-center gap-2 self-stretch py-2">
                <div className="flex-1 flex items-center gap-2">
                    {data.isLocked && <Icon icon="solar:lock-bold" className="text-[var(--text-disabled)]" width={20} />}
                    <span className="para text-[var(--text-secondary)]">{data.label}</span>
                </div>

                <button
                    onClick={onAdd}
                    className="p-1 rounded-full hover:bg-[var(--background-800)] transition-colors group"
                    aria-label={`Ajouter info pour ${data.label}`}
                >
                    <Icon icon="icon-park-solid:add" className="text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]" width={24} height={24} />
                </button>
            </div>
        );
    }

    // Cas B: Locked but calculated -> Afficher Lock
    if (data.isLocked) {
        return (
            <div className="flex items-center gap-[24px] self-stretch py-1 opacity-60">
                <div className="w-[40px] h-[40px] flex items-center justify-center bg-[var(--background-800)] rounded-full">
                    <Icon icon="solar:lock-bold" className="text-[var(--text-disabled)]" width={20} />
                </div>
                <div className="flex flex-col justify-center items-start gap-[4px] flex-1">
                    <span className="para-lit text-[var(--text-disabled)]">{data.label}</span>
                    <span className="title-med text-[var(--text-disabled)]">Premium</span>
                </div>
            </div>
        );
    }

    // Cas C: Standard Display (Info remplie)
    return (
        <div className="flex items-center gap-[24px] self-stretch">
            {/* Icon */}
            <div className="w-[40px] h-[40px] relative flex-shrink-0">
                {data.iconUrl ? (
                    <img
                        src={data.iconUrl}
                        alt={data.value}
                        className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(246,174,49,0.4)]"
                    />
                ) : (
                    <div className="w-[40px] h-[40px] flex items-center justify-center bg-[var(--background-800)] rounded-full text-[var(--accent-900)]">
                        <Icon icon="mdi:planet" width={24} />
                    </div>
                )}
            </div>

            {/* Text */}
            <div className="flex flex-col justify-center items-start gap-[4px] flex-1">
                <span className="para-lit text-[var(--text-secondary)]">{data.label}</span>
                <span className="title-med text-[var(--accent-900)]">{data.value}</span>
            </div>
        </div>
    );
}
