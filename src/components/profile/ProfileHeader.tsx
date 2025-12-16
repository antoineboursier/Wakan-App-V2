import React from 'react';
import { Icon } from "@iconify/react";

interface ProfileHeaderProps {
    firstName: string;
    patrolName: string;
    imageUrl?: string;
}

export function ProfileHeader({ firstName, patrolName, imageUrl }: ProfileHeaderProps) {
    return (
        <div className="flex flex-col items-center gap-4 py-6">
            <div className="relative group cursor-pointer">
                {/* Avatar Container */}
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[var(--accent-500)] bg-[var(--background-800)] flex items-center justify-center relative shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
                    {imageUrl ? (
                        <img src={imageUrl} alt="Profil" className="w-full h-full object-cover" />
                    ) : (
                        <Icon icon="solar:camera-add-linear" className="w-8 h-8 text-[var(--text-tertiary)]" />
                    )}
                </div>
                {/* Edit Badge */}
                <div className="absolute bottom-0 right-0 bg-[var(--accent-500)] rounded-full p-1.5 shadow-md">
                    <Icon icon="solar:pen-new-square-bold" className="w-3 h-3 text-[var(--background-900)]" />
                </div>
            </div>

            <div className="text-center">
                <h2 className="title-med text-[var(--accent-500)]">
                    {firstName} <span className="text-[var(--text-secondary)]">({patrolName})</span>
                </h2>
            </div>
        </div>
    );
}
