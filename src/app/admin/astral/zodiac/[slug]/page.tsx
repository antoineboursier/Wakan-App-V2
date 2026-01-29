import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { ZodiacSignForm } from "@/components/admin/ZodiacSignForm";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function EditZodiacSignPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value
                },
            },
        }
    );

    const { data: sign, error } = await supabase
        .from('zodiac_signs')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error || !sign) {
        console.error("Fetch error", error);
        notFound();
    }

    return (
        <div className="max-w-5xl mx-auto">
            <ZodiacSignForm sign={sign} />
        </div>
    );
}
