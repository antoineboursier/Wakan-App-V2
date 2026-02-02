"use client";

import React, { createContext, useContext, useState, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@iconify/react";

/* -------------------------------------------------------------------------- */
/*                                    TYPES                                   */
/* -------------------------------------------------------------------------- */

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType, duration?: number) => void;
}

/* -------------------------------------------------------------------------- */
/*                                   CONTEXT                                  */
/* -------------------------------------------------------------------------- */

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};

/* -------------------------------------------------------------------------- */
/*                                  PROVIDER                                  */
/* -------------------------------------------------------------------------- */

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const showToast = useCallback((message: string, type: ToastType = "success", duration = 3000) => {
        const id = Math.random().toString(36).substring(2, 9);
        const newToast = { id, message, type };

        setToasts((prev) => [...prev, newToast]);

        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
    }, [removeToast]);



    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed top-4 right-4 z-[100] flex flex-col gap-1 w-full max-w-sm pointer-events-none items-end">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

/* -------------------------------------------------------------------------- */
/*                                  COMPONENT                                 */
/* -------------------------------------------------------------------------- */

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
    const icons = {
        success: "carbon:checkmark-filled",
        error: "carbon:close-filled",
        info: "carbon:information-filled",
        warning: "carbon:warning-filled",
    };

    const colors = {
        success: "text-[var(--alert-success)] border-[var(--alert-success)] bg-[var(--background-800)]",
        error: "text-[var(--alert-error)] border-[var(--alert-error)] bg-[var(--background-800)]",
        info: "text-[var(--accent-500)] border-[var(--accent-500)] bg-[var(--background-800)]",
        warning: "text-[var(--alert-warning)] border-[var(--alert-warning)] bg-[var(--background-800)]",
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            layout
            className={`
                pointer-events-auto
                flex items-center gap-3 p-4 rounded-xl border backdrop-blur-md
                shadow-lg
                ${colors[toast.type]}
            `}
        >
            <Icon icon={icons[toast.type]} className="w-5 h-5 flex-shrink-0" />
            <p className="para-lit flex-1 pt-1 font-medium">{toast.message}</p>
        </motion.div>
    );
}
