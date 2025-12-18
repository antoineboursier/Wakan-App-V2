"use client";

import { useState, useEffect } from "react";

export function useEntitlements() {
    // Mock V1: User is not premium
    // Later: Fetch from Supabase or RevenueCat
    const [isPremium, setIsPremium] = useState(false);

    return { isPremium };
}
