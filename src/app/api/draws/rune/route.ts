import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Empêcher la mise en cache de cette route pour garantir l'aléatoire
export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        // 1. Récupérer le type de tirage "rune"
        const { data: drawType, error: typeError } = await supabase
            .from('draw_types')
            .select('id, slug, name, description, is_active')
            .eq('slug', 'rune')
            .single()

        if (typeError || !drawType) {
            console.error('Error fetching draw type:', typeError)
            return NextResponse.json({ error: 'Draw type not found' }, { status: 404 })
        }

        if (!drawType.is_active) {
            return NextResponse.json({ error: 'This draw type is currently inactive' }, { status: 503 })
        }

        // 2. Récupérer tous les items actifs pour ce tirage
        // Pour une grosse table, on ferait un count + offset aléatoire,
        // mais pour 24 runes, tout charger en mémoire est négligeable et plus simple.
        const { data: items, error: itemsError } = await supabase
            .from('draw_items')
            .select('id, slug, name, short_description, long_description')
            .eq('draw_type_id', drawType.id)
            .eq('is_active', true)

        if (itemsError) {
            console.error('Error fetching draw items:', itemsError)
            return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 })
        }

        if (!items || items.length === 0) {
            return NextResponse.json({ error: 'No items available for this draw' }, { status: 404 })
        }

        // 3. Tirer une rune aléatoirement
        const randomIndex = Math.floor(Math.random() * items.length)
        const selectedItem = items[randomIndex]

        // 4. Retourner la réponse formattée
        return NextResponse.json({
            draw_type: drawType.slug, // 'rune'
            draw_name: drawType.name,
            item: {
                id: selectedItem.id,
                slug: selectedItem.slug,
                name: selectedItem.name,
                description: selectedItem.short_description,
                long_description: selectedItem.long_description
            }
        })

    } catch (error) {
        console.error('Unexpected error in /api/draws/rune:', error)
        return NextResponse.json({
            error: 'Internal server error',
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 })
    }
}
