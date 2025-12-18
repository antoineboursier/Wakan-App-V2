"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@iconify/react";
import clsx from "clsx";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
    description?: string;
}

export function Modal({ isOpen, onClose, children, title, description }: ModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    // Prevent scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!mounted) return null;

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative z-10 w-full max-w-lg bg-[var(--background-900)] border border-[var(--background-600)] rounded-xl shadow-2xl p-6 animate-in zoom-in-95 duration-200 flex flex-col gap-4 max-h-[90vh]">

                {/* Header */}
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        {title && <h2 className="title-med text-[var(--text-primary)]">{title}</h2>}
                        {description && <p className="para-lit text-[var(--text-secondary)]">{description}</p>}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--background-700)] transition-colors"
                    >
                        <Icon icon="mdi:close" width="24" height="24" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto min-h-0">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
}
