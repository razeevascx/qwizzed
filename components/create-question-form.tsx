import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreateQuestionInput } from "@/lib/types/quiz";
import { Plus, X, AlertCircle, HelpCircle, CheckCircle2 } from "lucide-react";

interface CreateQuestionFormProps {
  onSubmit: (data: CreateQuestionInput) => Promise<void>;
  isLoading?: boolean;
}

export function CreateQuestionForm({
  onSubmit,
  isLoading = false,
}: CreateQuestionFormProps) {
  const [questionType, setQuestionType] = useState<
    "multiple_choice" | "short_answer" | "true_false"
  >("multiple_choice");
  const [questionText, setQuestionText] = useState("");
  const [shortAnswerCorrect, setShortAnswerCorrect] = useState("");
  const [options, setOptions] = useState<
    { option_text: string; is_correct: boolean }[]
  >([
    { option_text: "", is_correct: false },
    { option_text: "", is_correct: false },
  ]);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleAddOption = () => {
    setOptions([...options, { option_text: "", is_correct: false }]);
  };

  const handleRemoveOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleOptionChange = (index: number, field: string, value: any) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (questionType === "short_answer") {
      await onSubmit({
        question_text: questionText,
        question_type: questionType,
        options: [{ option_text: shortAnswerCorrect, is_correct: true }],
      });
    } else {
      const hasCorrectAnswer = options.some((opt) => opt.is_correct);
      if (!hasCorrectAnswer) {
        alert("Please mark at least one option as correct");
        return;
      }

      await onSubmit({
        question_text: questionText,
        question_type: questionType,
        options,
      });
    }

    // Reset form
    setQuestionText("");
    setShortAnswerCorrect("");
    setOptions([
      { option_text: "", is_correct: false },
      { option_text: "", is_correct: false },
    ]);
  };

  const questionTypeOptions = [
    { value: "multiple_choice", label: "Multiple Choice", icon: "◉" },
    { value: "true_false", label: "True/False", icon: "☑" },
    { value: "short_answer", label: "Short Answer", icon: "✎" },
  ];

  const hasCorrectAnswer = options.some((opt) => opt.is_correct);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Question Type Selection */}
      <div>
        <Label className="text-base font-semibold mb-4 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-primary" />
          Question Type <span className="text-destructive">*</span>
        </Label>
        <div className="grid grid-cols-3 gap-3">
          {questionTypeOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setQuestionType(opt.value as any)}
              disabled={isLoading}
              className={`p-4 rounded-lg border-2 transition-all font-medium text-sm flex flex-col items-center gap-2 ${
                questionType === opt.value
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border/50 bg-background hover:border-border/80 text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="text-xl">{opt.icon}</span>
              <span className="text-xs">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Question Text */}
      <div>
        <Label
          htmlFor="question-text"
          className="text-base font-semibold mb-3 block"
        >
          Question Text <span className="text-destructive">*</span>
        </Label>
        <textarea
          id="question-text"
          placeholder="Write your question here. Be clear and concise..."
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          onBlur={() => setTouched({ ...touched, questionText: true })}
          required
          disabled={isLoading}
          rows={3}
          className="w-full px-4 py-3 border border-border/50 rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none transition-all"
        />
        {touched.questionText && !questionText && (
          <div className="mt-2 flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="w-4 h-4" />
            Question text is required
          </div>
        )}
      </div>

      {/* Answer Options - Multiple Choice */}
      {questionType === "multiple_choice" && (
        <div className="space-y-4 pt-4 border-t border-border/30">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-semibold">
                Answer Options <span className="text-destructive">*</span>
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                Mark the correct answer(s)
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddOption}
              disabled={isLoading}
              className="gap-1 h-9"
            >
              <Plus className="w-4 h-4" />
              Add Option
            </Button>
          </div>

          {!hasCorrectAnswer && options.some((opt) => opt.option_text) && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg flex items-start gap-2 text-sm text-amber-800 dark:text-amber-300">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>Please mark at least one option as correct</span>
            </div>
          )}

          <div className="space-y-2">
            {options.map((option, index) => (
              <div key={index} className="flex items-center gap-2 group">
                <div className="flex-1 flex items-center gap-2">
                  <Input
                    type="text"
                    placeholder={`Option ${index + 1}`}
                    value={option.option_text}
                    onChange={(e) =>
                      handleOptionChange(index, "option_text", e.target.value)
                    }
                    required={questionType === "multiple_choice"}
                    disabled={isLoading}
                    className="bg-background border-border/50 h-10 text-sm"
                  />
                </div>
                <label
                  className={`flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg border transition-all whitespace-nowrap ${
                    option.is_correct
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30"
                      : "border-border/50 hover:border-border/80"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={option.is_correct}
                    onChange={(e) =>
                      handleOptionChange(index, "is_correct", e.target.checked)
                    }
                    disabled={isLoading}
                    className="w-4 h-4 accent-emerald-600 cursor-pointer"
                  />
                  {option.is_correct ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <span className="text-muted-foreground">Correct</span>
                  )}
                </label>
                {questionType === "multiple_choice" && options.length > 2 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveOption(index)}
                    disabled={isLoading}
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive h-9 w-9 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Answer Options - True/False */}
      {questionType === "true_false" && (
        <div className="space-y-4 pt-4 border-t border-border/30">
          <div>
            <Label className="text-base font-semibold">
              Correct Answer <span className="text-destructive">*</span>
            </Label>
            <p className="text-xs text-muted-foreground mt-1">
              Select the correct answer
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { value: true, label: "True", color: "emerald" },
              { value: false, label: "False", color: "rose" },
            ].map((option) => (
              <button
                key={String(option.value)}
                type="button"
                onClick={() => {
                  const newOptions = [
                    { option_text: "True", is_correct: option.value === true },
                    {
                      option_text: "False",
                      is_correct: option.value === false,
                    },
                  ];
                  setOptions(newOptions);
                }}
                className={`p-4 rounded-lg border-2 transition-all font-semibold flex items-center justify-center gap-2 ${
                  hasCorrectAnswer &&
                  options.find(
                    (o) => o.option_text === option.label && o.is_correct,
                  )
                    ? option.color === "emerald"
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300"
                      : "border-rose-500 bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300"
                    : "border-border/50 hover:border-border/80"
                }`}
              >
                <CheckCircle2
                  className={`w-5 h-5 ${
                    hasCorrectAnswer &&
                    options.find(
                      (o) => o.option_text === option.label && o.is_correct,
                    )
                      ? "opacity-100"
                      : "opacity-0"
                  } transition-opacity`}
                />
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Answer Options - Short Answer */}
      {questionType === "short_answer" && (
        <div className="space-y-4 pt-4 border-t border-border/30">
          <div>
            <Label
              htmlFor="short-answer-correct"
              className="text-base font-semibold"
            >
              Correct Answer <span className="text-destructive">*</span>
            </Label>
            <p className="text-xs text-muted-foreground mt-1">
              Enter the expected correct answer
            </p>
          </div>
          <Input
            id="short-answer-correct"
            type="text"
            placeholder="e.g., Paris, 42, the mitochondria is the powerhouse of the cell"
            value={shortAnswerCorrect}
            onChange={(e) => setShortAnswerCorrect(e.target.value)}
            required
            disabled={isLoading}
            className="bg-background border-border/50 h-11 text-base"
          />
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={
          isLoading ||
          !questionText ||
          (questionType === "short_answer" && !shortAnswerCorrect) ||
          (questionType !== "short_answer" && !hasCorrectAnswer)
        }
        size="lg"
        className="w-full gap-2 h-11 font-semibold text-base"
      >
        {isLoading ? (
          <>
            <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
            Adding Question...
          </>
        ) : (
          <>
            <Plus className="w-5 h-5" />
            Add Question
          </>
        )}
      </Button>
    </form>
  );
}
