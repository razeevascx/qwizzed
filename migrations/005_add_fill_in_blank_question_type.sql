-- Add fill_in_blank question type to questions table

-- Drop the existing constraint
ALTER TABLE questions
DROP CONSTRAINT IF EXISTS questions_question_type_check;

-- Add the updated constraint with fill_in_blank
ALTER TABLE questions
ADD CONSTRAINT questions_question_type_check
CHECK (question_type IN ('multiple_choice', 'short_answer', 'true_false', 'fill_in_blank'));
