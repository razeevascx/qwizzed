-- Qwizzed Quiz Platform Database Schema (Consolidated)

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Quizzes table
create table if not exists quizzes (
  id uuid primary key default uuid_generate_v4(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text not null,
  is_published boolean default false,
  total_questions integer default 0,
  time_limit_minutes integer,
  difficulty_level text default 'medium' check (difficulty_level in ('easy', 'medium', 'hard')),
  category text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Questions table
create table if not exists questions (
  id uuid primary key default uuid_generate_v4(),
  quiz_id uuid not null references quizzes(id) on delete cascade,
  question_text text not null,
  question_type text not null check (question_type in ('multiple_choice', 'short_answer', 'true_false', 'fill_in_blank')),
  "order" integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Question Options table
create table if not exists question_options (
  id uuid primary key default uuid_generate_v4(),
  question_id uuid not null references questions(id) on delete cascade,
  option_text text not null,
  is_correct boolean default false,
  "order" integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Quiz Submissions table
create table if not exists quiz_submissions (
  id uuid primary key default uuid_generate_v4(),
  quiz_id uuid not null references quizzes(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  submitted_at timestamp with time zone,
  score integer default 0,
  total_points integer default 0,
  status text default 'in_progress' check (status in ('in_progress', 'submitted', 'graded')),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Quiz Answers table
create table if not exists quiz_answers (
  id uuid primary key default uuid_generate_v4(),
  submission_id uuid not null references quiz_submissions(id) on delete cascade,
  question_id uuid not null references questions(id) on delete cascade,
  user_answer text not null,
  is_correct boolean default false,
  points_earned integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create indexes for better query performance
create index if not exists idx_quizzes_creator_id on quizzes(creator_id);
create index if not exists idx_quizzes_is_published on quizzes(is_published);
create index if not exists idx_questions_quiz_id on questions(quiz_id);
create index if not exists idx_question_options_question_id on question_options(question_id);
create index if not exists idx_quiz_submissions_quiz_id on quiz_submissions(quiz_id);
create index if not exists idx_quiz_submissions_user_id on quiz_submissions(user_id);
create index if not exists idx_quiz_answers_submission_id on quiz_answers(submission_id);

-- Enable Row Level Security (RLS)
alter table quizzes enable row level security;
alter table questions enable row level security;
alter table question_options enable row level security;
alter table quiz_submissions enable row level security;
alter table quiz_answers enable row level security;

-- Add visibility field to quizzes table (from 002)
ALTER TABLE quizzes
ADD COLUMN IF NOT EXISTS visibility text DEFAULT 'private'
CHECK (visibility IN ('public', 'private', 'unlisted'));

-- Create index for visibility
CREATE INDEX IF NOT EXISTS idx_quizzes_visibility ON quizzes(visibility);

-- Quiz Invitations table (from 003)
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

-- Enable RLS for invitations
ALTER TABLE quiz_invitations ENABLE ROW LEVEL SECURITY;

-- Note: Policies below are the final consolidated policies to avoid 'create then drop' redundancy

-- Simplify RLS policies to only support public and private visibility (from 006, replacing earlier ones)

-- First, ensure visibility column exists with default value (redundant safety check)
ALTER TABLE quizzes
DROP CONSTRAINT IF EXISTS quizzes_visibility_check;

ALTER TABLE quizzes
ADD CONSTRAINT quizzes_visibility_check
CHECK (visibility IN ('public', 'private'));

-- Drop all existing quiz policies (cleanup from hypothetical previous runs)
DROP POLICY IF EXISTS "Anyone can view public quizzes" ON quizzes;
DROP POLICY IF EXISTS "Users can view accessible quizzes" ON quizzes;
DROP POLICY IF EXISTS "Users can view published quizzes" ON quizzes;
DROP POLICY IF EXISTS "Users can create quizzes" ON quizzes;
DROP POLICY IF EXISTS "Users can update their own quizzes" ON quizzes;
DROP POLICY IF EXISTS "Users can delete their own quizzes" ON quizzes;

-- Recreate simplified policies
CREATE POLICY "Anyone can view accessible quizzes"
  ON quizzes FOR SELECT
  USING (
    (visibility = 'public' AND is_published = true)
    OR creator_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM quiz_invitations
      WHERE quiz_invitations.quiz_id = quizzes.id
      AND (
        quiz_invitations.invitee_id = auth.uid()
        OR quiz_invitations.invitee_email = auth.jwt() ->> 'email'
      )
    )
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

-- Questions Policies
DROP POLICY IF EXISTS "Users can view questions from accessible quizzes" ON questions;
DROP POLICY IF EXISTS "Users can create questions for their quizzes" ON questions;
DROP POLICY IF EXISTS "Users can update questions in their quizzes" ON questions;
DROP POLICY IF EXISTS "Users can delete questions from their quizzes" ON questions;

CREATE POLICY "Users can view questions from accessible quizzes"
  ON questions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM quizzes
      WHERE quizzes.id = questions.quiz_id
      AND (
        (quizzes.visibility = 'public' AND quizzes.is_published = true)
        OR quizzes.creator_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM quiz_invitations
          WHERE quiz_invitations.quiz_id = quizzes.id
          AND quiz_invitations.status = 'accepted'
          AND (
            quiz_invitations.invitee_id = auth.uid()
            OR quiz_invitations.invitee_email = auth.jwt() ->> 'email'
          )
        )
      )
    )
  );

CREATE POLICY "Users can create questions for their quizzes"
  ON questions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM quizzes
      WHERE quizzes.id = questions.quiz_id
      AND quizzes.creator_id = auth.uid()
    )
  );

CREATE POLICY "Users can update questions in their quizzes"
  ON questions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM quizzes
      WHERE quizzes.id = questions.quiz_id
      AND quizzes.creator_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete questions from their quizzes"
  ON questions FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM quizzes
      WHERE quizzes.id = questions.quiz_id
      AND quizzes.creator_id = auth.uid()
    )
  );

-- Question Options Policies
DROP POLICY IF EXISTS "Users can view options from accessible questions" ON question_options;
DROP POLICY IF EXISTS "Users can manage options for their quiz questions" ON question_options;
DROP POLICY IF EXISTS "Users can delete options from their questions" ON question_options;

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
        OR EXISTS (
          SELECT 1 FROM quiz_invitations
          WHERE quiz_invitations.quiz_id = quizzes.id
          AND quiz_invitations.status = 'accepted'
          AND (
            quiz_invitations.invitee_id = auth.uid()
            OR quiz_invitations.invitee_email = auth.jwt() ->> 'email'
          )
        )
      )
    )
  );

CREATE POLICY "Users can manage options for their quiz questions"
  ON question_options FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM questions
      JOIN quizzes ON quizzes.id = questions.quiz_id
      WHERE questions.id = question_options.question_id
      AND quizzes.creator_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete options from their questions"
  ON question_options FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM questions
      JOIN quizzes ON quizzes.id = questions.quiz_id
      WHERE questions.id = question_options.question_id
      AND quizzes.creator_id = auth.uid()
    )
  );

-- Quiz Invitations Policies (from 003)
DROP POLICY IF EXISTS "Quiz owners can create invitations" ON quiz_invitations;
DROP POLICY IF EXISTS "Users can view their invitations" ON quiz_invitations;
DROP POLICY IF EXISTS "Invitees can update their invitation status" ON quiz_invitations;
DROP POLICY IF EXISTS "Quiz owners can delete invitations" ON quiz_invitations;

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
    OR invitee_email = auth.jwt() ->> 'email'
  );

CREATE POLICY "Invitees can update their invitation status"
  ON quiz_invitations FOR UPDATE
  USING (
    invitee_id = auth.uid()
    OR invitee_email = auth.jwt() ->> 'email'
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

-- Submissions Policies
DROP POLICY IF EXISTS "Users can create submissions for accessible quizzes" ON quiz_submissions;
DROP POLICY IF EXISTS "Users can view their own submissions" ON quiz_submissions;
DROP POLICY IF EXISTS "Users can update their own submissions" ON quiz_submissions;

CREATE POLICY "Users can create submissions for accessible quizzes"
  ON quiz_submissions FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM quizzes
      WHERE quizzes.id = quiz_submissions.quiz_id
      AND (
        (quizzes.visibility = 'public' AND quizzes.is_published = true)
        OR quizzes.creator_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM quiz_invitations
          WHERE quiz_invitations.quiz_id = quizzes.id
          AND quiz_invitations.status = 'accepted'
          AND (
            quiz_invitations.invitee_id = auth.uid()
            OR quiz_invitations.invitee_email = auth.jwt() ->> 'email'
          )
        )
      )
    )
  );

CREATE POLICY "Users can view their own submissions"
  ON quiz_submissions FOR SELECT
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM quizzes
      WHERE quizzes.id = quiz_submissions.quiz_id
      AND quizzes.creator_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own submissions"
  ON quiz_submissions FOR UPDATE
  USING (user_id = auth.uid());

-- Answers Policies
DROP POLICY IF EXISTS "Users can view answers" ON quiz_answers;
DROP POLICY IF EXISTS "Users can save answers" ON quiz_answers;

CREATE POLICY "Users can view answers"
  ON quiz_answers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM quiz_submissions
      WHERE quiz_submissions.id = quiz_answers.submission_id
      AND quiz_submissions.user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM quiz_submissions
      JOIN quizzes ON quizzes.id = quiz_submissions.quiz_id
      WHERE quiz_submissions.id = quiz_answers.submission_id
      AND quizzes.creator_id = auth.uid()
    )
  );

CREATE POLICY "Users can save answers"
  ON quiz_answers FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM quiz_submissions
      WHERE quiz_submissions.id = quiz_answers.submission_id
      AND quiz_submissions.user_id = auth.uid()
    )
  );

-- Add fill_in_blank question type (from 005)
ALTER TABLE questions
DROP CONSTRAINT IF EXISTS questions_question_type_check;

ALTER TABLE questions
ADD CONSTRAINT questions_question_type_check
CHECK (question_type IN ('multiple_choice', 'short_answer', 'true_false', 'fill_in_blank'));

-- Add points to questions (from 007)
ALTER TABLE questions
ADD COLUMN IF NOT EXISTS points integer DEFAULT 1;

-- Add time_taken to submissions (from 007)
ALTER TABLE quiz_submissions
ADD COLUMN IF NOT EXISTS time_taken integer;

-- Add organizer_name (from 008)
ALTER TABLE quizzes
ADD COLUMN IF NOT EXISTS organizer_name text;
