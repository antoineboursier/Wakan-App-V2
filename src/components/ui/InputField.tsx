import React from 'react';
import { Icon } from "@iconify/react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    subtext?: string;
    icon?: string;
}

export function InputField({ label, subtext, icon, className, disabled, ...props }: InputFieldProps) {
    return (
        <div className={`flex flex-col w-full max-w-[400px] justify-center items-start gap-1 ${className}`}>
            {/* Label */}
            <label className="text-[var(--text-secondary)] para-lit truncate w-full">
                {label}
            </label>

            {/* Input Container */}
            <div
                className={`
                    flex p-4 items-center gap-1 self-stretch rounded-lg border-2 
                    transition-colors duration-200
                    ${disabled
                        ? 'border-transparent bg-transparent' // Disabled State
                        : 'border-[var(--background-500)] bg-[var(--background-900)] focus-within:bg-[var(--background-900)]' // Default & Filled
                    }
                `}
            >
                {/* Optional Icon */}
                {icon && (
                    <Icon icon={icon} className="text-[var(--text-tertiary)] w-5 h-5 flex-shrink-0" />
                )}

                {/* Actual Input */}
                <input
                    disabled={disabled}
                    className={`
                        flex-1 bg-transparent border-none outline-none 
                        text-[var(--text-primary)] placeholder-[var(--text-tertiary)] ui-button-text
                        truncate
                        disabled:text-[var(--text-disabled)] disabled:placeholder-[var(--text-disabled)]
                    `}
                    {...props}
                />
            </div>

            {/* Subtext */}
            {subtext && (
                <span className="text-[var(--text-tertiary)] para pl-3">
                    {subtext}
                </span>
            )}
        </div>
    );
}
