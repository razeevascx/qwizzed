/**
 * API Client utilities for making fetch requests with error handling
 */

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  ok: boolean;
}

/**
 * Make a GET request to the API
 */
export async function apiGet<T>(url: string): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    return { data, error: null, ok: true };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch";
    return { data: null, error: errorMessage, ok: false };
  }
}

/**
 * Make a POST request to the API
 */
export async function apiPost<T>(
  url: string,
  body: any,
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    return { data, error: null, ok: true };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to create";
    return { data: null, error: errorMessage, ok: false };
  }
}

/**
 * Make a PUT request to the API
 */
export async function apiPut<T>(
  url: string,
  body: any,
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    return { data, error: null, ok: true };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to update";
    return { data: null, error: errorMessage, ok: false };
  }
}

/**
 * Make a DELETE request to the API
 */
export async function apiDelete<T>(url: string): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    return { data, error: null, ok: true };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to delete";
    return { data: null, error: errorMessage, ok: false };
  }
}

/**
 * Quiz API helper methods
 */
export const quizApi = {
  getQuiz: (id: string) => apiGet(`/api/quiz/${id}`),
  updateQuiz: (id: string, data: any) => apiPut(`/api/quiz/${id}`, data),
  deleteQuiz: (id: string) => apiDelete(`/api/quiz/${id}`),
  createQuestion: (quizId: string, data: any) =>
    apiPost(`/api/quiz/${quizId}/questions`, data),
  updateQuestion: (quizId: string, questionId: string, data: any) =>
    apiPut(`/api/quiz/${quizId}/questions/${questionId}`, data),
  deleteQuestion: (quizId: string, questionId: string) =>
    apiDelete(`/api/quiz/${quizId}/questions/${questionId}`),
  reorderQuestions: (quizId: string, questions: any[]) =>
    apiPut(`/api/quiz/${quizId}/questions/reorder`, { questions }),
  createSubmission: (quizId: string) =>
    apiPost(`/api/quiz/${quizId}/submissions`, {}),
  submitAnswers: (quizId: string, submissionId: string, data: any) =>
    apiPost(`/api/quiz/${quizId}/submissions/${submissionId}`, data),
  submitGrading: (quizId: string, submissionId: string, data: any) =>
    apiPut(`/api/quiz/${quizId}/submissions/${submissionId}`, data),
};
