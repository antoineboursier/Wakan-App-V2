CREATE TABLE IF NOT EXISTS public.astral_modules (
    id TEXT PRIMARY KEY,
    state TEXT NOT NULL DEFAULT 'draft',
    "order" INTEGER NOT NULL DEFAULT 0,
    title TEXT NOT NULL,
    sub_title TEXT,
    short_description TEXT,
    icon TEXT,
    hero_image_url TEXT,
    background_image_url TEXT,
    features JSONB DEFAULT '[]'::jsonb,
    theme JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.astral_modules ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public modules are viewable by everyone" 
ON public.astral_modules FOR SELECT 
USING (true);

CREATE POLICY "Modules are editable by authenticated users only" 
ON public.astral_modules FOR ALL 
USING (auth.role() = 'authenticated');

-- Initial Seed for Zodiac
INSERT INTO public.astral_modules (id, state, "order", title, short_description, icon, hero_image_url, background_image_url, features, theme)
VALUES (
    'zodiac', 
    'active', 
    1, 
    'Profil Zodiac', 
    'Découvre ton signe solaire, la base de ta personnalité et de ton rayonnement.', 
    'mdi:zodiac-leo', 
    '/backgrounds/tirages.png', -- Default
    NULL,
    '["Signe du zodiaque", "Ascendant", "Élément majoritaire"]'::jsonb,
    '{"accentColor": "#FFD700", "textColor": "#FFD700"}'::jsonb
) ON CONFLICT (id) DO NOTHING;
