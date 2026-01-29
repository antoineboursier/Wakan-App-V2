-- Rendre le champ title optionnel dans astral_modules
ALTER TABLE public.astral_modules 
ALTER COLUMN title DROP NOT NULL;
