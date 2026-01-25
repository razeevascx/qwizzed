-- Quiz Invitations table
CREATE TABLE IF NOT EXISTS quiz_invitations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_id uuid NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  inviter_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invitee_email text NOT NULL,
  invitee_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  invited_at timestamp WITH time zone DEFAULT timezone('utc'::text, now()),
  responded_at timestamp WITH time zone,
  created_at timestamp WITH time zone DEFAULT timezone('utc'::text, now())
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_quiz_invitations_quiz_id ON quiz_invitations(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_invitations_invitee_email ON quiz_invitations(invitee_email);
CREATE INDEX IF NOT EXISTS idx_quiz_invitations_invitee_id ON quiz_invitations(invitee_id);
CREATE INDEX IF NOT EXISTS idx_quiz_invitations_status ON quiz_invitations(status);

-- Enable RLS
ALTER TABLE quiz_invitations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for quiz invitations
CREATE POLICY "Quiz owners can create invitations"
  ON quiz_invitations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM quizzes
      WHERE quizzes.id = quiz_invitations.quiz_id
      AND quizzes.creator_id = auth.uid()
    )
  );

CREATE POLICY "Users can view their invitations"
  ON quiz_invitations FOR SELECT
  USING (
    invitee_id = auth.uid()
    OR inviter_id = auth.uid()
  );

CREATE POLICY "Invitees can update their invitation status"
  ON quiz_invitations FOR UPDATE
  USING (
    invitee_id = auth.uid()
  );

CREATE POLICY "Quiz owners can delete invitations"
  ON quiz_invitations FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM quizzes
      WHERE quizzes.id = quiz_invitations.quiz_id
      AND quizzes.creator_id = auth.uid()
    )
  );

-- Update quizzes RLS policy to allow invited users
DROP POLICY IF EXISTS "Users can view accessible quizzes" ON quizzes;

CREATE POLICY "Users can view accessible quizzes"
  ON quizzes FOR SELECT
  USING (
    visibility = 'public'
    OR visibility = 'unlisted'
    OR creator_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM quiz_invitations
      WHERE quiz_invitations.quiz_id = quizzes.id
      AND quiz_invitations.status = 'accepted'
      AND quiz_invitations.invitee_id = auth.uid()
    )
  );

-- Update questions RLS policy to include invited users
DROP POLICY IF EXISTS "Users can view questions from accessible quizzes" ON questions;

CREATE POLICY "Users can view questions from accessible quizzes"
  ON questions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM quizzes
      WHERE quizzes.id = questions.quiz_id
      AND (
        quizzes.visibility IN ('public', 'unlisted')
        OR quizzes.creator_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM quiz_invitations
          WHERE quiz_invitations.quiz_id = quizzes.id
          AND quiz_invitations.status = 'accepted'
          AND (
            quiz_invitations.invitee_id = auth.uid()
            OR quiz_invitations.invitee_email = (SELECT email FROM auth.users WHERE id = auth.uid())
          )quiz_invitations.invitee_id = auth.uid(
  );

-- Update submissions RLS policy to include invited users
DROP POLICY IF EXISTS "Users can create submissions for accessible quizzes" ON quiz_submissions;

CREATE POLICY "Users can create submissions for accessible quizzes"
  ON quiz_submissions FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM quizzes
      WHERE quizzes.id = quiz_submissions.quiz_id
      AND (
        quizzes.visibility IN ('public', 'unlisted')
        OR EXISTS (
          SELECT 1 FROM quiz_invitations
          WHERE quiz_invitations.quiz_id = quizzes.id
          AND quiz_invitations.status = 'accepted'
          AND (
            quiz_invitations.invitee_id = auth.uid()
            OR quiz_invitations.invitee_email = (SELECT email FROM auth.users WHERE id = auth.uid())
          )quiz_invitations.invitee_id = auth.uid(
  );
