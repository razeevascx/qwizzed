import { createClient, createAdminClient } from "./server";
import type {
  Quiz,
  Question,
  QuestionOption,
  QuizSubmission,
  QuizInvitation,
  CreateQuizInput,
  CreateQuestionInput,
  UpdateQuizInput,
  InviteUserInput,
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
          visibility: data.visibility || "private",
          total_questions: 0,
          organizer_name: data.organizer_name,
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
      .eq("visibility", "public")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getPublicQuizzes(): Promise<Quiz[]> {
    return this.getPublishedQuizzes();
  }

  static async updateQuiz(
    quizId: string,
    data: UpdateQuizInput,
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

  // Quiz invitation operations
  static async inviteUserToQuiz(
    inviterId: string,
    data: InviteUserInput,
  ): Promise<QuizInvitation> {
    const client = await createClient();

    // Check if quiz is private and owned by inviter
    const { data: quiz } = await client
      .from("quizzes")
      .select("visibility, creator_id, title")
      .eq("id", data.quiz_id)
      .single();

    if (!quiz || quiz.creator_id !== inviterId) {
      throw new Error("Unauthorized: You don't own this quiz");
    }

    if (quiz.visibility !== "private") {
      throw new Error("Only private quizzes can have invitations");
    }

    // Check if invitation already exists
    const { data: existing } = await client
      .from("quiz_invitations")
      .select()
      .eq("quiz_id", data.quiz_id)
      .eq("invitee_email", data.invitee_email)
      .maybeSingle();

    if (existing) {
      throw new Error("User already invited to this quiz");
    }

    // Use admin client to invite user via Supabase Auth Admin API
    try {
      const adminClient = createAdminClient();
      const { data: inviteData, error: inviteError } =
        await adminClient.auth.admin.inviteUserByEmail(data.invitee_email, {
          data: {
            invited_to_quiz_id: data.quiz_id,
            quiz_title: quiz.title,
          },
          redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/quiz/${data.quiz_id}`,
        });

      if (inviteError) {
        // If user already exists, that's okay - we'll still create the invitation
        if (!inviteError.message?.includes("already registered")) {
          throw new Error(
            `Failed to send invite email: ${inviteError.message}`,
          );
        }
      }
    } catch (authError: any) {
      // Log error but continue with invitation creation
      console.warn("Auth invite warning:", authError.message);
    }

    // Create invitation record
    const { data: invitation, error } = await client
      .from("quiz_invitations")
      .insert([
        {
          quiz_id: data.quiz_id,
          inviter_id: inviterId,
          invitee_email: data.invitee_email,
          status: "pending",
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return invitation;
  }

  static async getQuizInvitations(quizId: string): Promise<QuizInvitation[]> {
    const client = await createClient();

    const { data, error } = await client
      .from("quiz_invitations")
      .select()
      .eq("quiz_id", quizId)
      .order("invited_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getUserInvitations(userId: string): Promise<QuizInvitation[]> {
    // Use admin client to avoid RLS gaps where invitee_email is allowed but invitee_id is null
    // (e.g., invited users without an account yet). We still filter by the authenticated user's email.
    const client = await createClient();
    const adminClient = createAdminClient();

    const { data: user } = await client.auth.getUser();
    if (!user.user) throw new Error("Not authenticated");

    const email = user.user.email;

    const { data, error } = await adminClient
      .from("quiz_invitations")
      .select("*, quizzes(title, description, difficulty_level)")
      .eq("status", "pending")
      .or(`invitee_email.eq.${email},invitee_id.eq.${userId}`)
      .order("invited_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async respondToInvitation(
    invitationId: string,
    status: "accepted" | "declined",
  ): Promise<QuizInvitation> {
    const client = await createClient();

    const { data: invitation, error } = await client
      .from("quiz_invitations")
      .update({
        status,
        responded_at: new Date().toISOString(),
      })
      .eq("id", invitationId)
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!invitation) {
      const notFoundError = new Error("Invitation not found");
      // @ts-expect-error attach HTTP-friendly status for route handler
      notFoundError.status = 404;
      throw notFoundError;
    }
    return invitation;
  }

  static async deleteInvitation(invitationId: string): Promise<void> {
    const client = await createClient();

    const { error } = await client
      .from("quiz_invitations")
      .delete()
      .eq("id", invitationId);

    if (error) throw error;
  }

  private static async sendInvitationEmail(
    invitation: QuizInvitation,
  ): Promise<void> {
    const client = await createClient();

    // Get quiz details
    const { data: quiz } = await client
      .from("quizzes")
      .select("title, description")
      .eq("id", invitation.quiz_id)
      .single();

    // Get inviter details
    const { data: inviter } = await client
      .from("profiles")
      .select("username, email")
      .eq("id", invitation.inviter_id)
      .maybeSingle();

    // TODO: Integrate with email service (Resend, SendGrid, etc.)
    // For now, you can use Supabase Edge Functions to send emails
    console.log("Sending invitation email:", {
      to: invitation.invitee_email,
      subject: `You've been invited to take "${quiz?.title}"`,
      inviter: inviter?.username || inviter?.email,
      quizTitle: quiz?.title,
      quizDescription: quiz?.description,
    });

    // Example using Supabase Edge Functions:
    // await fetch('https://your-project.supabase.co/functions/v1/send-invitation-email', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`
    //   },
    //   body: JSON.stringify({
    //     to: invitation.invitee_email,
    //     inviter: inviter?.username || inviter?.email,
    //     quizTitle: quiz?.title,
    //     quizDescription: quiz?.description,
    //     invitationLink: `${process.env.NEXT_PUBLIC_APP_URL}/quiz/${invitation.quiz_id}`
    //   })
    // });
  }
}
