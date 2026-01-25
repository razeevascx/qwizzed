-- Fix RLS policies after adding visibility field
-- This ensures all necessary policies exist

-- Drop and recreate INSERT policy for quizzes
DROP POLICY IF EXISTS "Users can create quizzes" ON quizzes;

CREATE POLICY "Users can create quizzes"
  ON quizzes FOR INSERT
  WITH CHECK (creator_id = auth.uid());

-- Drop and recreate UPDATE policy for quizzes
DROP POLICY IF EXISTS "Users can update their own quizzes" ON quizzes;

CREATE POLICY "Users can update their own quizzes"
  ON quizzes FOR UPDATE
  USING (creator_id = auth.uid());

-- Drop and recreate DELETE policy for quizzes
DROP POLICY IF EXISTS "Users can delete their own quizzes" ON quizzes;

CREATE POLICY "Users can delete their own quizzes"
  ON quizzes FOR DELETE
  USING (creator_id = auth.uid());

-- Ensure the SELECT policy includes visibility
DROP POLICY IF EXISTS "Users can view accessible quizzes" ON quizzes;
DROP POLICY IF EXISTS "Users can view published quizzes" ON quizzes;

CREATE POLICY "Users can view accessible quizzes"
  ON quizzes FOR SELECT
  USING (
    visibility = 'public'
    OR visibility = 'unlisted'
    OR creator_id = auth.uid()
  );
