export function scoreAnswer(
  question: { question_type: string; points: number },
  options: { id: string; option_text: string; is_correct: boolean }[],
  answer: string | string[],
) {
  const correct = options.filter((option) => option.is_correct);
  if (!correct.length) return 0;
  if (question.question_type === "multiple_choice" || question.question_type === "true_false") {
    const selected = Array.isArray(answer) ? answer : [answer];
    return selected.length === new Set(selected).size && selected.length === correct.length &&
      correct.every((option) => selected.includes(option.id)) ? question.points : 0;
  }
  const normalized = typeof answer === "string" ? answer.toLowerCase().trim() : "";
  return correct.some((option) => option.option_text.toLowerCase().trim() === normalized) ? question.points : 0;
}
