"use client";

import { Question, QuestionOption } from "@/lib/types/quiz";

interface QuestionWithOptions extends Question {
  question_options?: QuestionOption[];
}

interface QuizQuestionDisplayProps {
  question: QuestionWithOptions;
  index: number;
  answer?: string;
  onAnswerChange: (questionId: string, answer: string) => void;
}

export function QuizQuestionDisplay({
  question,
  index,
  answer,
  onAnswerChange,
}: QuizQuestionDisplayProps) {
  return (
    <div className="flex justify-center w-full">
      <div className="w-full">


        <div className="space-y-4 mb-10">
          {question.question_type === "short_answer" ||
          question.question_type === "fill_in_blank" ? (
            <div className="">
              <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                {question.question_type === "fill_in_blank"
                  ? "Fill in the blank"
                  : "Your Answer"}
              </label>
              <textarea
                placeholder={
                  question.question_type === "fill_in_blank"
                    ? "Type your answer..."
                    : "Write your answer here..."
                }
                value={answer || ""}
                onChange={(e) => onAnswerChange(question.id, e.target.value)}
                rows={question.question_type === "fill_in_blank" ? 2 : 5}
                className="w-full px-6 py-5 border border-border/50 rounded-2xl bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all resize-none text-xl"
              />
            </div>
          ) : (
            <div className="space-y-3 ">
              {question.question_options?.map((option, idx) => {
                const isSelected = answer === option.id;
                const letter = String.fromCodePoint(65 + idx);

                return (
                  <label
                    key={option.id}
                    className={`group relative flex items-center gap-5 p-5  border-2 cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                        : "border-border/40 hover:border-border hover:bg-card/50 hover:shadow-md"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={option.id}
                      checked={isSelected}
                      onChange={(e) => onAnswerChange(question.id, e.target.value)}
                      className="sr-only"
                    />

                    {/* Letter Badge */}
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm transition-all duration-200 ${
                        isSelected
                          ? "bg-primary text-primary-foreground shadow-lg"
                          : "bg-muted/50 text-muted-foreground group-hover:bg-muted"
                      }`}
                    >
                      {letter}
                    </div>

                    {/* Option Text */}
                    <div className="flex-1">
                      <span className="text-lg font-medium text-foreground transition-colors">
                        {option.option_text}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
