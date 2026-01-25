// Quiz platform types
export interface Quiz {
  id: string;
  title: string;
  description: string;
  creator_id: string;
  created_at: string;
  updated_at: string;
  is_published: boolean;
  total_questions: number;
  time_limit_minutes: number | null;
  difficulty_level: "easy" | "medium" | "hard";
  category: string;
}

export interface Question {
  id: string;
  quiz_id: string;
  question_text: string;
  question_type: "multiple_choice" | "short_answer" | "true_false";
  order: number;
  created_at: string;
  updated_at: string;
}

export interface QuestionOption {
  id: string;
  question_id: string;
  option_text: string;
  is_correct: boolean;
  order: number;
  created_at: string;
}

export interface QuizSubmission {
  id: string;
  quiz_id: string;
  user_id: string;
  submitted_at: string;
  score: number;
  total_points: number;
  status: "in_progress" | "submitted" | "graded";
}

export interface QuizAnswer {
  id: string;
  submission_id: string;
  question_id: string;
  user_answer: string;
  is_correct: boolean;
  points_earned: number;
  created_at: string;
}

// Form types
export interface CreateQuizInput {
  title: string;
  description: string;
  difficulty_level: "easy" | "medium" | "hard";
  category: string;
  time_limit_minutes: number | null;
}

export interface CreateQuestionInput {
  question_text: string;
  question_type: "multiple_choice" | "short_answer" | "true_false";
  options?: {
    option_text: string;
    is_correct: boolean;
  }[];
}

export interface SubmitAnswerInput {
  question_id: string;
  user_answer: string;
}

// Update types
export interface UpdateQuizInput extends Partial<CreateQuizInput> {
  is_published?: boolean;
  total_questions?: number;
}
