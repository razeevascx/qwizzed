import { createClient } from "./server";
import type {
  Quiz,
  Question,
  QuestionOption,
  QuizSubmission,
  CreateQuizInput,
  CreateQuestionInput,
} from "@/lib/types/quiz";

export class QuizService {
  static async createQuiz(
    userId: string,
    data: CreateQuizInput,
  ): Promise<Quiz> {
    const client = await createClient();

    const { data: quiz, error } = await client
      .from("quizzes")
      .insert([
        {
          creator_id: userId,
          title: data.title,
          description: data.description,
          difficulty_level: data.difficulty_level,
          category: data.category,
          time_limit_minutes: data.time_limit_minutes,
          is_published: false,
          total_questions: 0,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return quiz;
  }

  static async getQuiz(quizId: string): Promise<Quiz | null> {
    const client = await createClient();

    const { data, error } = await client
      .from("quizzes")
      .select()
      .eq("id", quizId)
      .single();

    if (error) return null;
    return data;
  }

  static async getUserQuizzes(userId: string): Promise<Quiz[]> {
    const client = await createClient();

    const { data, error } = await client
      .from("quizzes")
      .select()
      .eq("creator_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getPublishedQuizzes(): Promise<Quiz[]> {
    const client = await createClient();

    const { data, error } = await client
      .from("quizzes")
      .select("*, profiles(username, email)")
      .eq("is_published", true)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async updateQuiz(
    quizId: string,
    data: Partial<CreateQuizInput>,
  ): Promise<Quiz> {
    const client = await createClient();

    const { data: quiz, error } = await client
      .from("quizzes")
      .update(data)
      .eq("id", quizId)
      .select()
      .single();

    if (error) throw error;
    return quiz;
  }

  static async publishQuiz(quizId: string): Promise<Quiz> {
    return this.updateQuiz(quizId, { is_published: true });
  }

  static async deleteQuiz(quizId: string): Promise<void> {
    const client = await createClient();

    const { error } = await client.from("quizzes").delete().eq("id", quizId);

    if (error) throw error;
  }

  // Question operations
  static async addQuestion(
    quizId: string,
    data: CreateQuestionInput,
  ): Promise<Question> {
    const client = await createClient();

    // Get current question count
    const { count } = await client
      .from("questions")
      .select("*", { count: "exact" })
      .eq("quiz_id", quizId);

    const order = (count || 0) + 1;

    const { data: question, error } = await client
      .from("questions")
      .insert([
        {
          quiz_id: quizId,
          question_text: data.question_text,
          question_type: data.question_type,
          order: order,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // Add options if provided
    if (data.options && data.options.length > 0) {
      await this.addQuestionOptions(question.id, data.options);
    }

    // Update quiz question count
    await this.updateQuestionCount(quizId);

    return question;
  }

  static async getQuizQuestions(quizId: string): Promise<Question[]> {
    const client = await createClient();

    const { data, error } = await client
      .from("questions")
      .select()
      .eq("quiz_id", quizId)
      .order("order", { ascending: true });

    if (error) throw error;
    return data || [];
  }

  static async getQuestion(questionId: string): Promise<Question | null> {
    const client = await createClient();

    const { data, error } = await client
      .from("questions")
      .select()
      .eq("id", questionId)
      .single();

    if (error) return null;
    return data;
  }

  static async updateQuestion(
    questionId: string,
    data: Partial<CreateQuestionInput>,
  ): Promise<Question> {
    const client = await createClient();

    const { data: question, error } = await client
      .from("questions")
      .update(data)
      .eq("id", questionId)
      .select()
      .single();

    if (error) throw error;
    return question;
  }

  static async deleteQuestion(
    questionId: string,
    quizId: string,
  ): Promise<void> {
    const client = await createClient();

    const { error } = await client
      .from("questions")
      .delete()
      .eq("id", questionId);

    if (error) throw error;

    // Update quiz question count
    await this.updateQuestionCount(quizId);
  }

  // Question Options
  static async addQuestionOptions(
    questionId: string,
    options: { option_text: string; is_correct: boolean }[],
  ): Promise<QuestionOption[]> {
    const client = await createClient();

    const optionsData = options.map((opt, index) => ({
      question_id: questionId,
      option_text: opt.option_text,
      is_correct: opt.is_correct,
      order: index + 1,
    }));

    const { data, error } = await client
      .from("question_options")
      .insert(optionsData)
      .select();

    if (error) throw error;
    return data || [];
  }

  static async getQuestionOptions(
    questionId: string,
  ): Promise<QuestionOption[]> {
    const client = await createClient();

    const { data, error } = await client
      .from("question_options")
      .select()
      .eq("question_id", questionId)
      .order("order", { ascending: true });

    if (error) throw error;
    return data || [];
  }

  static async deleteQuestionOption(optionId: string): Promise<void> {
    const client = await createClient();

    const { error } = await client
      .from("question_options")
      .delete()
      .eq("id", optionId);

    if (error) throw error;
  }

  // Submission operations
  static async createSubmission(
    quizId: string,
    userId: string,
  ): Promise<QuizSubmission> {
    const client = await createClient();

    const { data, error } = await client
      .from("quiz_submissions")
      .insert([
        {
          quiz_id: quizId,
          user_id: userId,
          status: "in_progress",
          score: 0,
          total_points: 0,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async submitQuiz(submissionId: string): Promise<QuizSubmission> {
    const client = await createClient();

    const { data, error } = await client
      .from("quiz_submissions")
      .update({ status: "submitted" })
      .eq("id", submissionId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getUserSubmissions(userId: string): Promise<QuizSubmission[]> {
    const client = await createClient();

    const { data, error } = await client
      .from("quiz_submissions")
      .select("*, quizzes(title)")
      .eq("user_id", userId)
      .order("submitted_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getSubmission(
    submissionId: string,
  ): Promise<QuizSubmission | null> {
    const client = await createClient();

    const { data, error } = await client
      .from("quiz_submissions")
      .select()
      .eq("id", submissionId)
      .single();

    if (error) return null;
    return data;
  }

  private static async updateQuestionCount(quizId: string): Promise<void> {
    const client = await createClient();

    const { count } = await client
      .from("questions")
      .select("*", { count: "exact" })
      .eq("quiz_id", quizId);

    await client
      .from("quizzes")
      .update({ total_questions: count || 0 })
      .eq("id", quizId);
  }
}
