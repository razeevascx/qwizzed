-- Qwizzed Quiz Platform Database Schema

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

-- RLS Policies for quizzes
create policy "Users can view published quizzes"
  on quizzes for select
  using (is_published = true or creator_id = auth.uid());

create policy "Users can create quizzes"
  on quizzes for insert
  with check (creator_id = auth.uid());

create policy "Users can update their own quizzes"
  on quizzes for update
  using (creator_id = auth.uid());

create policy "Users can delete their own quizzes"
  on quizzes for delete
  using (creator_id = auth.uid());

-- RLS Policies for questions
create policy "Users can view questions from accessible quizzes"
  on questions for select
  using (
    exists (
      select 1 from quizzes
      where quizzes.id = questions.quiz_id
      and (quizzes.is_published = true or quizzes.creator_id = auth.uid())
    )
  );

create policy "Users can create questions for their quizzes"
  on questions for insert
  with check (
    exists (
      select 1 from quizzes
      where quizzes.id = questions.quiz_id
      and quizzes.creator_id = auth.uid()
    )
  );

create policy "Users can update questions in their quizzes"
  on questions for update
  using (
    exists (
      select 1 from quizzes
      where quizzes.id = questions.quiz_id
      and quizzes.creator_id = auth.uid()
    )
  );

create policy "Users can delete questions from their quizzes"
  on questions for delete
  using (
    exists (
      select 1 from quizzes
      where quizzes.id = questions.quiz_id
      and quizzes.creator_id = auth.uid()
    )
  );

-- RLS Policies for question options
create policy "Users can view options from accessible questions"
  on question_options for select
  using (
    exists (
      select 1 from questions
      join quizzes on quizzes.id = questions.quiz_id
      where questions.id = question_options.question_id
      and (quizzes.is_published = true or quizzes.creator_id = auth.uid())
    )
  );

create policy "Users can manage options for their quiz questions"
  on question_options for insert
  with check (
    exists (
      select 1 from questions
      join quizzes on quizzes.id = questions.quiz_id
      where questions.id = question_options.question_id
      and quizzes.creator_id = auth.uid()
    )
  );

create policy "Users can delete options from their questions"
  on question_options for delete
  using (
    exists (
      select 1 from questions
      join quizzes on quizzes.id = questions.quiz_id
      where questions.id = question_options.question_id
      and quizzes.creator_id = auth.uid()
    )
  );

-- RLS Policies for quiz submissions
create policy "Users can view their own submissions"
  on quiz_submissions for select
  using (user_id = auth.uid());

create policy "Users can create submissions for published quizzes"
  on quiz_submissions for insert
  with check (
    user_id = auth.uid()
    and exists (
      select 1 from quizzes
      where quizzes.id = quiz_submissions.quiz_id
      and quizzes.is_published = true
    )
  );

-- RLS Policies for quiz answers
create policy "Users can view their own answers"
  on quiz_answers for select
  using (
    exists (
      select 1 from quiz_submissions
      where quiz_submissions.id = quiz_answers.submission_id
      and quiz_submissions.user_id = auth.uid()
    )
  );

create policy "Users can save answers for their submissions"
  on quiz_answers for insert
  with check (
    exists (
      select 1 from quiz_submissions
      where quiz_submissions.id = quiz_answers.submission_id
      and quiz_submissions.user_id = auth.uid()
    )
  );
