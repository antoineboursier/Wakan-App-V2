import { createClient } from "@supabase/supabase-js";
import { Database } from "./types";

export type { Database };

// Client pour un usage côté serveur ou client générique
export const createSupabaseClient = (supabaseUrl: string, supabaseKey: string) => {
    return createClient<Database>(supabaseUrl, supabaseKey);
};
