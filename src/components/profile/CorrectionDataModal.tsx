"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@iconify/react";
import { Button } from "../ui/Button";
import { InputField } from "../ui/InputField"; // Assuming InputField handles label/value/onChange
import { CityAutocomplete } from "../ui/CityAutocomplete";

interface CorrectionDataModalProps {
    isOpen: boolean;
    onClose: () => void;
    missingFields: Array<'birthTime' | 'birthPlace'>; // Only time and place usually need 'correction' or addition for ascendant
    onSave: (data: { time?: string; place?: any }) => void;
}

export function CorrectionDataModal({ isOpen, onClose, missingFields, onSave }: CorrectionDataModalProps) {
    const [mounted, setMounted] = useState(false);
    const [time, setTime] = useState("");
    const [place, setPlace] = useState<any>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Reset when opening
    useEffect(() => {
        if (isOpen) {
            setTime("");
            setPlace(null);
        }
    }, [isOpen]);

    const handleSave = () => {
        const data: any = {};
        if (time) data.time = time;
        if (place) data.place = place;
        onSave(data);
        onClose();
    };

    if (!mounted || !isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Modal Content - Styled per requirements */}
            <div
                className="relative z-10 w-full max-w-sm flex flex-col items-center gap-8 p-6 animate-in zoom-in-95 duration-200"
                style={{
                    borderRadius: "var(--sizes-l, 24px)",
                    border: "1px solid var(--text-secondary)", // #CDBCAE
                    background: "var(--background-900)", // #18272E
                    boxShadow: "0 8px 24px 0 var(--background-900)"
                }}
            >
                {/* Close Button */}
                <div className="absolute top-4 right-4">
                    <button
                        onClick={onClose}
                        className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    >
                        <Icon icon="mdi:close" width="24" height="24" />
                    </button>
                </div>

                <div className="w-full text-center space-y-2">
                    <h3 className="title-med text-[var(--text-primary)]">
                        Compléter mon profil
                    </h3>
                    <p className="para-lit text-[var(--text-secondary)]">
                        Ces informations sont nécessaires pour calculer votre profil astrologique précis.
                    </p>
                </div>

                <div className="w-full flex flex-col gap-4">
                    {missingFields.includes('birthTime') && (
                        <InputField
                            label="Heure de naissance"
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            icon="solar:clock-circle-linear"
                            placeholder="00:00"
                        />
                    )}

                    {missingFields.includes('birthPlace') && (
                        <CityAutocomplete
                            label="Lieu de naissance"
                            placeholder="Rechercher une ville..."
                            value={place ? `${place.city}, ${place.country}` : ''}
                            onSelect={(p) => setPlace({
                                city: p.name,
                                country: p.country,
                                lat: p.latitude,
                                lng: p.longitude,
                                timezone: p.timezone
                            })}
                        />
                    )}
                </div>

                <div className="w-full flex flex-col gap-3">
                    <Button
                        variant="primary"
                        onClick={handleSave}
                        disabled={(!time && missingFields.includes('birthTime') && !place)} // Rudimentary validation
                        icon={<Icon icon="material-symbols:wand-stars-rounded" width={24} />}
                        className="w-full justify-center"
                    >
                        Enregistrer
                    </Button>
                    <button
                        onClick={onClose}
                        className="para-lit text-[var(--text-secondary)] hover:text-[var(--text-primary)] underline transition-colors"
                    >
                        Fermer
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
