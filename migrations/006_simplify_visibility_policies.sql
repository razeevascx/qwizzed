-- Simplify RLS policies to only support public and private visibility

-- First, ensure visibility column exists with default value
ALTER TABLE quizzes
ADD COLUMN IF NOT EXISTS visibility text DEFAULT 'public';

-- Update any NULL values to 'public'
UPDATE quizzes SET visibility = 'public' WHERE visibility IS NULL;

-- Update the visibility column constraint to only allow public/private
ALTER TABLE quizzes
DROP CONSTRAINT IF EXISTS quizzes_visibility_check;

ALTER TABLE quizzes
ADD CONSTRAINT quizzes_visibility_check
CHECK (visibility IN ('public', 'private'));

-- Drop all existing quiz policies
DROP POLICY IF EXISTS "Anyone can view public quizzes" ON quizzes;
DROP POLICY IF EXISTS "Users can view accessible quizzes" ON quizzes;
DROP POLICY IF EXISTS "Users can view published quizzes" ON quizzes;
DROP POLICY IF EXISTS "Users can create quizzes" ON quizzes;
DROP POLICY IF EXISTS "Users can update their own quizzes" ON quizzes;
DROP POLICY IF EXISTS "Users can delete their own quizzes" ON quizzes;

-- Recreate simplified policies (without quiz_invitations dependency for now)
CREATE POLICY "Anyone can view public quizzes"
  ON quizzes FOR SELECT
  USING (
    (visibility = 'public' AND is_published = true)
    OR creator_id = auth.uid()
  );

CREATE POLICY "Users can create quizzes"
  ON quizzes FOR INSERT
  WITH CHECK (creator_id = auth.uid());

CREATE POLICY "Users can update their own quizzes"
  ON quizzes FOR UPDATE
  USING (creator_id = auth.uid());

CREATE POLICY "Users can delete their own quizzes"
  ON quizzes FOR DELETE
  USING (creator_id = auth.uid());

-- Update questions policies
DROP POLICY IF EXISTS "Users can view questions from accessible quizzes" ON questions;

CREATE POLICY "Users can view questions from accessible quizzes"
  ON questions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM quizzes
      WHERE quizzes.id = questions.quiz_id
      AND (
        (quizzes.visibility = 'public' AND quizzes.is_published = true)
        OR quizzes.creator_id = auth.uid()
      )
    )
  );

-- Update question_options policies
DROP POLICY IF EXISTS "Users can view options from accessible questions" ON question_options;

CREATE POLICY "Users can view options from accessible questions"
  ON question_options FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM questions
      JOIN quizzes ON quizzes.id = questions.quiz_id
      WHERE questions.id = question_options.question_id
      AND (
        (quizzes.visibility = 'public' AND quizzes.is_published = true)
        OR quizzes.creator_id = auth.uid()
      )
    )
  );

-- Update submissions policies
DROP POLICY IF EXISTS "Users can create submissions for accessible quizzes" ON quiz_submissions;
DROP POLICY IF EXISTS "Users can create submissions for published quizzes" ON quiz_submissions;

CREATE POLICY "Users can create submissions for accessible quizzes"
  ON quiz_submissions FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM quizzes
      WHERE quizzes.id = quiz_submissions.quiz_id
      AND quizzes.visibility = 'public'
      AND quizzes.is_published = true
    )
  );
