"use client";

import React, { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import { InputField } from "./InputField";

/* -------------------------------------------------------------------------- */
/*                                    TYPES                                   */
/* -------------------------------------------------------------------------- */

export interface CityResult {
    id: number;
    name: string;
    country: string;
    latitude: number;
    longitude: number;
    timezone: string;
    admin1?: string; // Region/State
}

interface CityAutocompleteProps {
    label: string;
    value?: string; // Display string (e.g. "Paris, France")
    onSelect: (city: CityResult) => void;
    placeholder?: string;
    icon?: string;
    subtext?: string;
}

/* -------------------------------------------------------------------------- */
/*                                  COMPONENT                                 */
/* -------------------------------------------------------------------------- */

export function CityAutocomplete({
    label,
    value,
    onSelect,
    placeholder = "Rechercher une ville...",
    icon = "solar:map-point-linear",
    subtext,
}: CityAutocompleteProps) {
    const [query, setQuery] = useState(value || "");
    const [results, setResults] = useState<CityResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Sync internal query with external value if it changes cleanly
    // (Optional: depending on UX preference, might annoy user if typing)
    useEffect(() => {
        if (value) {
            setQuery(value);
            setIsOpen(false);
        }
    }, [value]);

    // Click outside to close
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Debounce search
    useEffect(() => {
        const fetchCities = async () => {
            if (!query || query.length < 3) {
                setResults([]);
                return;
            }

            // Don't search if query matches exactly what we just validated (simple heuristic)
            // Actually, we usually want to search unless we just selected.
            // Let's iterate: simple debounce.

            setIsLoading(true);
            try {
                const response = await fetch(
                    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=fr&format=json`
                );
                const data = await response.json();

                if (data.results) {
                    setResults(data.results);
                    // Only open if the user has focused the input (avoids opening on initial load)
                    if (document.activeElement && wrapperRef.current?.contains(document.activeElement)) {
                        setIsOpen(true);
                    }
                } else {
                    setResults([]);
                }
            } catch (error) {
                console.error("City search error:", error);
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        };

        const timeoutId = setTimeout(() => {
            // Only fetch if user is typing and not just viewing existing value (heuristic needed?)
            // If the query is exactly the passed 'value', we assumes it's settled.
            // But 'value' prop might update AFTER selection.
            // Let's just fetch if focused? wrapperRef doesn't tell us about focus easily on input.
            // We'll rely on isOpen logic: if user types, isOpen becomes true.
            fetchCities();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [query]);

    const handleSelect = (city: CityResult) => {
        setQuery(`${city.name}, ${city.country}`);
        setIsOpen(false);
        onSelect(city);
    };

    return (
        <div className="relative w-full" ref={wrapperRef}>
            <InputField
                label={label}
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    if (!isOpen) setIsOpen(true);
                }}
                onFocus={() => {
                    if (query.length >= 3) setIsOpen(true);
                }}
                placeholder={placeholder}
                icon={icon}
                subtext={subtext}
                autoComplete="off"
            />

            {/* Loading Indicator inside input? Or just dropdown */}

            {/* Dropdown Results */}
            {isOpen && (results.length > 0 || isLoading) && (
                <div className="absolute z-50 w-full mt-1 bg-[var(--background-800)] border border-[var(--background-500)] rounded-lg shadow-xl overflow-hidden backdrop-blur-md max-h-60 overflow-y-auto">
                    {isLoading && results.length === 0 && (
                        <div className="p-3 text-[var(--text-tertiary)] text-center para-lit">
                            Recherche...
                        </div>
                    )}

                    {results.map((city) => (
                        <button
                            key={city.id}
                            className="w-full text-left p-3 hover:bg-[var(--background-600)] transition-colors border-b border-[var(--background-500)] last:border-0 flex flex-col gap-0.5"
                            onClick={() => handleSelect(city)}
                        >
                            <span className="para text-[var(--text-primary)] font-medium">
                                {city.name}
                            </span>
                            <span className="para-lit text-[var(--text-tertiary)]">
                                {city.admin1 ? `${city.admin1}, ` : ''}{city.country}
                            </span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
