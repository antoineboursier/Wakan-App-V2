"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { InputField } from "@/components/ui/InputField";
import { Button } from "@/components/ui/Button";
import { Icon } from "@iconify/react";
import { UserBirthData } from "@/types/astral";

interface ProfileCompletionModalProps {
    isOpen: boolean;
    onClose: () => void;
    missingFields: Array<'birthDate' | 'birthTime' | 'birthPlace'>;
    onSave: (data: Partial<UserBirthData>) => void;
}

export function ProfileCompletionModal({ isOpen, onClose, missingFields, onSave }: ProfileCompletionModalProps) {
    const [formData, setFormData] = useState<Partial<UserBirthData>>({
        date: '',
        time: '',
        place: { city: '', country: '' }
    });

    const handleChange = (field: keyof UserBirthData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handlePlaceChange = (subField: 'city' | 'country', value: string) => {
        setFormData(prev => {
            const currentPlace = prev.place || { city: '', country: '' };
            return {
                ...prev,
                place: {
                    ...currentPlace,
                    [subField]: value
                }
            };
        });
    };

    const handleSubmit = () => {
        // Validation basique
        if (missingFields.includes('birthDate') && !formData.date) return;
        if (missingFields.includes('birthTime') && !formData.time) return;
        if (missingFields.includes('birthPlace') && (!formData.place?.city || !formData.place?.country)) return;

        onSave(formData);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Complète ton profil astral"
        >
            <div className="flex flex-col gap-6">
                <p className="para text-[var(--text-secondary)]">
                    Ces informations sont nécessaires pour calculer précisément ce module astral. Elles restent privées.
                </p>

                <div className="flex flex-col gap-4">
                    {missingFields.includes('birthDate') && (
                        <InputField
                            label="Date de naissance"
                            type="date"
                            value={formData.date || ''}
                            onChange={(e) => handleChange('date', e.target.value)}
                            placeholder="JJ/MM/AAAA"
                        />
                    )}

                    {missingFields.includes('birthTime') && (
                        <div className="flex flex-col gap-1">
                            {/* Note: InputField handles label, but here we might want extra helper text not supported by all props yet or standard way. */}
                            <InputField
                                label="Heure de naissance"
                                subtext="Essaie d'être le plus précis possible."
                                type="time"
                                value={formData.time || ''}
                                onChange={(e) => handleChange('time', e.target.value)}
                                icon="mdi:clock-outline"
                            />
                        </div>
                    )}

                    {missingFields.includes('birthPlace') && (
                        <div className="flex flex-col gap-1">
                            <label className="text-[var(--text-secondary)] para-lit truncate w-full">Lieu de naissance</label>
                            <div className="flex gap-2">
                                <InputField
                                    label="Ville"
                                    type="text"
                                    value={formData.place?.city || ''}
                                    onChange={(e) => handlePlaceChange('city', e.target.value)}
                                    placeholder="Ville"
                                    className="flex-1"
                                />
                                <InputField
                                    label="Pays"
                                    type="text"
                                    value={formData.place?.country || ''}
                                    onChange={(e) => handlePlaceChange('country', e.target.value)}
                                    placeholder="Pays"
                                    className="flex-1"
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-end pt-2">
                    <Button
                        variant="primary"
                        onClick={handleSubmit}
                        icon={<Icon icon="mdi:check" />}
                    >
                        Enregistrer
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
