'use server'

import { createClient } from "@supabase/supabase-js";
import { DrawType, DrawTypeFormData, DrawPositionFormData } from "@/types/draws";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Initialize Supabase Admin Client (Service Role) specifically for Server Actions if needed, 
// OR use standard client if RLS allows. 
// Assuming standard client pattern for Next.js App Router for now, 
// BUT for Admin BO usually we might need Service Role or RLS policies for an 'admin' role.
// Since User didn't specify strict Auth implementation details other than "supposed already in place",
// I will use `createClient` with Env vars. Ideally this should use `createClient` from `@supabase/ssr` with cookies
// for proper auth context, but for MVP standard direct connection or simple check usually works if Env vars are Service Role.
// CAUTION: Using Service Role Key in 'createClient' here implies we trust the caller (Server Action).
// We should arguably check auth. usersession.

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // BO implies privileged access
const supabase = createClient(supabaseUrl, supabaseKey);

// --- DRAW TYPES ---

export async function getDrawTypes(): Promise<DrawType[]> {
    const { data, error } = await supabase
        .from('draw_types')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
}

export async function getDrawType(id: string): Promise<DrawType | null> {
    const { data, error } = await supabase
        .from('draw_types')
        .select('*, positions:draw_positions(*), items:draw_items(*)') // Fetch positions and items via relation
        .eq('id', id)
        .single();

    if (error) return null;

    // Order positions by index
    if (data.positions) {
        data.positions.sort((a: any, b: any) => a.position_index - b.position_index);
    }

    return data;
}

export async function createDrawType(formData: DrawTypeFormData) {
    const { data, error } = await supabase
        .from('draw_types')
        .insert([{
            ...formData,
            is_active: formData.is_active ?? false // Ensure explicit boolean
        }])
        .select()
        .single();

    if (error) throw new Error(error.message);

    revalidatePath('/admin/draw-types');
    return data;
}

export async function updateDrawType(id: string, formData: Partial<DrawTypeFormData>) {
    const { data, error } = await supabase
        .from('draw_types')
        .update(formData)
        .eq('id', id)
        .select()
        .single();

    if (error) throw new Error(error.message);

    revalidatePath('/admin/draw-types');
    revalidatePath(`/admin/draw-types/${id}`);
    return data;
}

export async function deleteDrawType(id: string) {
    const { error } = await supabase
        .from('draw_types')
        .delete()
        .eq('id', id);

    if (error) throw new Error(error.message);

    revalidatePath('/admin/draw-types');
}

// --- DRAW POSITIONS ---

export async function addDrawPosition(drawTypeId: string, formData: DrawPositionFormData) {
    const { data, error } = await supabase
        .from('draw_positions')
        .insert([{ ...formData, draw_type_id: drawTypeId }])
        .select()
        .single();

    if (error) throw new Error(error.message);

    revalidatePath(`/admin/draw-types/${drawTypeId}`);
    return data;
}

export async function updateDrawPosition(id: string, drawTypeId: string, formData: Partial<DrawPositionFormData>) {
    const { data, error } = await supabase
        .from('draw_positions')
        .update(formData)
        .eq('id', id)
        .select()
        .single();

    if (error) throw new Error(error.message);

    revalidatePath(`/admin/draw-types/${drawTypeId}`);
    return data;
}

export async function deleteDrawPosition(id: string, drawTypeId: string) {
    const { error } = await supabase
        .from('draw_positions')
        .delete()
        .eq('id', id);

    if (error) throw new Error(error.message);

    revalidatePath(`/admin/draw-types/${drawTypeId}`);
}

export async function reorderDrawPositions(drawTypeId: string, orderedIds: string[]) {
    // Naive reorder: update each item with new index
    // For 3 items, this is fine. For 100, we'd use a batch RPC or transaction.

    const updates = orderedIds.map((id, index) =>
        supabase.from('draw_positions').update({ position_index: index }).eq('id', id)
    );

    await Promise.all(updates);
    revalidatePath(`/admin/draw-types/${drawTypeId}`);
}
// --- DRAW ITEMS ---

export async function addDrawItem(drawTypeId: string, formData: any) {
    // Basic validation of slug unicity per draw type could be done here or relied on DB constraint
    const { data, error } = await supabase
        .from('draw_items')
        .insert([{ ...formData, draw_type_id: drawTypeId }])
        .select()
        .single();

    if (error) throw new Error(error.message);

    revalidatePath(`/admin/draw-types/${drawTypeId}`);
    return data;
}

// Check if a slug already exists for draw_items (global check)
export async function checkItemSlugExists(slug: string, excludeId?: string): Promise<boolean> {
    let query = supabase
        .from('draw_items')
        .select('id')
        .eq('slug', slug);

    if (excludeId) {
        query = query.neq('id', excludeId);
    }

    const { data, error } = await query.limit(1);

    if (error) {
        console.error('Error checking slug:', error);
        return false;
    }

    return (data && data.length > 0);
}

// Check if a slug already exists for draw_types
export async function checkDrawTypeSlugExists(slug: string, excludeId?: string): Promise<boolean> {
    let query = supabase
        .from('draw_types')
        .select('id')
        .eq('slug', slug);

    if (excludeId) {
        query = query.neq('id', excludeId);
    }

    const { data, error } = await query.limit(1);

    if (error) {
        console.error('Error checking slug:', error);
        return false;
    }

    return (data && data.length > 0);
}

export async function updateDrawItem(id: string, drawTypeId: string, formData: any) {
    const { data, error } = await supabase
        .from('draw_items')
        .update(formData)
        .eq('id', id)
        .select()
        .single();

    if (error) throw new Error(error.message);

    revalidatePath(`/admin/draw-types/${drawTypeId}`);
    return data;
}

export async function deleteDrawItem(id: string, drawTypeId: string) {
    const { error } = await supabase
        .from('draw_items')
        .delete()
        .eq('id', id);

    if (error) throw new Error(error.message);

    revalidatePath(`/admin/draw-types/${drawTypeId}`);
}

export async function bulkCreateDrawItems(drawTypeId: string, items: any[]) {
    // Add draw_type_id to each item
    const itemsToInsert = items.map(item => ({
        ...item,
        draw_type_id: drawTypeId,
        // Ensure critical fields are present
        slug: item.slug || item.name.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-'),
        is_active: item.is_active ?? true
    }));

    const { data, error } = await supabase
        .from('draw_items')
        .insert(itemsToInsert)
        .select();

    if (error) throw new Error(error.message);

    revalidatePath(`/admin/draw-types/${drawTypeId}`);
    return data;
}

export async function uploadImage(formData: FormData): Promise<string> {
    const file = formData.get('file') as File;
    if (!file) throw new Error("Aucun fichier fourni");

    console.log(`[Upload] Starting upload for file: ${file.name}, size: ${file.size}, type: ${file.type}`);

    // Standardize file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${fileName}`;


    // Upload to 'draw-images' bucket
    const { error: uploadError } = await supabase.storage
        .from('draw-images')
        .upload(filePath, file);

    if (uploadError) {
        console.error("Upload error:", uploadError);
        throw new Error("Erreur lors de l'upload: " + uploadError.message);
    }

    const { data: { publicUrl } } = supabase.storage
        .from('draw-images')
        .getPublicUrl(filePath);

    return publicUrl;
}
