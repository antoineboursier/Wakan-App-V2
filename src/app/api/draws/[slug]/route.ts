import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export const dynamic = 'force-dynamic'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const slug = (await params).slug
        const { searchParams } = new URL(request.url)
        const countParam = searchParams.get('count')
        const count = countParam ? parseInt(countParam, 10) : 1

        // 1. Récupérer le type de tirage
        const { data: drawType, error: typeError } = await supabase
            .from('draw_types')
            .select('id, slug, title, description, is_active')
            .eq('slug', slug)
            .single()

        if (typeError || !drawType) {
            return NextResponse.json({ error: 'Draw type not found' }, { status: 404 })
        }

        if (!drawType.is_active) {
            return NextResponse.json({ error: 'This draw type is currently inactive' }, { status: 503 })
        }

        // 2. Récupérer tous les items actifs
        const { data: items, error: itemsError } = await supabase
            .from('draw_items')
            .select('id, slug, name, short_description, long_description')
            .eq('draw_type_id', drawType.id)
            .eq('is_active', true)

        if (itemsError) {
            return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 })
        }

        if (!items || items.length === 0) {
            return NextResponse.json({ error: 'No items available for this draw' }, { status: 404 })
        }

        // 3. Tirer aléatoirement 'count' items
        const selectedItems = []
        // Copie pour éviter modification tableau original si on voulait le réutiliser
        const availableItems = [...items]

        const effectiveCount = Math.min(count, availableItems.length)

        for (let i = 0; i < effectiveCount; i++) {
            const randomIndex = Math.floor(Math.random() * availableItems.length)
            const picked = availableItems.splice(randomIndex, 1)[0]
            selectedItems.push({
                id: picked.id,
                slug: picked.slug,
                name: picked.name,
                description: picked.short_description || picked.long_description, // Fallback logic as per prompt request usually implies one, here we provide description as primary
                long_description: picked.long_description,
                short_description: picked.short_description
            })
        }

        // 4. Retourner la réponse
        // Si count=1, on garde le format { item: ... } pour compatibilité ou simplicité
        // Si count > 1, on renvoie { items: [...] }

        if (count === 1) {
            return NextResponse.json({
                draw_type: drawType.slug,
                draw_name: drawType.title,
                item: selectedItems[0]
            })
        } else {
            return NextResponse.json({
                draw_type: drawType.slug,
                draw_name: drawType.title,
                items: selectedItems
            })
        }

    } catch (error) {
        console.error(`Unexpected error in /api/draws/[slug]:`, error)
        return NextResponse.json({
            error: 'Internal server error',
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 })
    }
}
