-- Add visibility field to quizzes table
ALTER TABLE quizzes
ADD COLUMN visibility text DEFAULT 'private'
CHECK (visibility IN ('public', 'private', 'unlisted'));

-- Create index for visibility
CREATE INDEX IF NOT EXISTS idx_quizzes_visibility ON quizzes(visibility);

-- Update existing RLS policy for quizzes to include visibility
DROP POLICY IF EXISTS "Users can view published quizzes" ON quizzes;

CREATE POLICY "Users can view accessible quizzes"
  ON quizzes FOR SELECT
  USING (
    visibility = 'public'
    OR visibility = 'unlisted'
    OR creator_id = auth.uid()
  );

-- Update RLS policy for questions to use visibility
DROP POLICY IF EXISTS "Users can view questions from accessible quizzes" ON questions;

CREATE POLICY "Users can view questions from accessible quizzes"
  ON questions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM quizzes
      WHERE quizzes.id = questions.quiz_id
      AND (quizzes.visibility IN ('public', 'unlisted') OR quizzes.creator_id = auth.uid())
    )
  );

-- Update RLS policy for question options
DROP POLICY IF EXISTS "Users can view options from accessible questions" ON question_options;

CREATE POLICY "Users can view options from accessible questions"
  ON question_options FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM questions
      JOIN quizzes ON quizzes.id = questions.quiz_id
      WHERE questions.id = question_options.question_id
      AND (quizzes.visibility IN ('public', 'unlisted') OR quizzes.creator_id = auth.uid())
    )
  );

-- Update RLS policy for submissions
DROP POLICY IF EXISTS "Users can create submissions for published quizzes" ON quiz_submissions;

CREATE POLICY "Users can create submissions for accessible quizzes"
  ON quiz_submissions FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM quizzes
      WHERE quizzes.id = quiz_submissions.quiz_id
      AND quizzes.visibility IN ('public', 'unlisted')
    )
  );
