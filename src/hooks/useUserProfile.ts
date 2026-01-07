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

    // 2. Save to Supabase on change
    const updateProfile = async (updates: Partial<UserProfileData>) => {
        // Optimistic update
        setProfile(prev => ({ ...prev, ...updates }));

        if (!userId) return;

        const dbUpdates: any = {};
        if (updates.firstName !== undefined) dbUpdates.first_name = updates.firstName;
        if (updates.lastName !== undefined) dbUpdates.last_name = updates.lastName;

        try {
            const { error } = await supabase
                .from('profiles')
                .update(dbUpdates)
                .eq('id', userId);

            if (error) throw error;
        } catch (e) {
            console.error("Failed to save user profile", e);
            // Revert state if needed, simplified here
        }
    };

    const updateBirthData = async (data: Partial<UserBirthData>) => {
        // Optimistic update
        setProfile(prev => {
            const currentBirth = prev.birthData || {};
            const newBirth = { ...currentBirth, ...data };
            return { ...prev, birthData: newBirth };
        });

        if (!userId) return;

        const dbUpdates: any = {};
        if (data.date !== undefined) dbUpdates.birth_date = data.date;
        if (data.time !== undefined) dbUpdates.birth_time = data.time;
        if (data.place !== undefined) {
            dbUpdates.birth_city = data.place.city;
            dbUpdates.birth_country = data.place.country;
        }

        try {
            const { error } = await supabase
                .from('profiles')
                .update(dbUpdates)
                .eq('id', userId);

            if (error) throw error;
        } catch (e) {
            console.error("Failed to save birth data", e);
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
