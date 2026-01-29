"use client";

import { useState, useEffect } from 'react';
import { UserProfileData, UserBirthData } from '@/types/astral';
import { createClient } from '@/utils/supabase/client';

// État initial vide
const DEFAULT_PROFILE: UserProfileData = {
    firstName: undefined,
    lastName: undefined,
    email: undefined,
    wakanId: undefined,
    birthData: {
        date: undefined,
        time: undefined,
        place: undefined
    }
};

export function useUserProfile() {
    const supabase = createClient();
    const [profile, setProfile] = useState<UserProfileData>(DEFAULT_PROFILE);
    const [isLoaded, setIsLoaded] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);

    // 1. Load from Supabase on mount
    useEffect(() => {
        let mounted = true;

        async function fetchProfile() {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    setUserId(user.id);

                    const { data: profileData, error } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', user.id)
                        .single();

                    if (profileData && mounted) {
                        setProfile({
                            firstName: profileData.first_name || undefined,
                            lastName: profileData.last_name || undefined,
                            email: profileData.email || undefined,
                            wakanId: profileData.wakan_id || undefined,
                            birthData: {
                                date: profileData.birth_date || undefined,
                                time: profileData.birth_time || undefined,
                                place: (profileData.birth_city || profileData.birth_country) ? {
                                    city: profileData.birth_city || '',
                                    country: profileData.birth_country || ''
                                } : undefined
                            }
                        });
                    }
                }
            } catch (e) {
                console.error("Failed to load user profile", e);
            } finally {
                if (mounted) setIsLoaded(true);
            }
        }

        fetchProfile();

        return () => { mounted = false; };
    }, []);

    // 2. Local State Updaters
    const updateProfile = (updates: Partial<UserProfileData>) => {
        setProfile(prev => ({ ...prev, ...updates }));
    };

    const updateBirthData = (data: Partial<UserBirthData>) => {
        setProfile(prev => {
            const currentBirth = prev.birthData || {};
            const newBirth = { ...currentBirth, ...data };
            return { ...prev, birthData: newBirth };
        });
    };

    // 3. Persistence Methods (Supabase)
    const saveProfile = async (updates: Partial<UserProfileData>) => {
        if (!userId) return false;

        try {
            const dbUpdates: any = {};
            if (updates.firstName !== undefined) dbUpdates.first_name = updates.firstName;
            if (updates.lastName !== undefined) dbUpdates.last_name = updates.lastName;

            // Only update if there are changes
            if (Object.keys(dbUpdates).length === 0) return true;

            const { error } = await supabase
                .from('profiles')
                .update(dbUpdates)
                .eq('id', userId);

            if (error) throw error;
            return true;
        } catch (e) {
            console.error("Failed to save user profile", e);
            return false;
        }
    };

    const saveBirthData = async (data: Partial<UserBirthData>) => {
        if (!userId) return false;

        try {
            const dbUpdates: any = {};
            if (data.date !== undefined) dbUpdates.birth_date = data.date;
            if (data.time !== undefined) dbUpdates.birth_time = data.time;
            if (data.place !== undefined) {
                dbUpdates.birth_city = data.place.city;
                dbUpdates.birth_country = data.place.country;
            }

            // Only update if there are changes
            if (Object.keys(dbUpdates).length === 0) return true;

            const { error } = await supabase
                .from('profiles')
                .update(dbUpdates)
                .eq('id', userId);

            if (error) throw error;
            return true;
        } catch (e) {
            console.error("Failed to save birth data", e);
            return false;
        }
    };

    const clearProfile = async () => {
        setProfile(DEFAULT_PROFILE);
        await supabase.auth.signOut();
        window.location.reload();
    };

    return {
        profile,
        isLoaded,
        updateProfile,     // Updates local state only
        saveProfile,       // Persists to DB
        updateBirthData,   // Updates local state only
        saveBirthData,     // Persists to DB
        clearProfile,
        // Helpers
        hasName: !!profile.firstName,
        hasBirthDate: !!profile.birthData?.date,
        hasBirthTime: !!profile.birthData?.time,
        hasBirthPlace: !!profile.birthData?.place,
    };
}
