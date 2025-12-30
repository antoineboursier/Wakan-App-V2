-- Add new columns to quizzes table
ALTER TABLE quizzes 
ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS btn_label TEXT DEFAULT 'Commencer le quiz',
ADD COLUMN IF NOT EXISTS btn_icon TEXT DEFAULT 'mdi:play-circle-outline';

-- Update types for existing rows if needed (optional, default handles new rows)
-- We might want to set published_at to created_at for existing rows if not null, or leave null.
-- Leaving null implies not published or legacy. Let's strictly follow the request: just add columns.
