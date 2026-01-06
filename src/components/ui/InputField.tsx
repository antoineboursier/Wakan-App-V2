import React, { useState, useEffect, useRef } from 'react';
import { Icon } from "@iconify/react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    subtext?: string;
    icon?: string;
}

export function InputField({
    label,
    subtext,
    icon,
    className,
    disabled,
    value,
    onChange,
    type = 'text',
    ...props
}: InputFieldProps) {
    // État pour gérer si le champ est rempli
    const [isFilled, setIsFilled] = useState(!!value);
    const inputRef = useRef<HTMLInputElement>(null);

    // Synchroniser avec les changements de value venant de l'extérieur
    useEffect(() => {
        setIsFilled(!!value);
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsFilled(!!e.target.value);
        onChange?.(e);
    };

    // Déterminer si l'input a un comportement de picker natif
    const isPickerType = ['date', 'time', 'datetime-local', 'month', 'week', 'color'].includes(type);

    // Handler pour rendre tout le conteneur cliquable pour les pickers
    const handleContainerClick = () => {
        if (isPickerType && inputRef.current && !disabled) {
            inputRef.current.showPicker?.();
        }
    };

    // Générer la classe fictive basée sur le type d'input pour faciliter le débogage
    const getInputTypeClass = () => {
        const typeMap: Record<string, string> = {
            'text': 'input_text',
            'email': 'input_email',
            'password': 'input_password',
            'tel': 'input_phone',
            'number': 'input_number',
            'date': 'input_date',
            'time': 'input_time',
            'datetime-local': 'input_datetime',
            'month': 'input_month',
            'week': 'input_week',
            'url': 'input_url',
            'search': 'input_search',
            'color': 'input_color'
        };
        return typeMap[type] || 'input_text';
    };

    // Déterminer les classes selon l'état
    const getInputClasses = () => {
        if (disabled) {
            return {
                border: 'border-[var(--text-disabled)]',
                background: 'bg-[var(--background-800)]',
                textColor: 'text-[var(--text-disabled)]',
                placeholderColor: 'placeholder-[var(--text-disabled)]',
                iconColor: 'text-[var(--text-disabled)]'
            };
        }

        if (isFilled) {
            return {
                border: 'border-[var(--text-primary)]',
                background: 'bg-[var(--background-900)]',
                textColor: 'text-[var(--text-primary)]',
                placeholderColor: 'placeholder-[var(--text-primary)]',
                iconColor: 'text-[var(--text-primary)]'
            };
        }

        // État par défaut (pas rempli)
        return {
            border: 'border-[var(--background-500)]',
            background: 'bg-[var(--background-900)]',
            textColor: 'text-[var(--text-secondary)]',
            placeholderColor: 'placeholder-[var(--text-secondary)]',
            iconColor: 'text-[var(--text-secondary)]'
        };
    };

    const classes = getInputClasses();

    return (
        <div className={`flex flex-col w-full max-w-[400px] justify-center items-start gap-1 ${className}`}>
            {/* Label */}
            <label className="text-[var(--text-secondary)] para-lit truncate w-full">
                {label}
            </label>

            {/* Input Container */}
            <div
                onClick={handleContainerClick}
                className={`
                    ${getInputTypeClass()}
                    flex p-4 items-center gap-3 self-stretch rounded-lg border-2
                    transition-all duration-200
                    ${classes.border}
                    ${classes.background}
                    focus-within:border-[var(--text-primary)]
                    relative
                    ${isPickerType && !disabled ? 'cursor-pointer' : ''}
                `}
            >
                {/* Optional Icon */}
                {icon && (
                    <Icon
                        icon={icon}
                        className={`w-5 h-5 flex-shrink-0 transition-colors duration-200 ${classes.iconColor} ${isFilled && !disabled ? 'text-[var(--text-primary)]' : ''} ${isPickerType && !disabled ? 'pointer-events-none' : ''}`}
                    />
                )}

                {/* Actual Input - Native avec customisation CSS */}
                <input
                    ref={inputRef}
                    type={type}
                    value={value}
                    onChange={handleChange}
                    disabled={disabled}
                    className={`
                        flex-1 bg-transparent border-none outline-none 
                        ${classes.textColor}
                        ${classes.placeholderColor}
                        para-big
                        truncate
                        ${isPickerType ? 'cursor-pointer' : ''}
                        
                        /* Suppression des icônes natives (calendrier, etc.) */
                        [&::-webkit-calendar-picker-indicator]:opacity-0
                        [&::-webkit-calendar-picker-indicator]:absolute
                        [&::-webkit-calendar-picker-indicator]:inset-0
                        [&::-webkit-calendar-picker-indicator]:w-full
                        [&::-webkit-calendar-picker-indicator]:h-full
                        [&::-webkit-calendar-picker-indicator]:cursor-pointer
                        [&::-webkit-inner-spin-button]:hidden
                        [&::-webkit-outer-spin-button]:hidden
                        [&::-webkit-clear-button]:hidden
                        [&::-webkit-search-cancel-button]:hidden
                        [&::-ms-clear]:hidden
                        [&::-ms-reveal]:hidden
                        
                        /* Pour les inputs de type date/time */
                        [appearance:textfield]
                        [-webkit-appearance:none]
                        [-moz-appearance:textfield]
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
