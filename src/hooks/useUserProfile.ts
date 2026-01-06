"use client";

import { useState, useEffect } from 'react';
import { UserProfileData, UserBirthData } from '@/types/astral';

const STORAGE_KEY = 'wakan_user_profile';

// État initial vide
const DEFAULT_PROFILE: UserProfileData = {
    firstName: undefined,
    lastName: undefined,
    birthData: {
        date: undefined,
        time: undefined,
        place: undefined
    }
};

export function useUserProfile() {
    const [profile, setProfile] = useState<UserProfileData>(DEFAULT_PROFILE);
    const [isLoaded, setIsLoaded] = useState(false);

    // 1. Load from storage on mount
    useEffect(() => {
        try {
            const stored = window.localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setProfile(JSON.parse(stored));
            }
        } catch (e) {
            console.error("Failed to load user profile", e);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    // 2. Save to storage on change
    const updateProfile = (updates: Partial<UserProfileData>) => {
        setProfile(prev => {
            const newVal = { ...prev, ...updates };
            // Deep merge pour birthData si nécessaire, mais pour l'instant simple merge top level
            // Si on update birthData partiel, il faut faire attention.
            if (updates.birthData && prev.birthData) {
                newVal.birthData = { ...prev.birthData, ...updates.birthData };
            }

            try {
                window.localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal));
            } catch (e) {
                console.error("Failed to save user profile", e);
            }
            return newVal;
        });
    };

    const updateBirthData = (data: Partial<UserBirthData>) => {
        setProfile(prev => {
            const currentBirth = prev.birthData || {};
            const newBirth = { ...currentBirth, ...data };
            const newVal = { ...prev, birthData: newBirth };

            try {
                window.localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal));
            } catch (e) {
                console.error("Failed to save birth data", e);
            }
            return newVal;
        });
    };

    const clearProfile = () => {
        setProfile(DEFAULT_PROFILE);
        window.localStorage.removeItem(STORAGE_KEY);
    };

    return {
        profile,
        isLoaded,
        updateProfile,
        updateBirthData,
        clearProfile,
        // Helpers
        hasName: !!profile.firstName,
        hasBirthDate: !!profile.birthData?.date,
        hasBirthTime: !!profile.birthData?.time,
        hasBirthPlace: !!profile.birthData?.place,
    };
}
