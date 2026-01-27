-- Add points column to questions table
ALTER TABLE questions
ADD COLUMN IF NOT EXISTS points integer DEFAULT 1;

-- Add time_taken column to quiz_submissions table
ALTER TABLE quiz_submissions
ADD COLUMN IF NOT EXISTS time_taken integer;

-- Update existing questions to have at least 1 point
UPDATE questions SET points = 1 WHERE points IS NULL;
