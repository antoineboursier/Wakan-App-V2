-- Add long_description to quizzes table
ALTER TABLE quizzes 
ADD COLUMN IF NOT EXISTS long_description TEXT;

-- Update existing records to have long_description same as description if needed, or leave null
-- For now we just add the column.
