-- Add short_title column to quizzes
ALTER TABLE public.quizzes 
ADD COLUMN IF NOT EXISTS short_title text;

-- Add result_display_type column to quizzes with default 'single'
ALTER TABLE public.quizzes 
ADD COLUMN IF NOT EXISTS result_display_type text DEFAULT 'single' CHECK (result_display_type IN ('single', 'multiple'));

-- Comment on columns
COMMENT ON COLUMN public.quizzes.short_title IS 'Titre raccourci pour l''affichage dans les résultats (ex: "Ta pierre du moment")';
COMMENT ON COLUMN public.quizzes.result_display_type IS 'Type d''affichage du résultat : single (une seule valeur) ou multiple (plusieurs valeurs)';