import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreateQuizInput } from "@/lib/types/quiz";
import { Clock, BookOpen, Zap, AlertCircle, Globe, Lock } from "lucide-react";

interface CreateQuizFormProps {
  onSubmit: (data: CreateQuizInput) => Promise<void>;
  isLoading?: boolean;
}

export function CreateQuizForm({
  onSubmit,
  isLoading = false,
}: CreateQuizFormProps) {
  const [formData, setFormData] = useState<CreateQuizInput>({
    title: "",
    description: "",
    difficulty_level: "medium",
    category: "",
    time_limit_minutes: null,
    visibility: "public",
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "time_limit_minutes"
          ? value
            ? parseInt(value)
            : null
          : value,
    }));
  };

  const handleBlur = (
    e: React.FocusEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const difficultyOptions = [
    { value: "easy", label: "Easy", color: "emerald" },
    { value: "medium", label: "Medium", color: "amber" },
    { value: "hard", label: "Hard", color: "rose" },
  ];

  const visibilityOptions = [
    {
      value: "public",
      label: "Public",
      icon: Globe,
      description: "Anyone can find and take this quiz",
    },
    {
      value: "private",
      label: "Private",
      icon: Lock,
      description: "Only invited users can access",
    },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Quiz Title & Description */}
      <div className="space-y-6">
        <div>
          <Label htmlFor="title" className="text-base font-semibold mb-3 block">
            Quiz Title <span className="text-destructive">*</span>
          </Label>
          <Input
            id="title"
            name="title"
            type="text"
            placeholder="e.g., Advanced JavaScript Concepts"
            value={formData.title}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            disabled={isLoading}
            className="bg-background border-border/50 text-lg h-12 focus:ring-primary/50"
          />
          {touched.title && !formData.title && (
            <div className="mt-2 flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="w-4 h-4" />
              Quiz title is required
            </div>
          )}
        </div>

        <div>
          <Label
            htmlFor="description"
            className="text-base font-semibold mb-3 block"
          >
            Description <span className="text-destructive">*</span>
          </Label>
          <textarea
            id="description"
            name="description"
            placeholder="Describe what this quiz is about and what students will learn..."
            value={formData.description}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            disabled={isLoading}
            rows={4}
            className="w-full px-4 py-3 border border-border/50 rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
          />
          {touched.description && !formData.description && (
            <div className="mt-2 flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="w-4 h-4" />
              Description is required
            </div>
          )}
        </div>
      </div>

      {/* Grid: Category & Difficulty */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Label
            htmlFor="category"
            className="text-base font-semibold mb-3 flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4 text-primary" />
            Category <span className="text-destructive">*</span>
          </Label>
          <Input
            id="category"
            name="category"
            type="text"
            placeholder="e.g., Technology, History, Math"
            value={formData.category}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            disabled={isLoading}
            className="bg-background border-border/50 h-11 focus:ring-primary/50"
          />
          {touched.category && !formData.category && (
            <div className="mt-2 flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="w-4 h-4" />
              Category is required
            </div>
          )}
        </div>

        <div>
          <Label className="text-base font-semibold mb-4 block">
            Difficulty Level <span className="text-destructive">*</span>
          </Label>
          <div className="grid grid-cols-3 gap-3">
            {difficultyOptions.map((option) => (
              <label
                key={option.value}
                className={`flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all font-medium text-sm ${
                  formData.difficulty_level === option.value
                    ? option.color === "emerald"
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 shadow-sm"
                      : option.color === "amber"
                        ? "border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 shadow-sm"
                        : "border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 shadow-sm"
                    : "border-border/50 hover:border-border/80 text-muted-foreground hover:text-foreground hover:bg-accent/50"
                }`}
              >
                <input
                  type="radio"
                  name="difficulty_level"
                  value={option.value}
                  checked={formData.difficulty_level === option.value}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="sr-only"
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Visibility */}
      <div>
        <Label className="text-base font-semibold mb-4 block">
          Quiz Visibility <span className="text-destructive">*</span>
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {visibilityOptions.map((option) => {
            const Icon = option.icon;
            return (
              <label
                key={option.value}
                className={`flex flex-col items-start p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  formData.visibility === option.value
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border/50 hover:border-border/80 hover:bg-accent/50"
                }`}
              >
                <input
                  type="radio"
                  name="visibility"
                  value={option.value}
                  checked={formData.visibility === option.value}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="sr-only"
                />
                <div className="flex items-center gap-2 mb-1">
                  <Icon
                    className={`w-4 h-4 ${
                      formData.visibility === option.value
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  />
                  <span
                    className={`font-medium text-sm ${
                      formData.visibility === option.value
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {option.label}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {option.description}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Time Limit */}
      <div>
        <Label
          htmlFor="time_limit_minutes"
          className="text-base font-semibold mb-3 flex items-center gap-2"
        >
          <Clock className="w-4 h-4 text-primary" />
          Time Limit{" "}
          <span className="text-muted-foreground font-normal">(Optional)</span>
        </Label>
        <div className="relative">
          <Input
            id="time_limit_minutes"
            name="time_limit_minutes"
            type="number"
            placeholder="Leave empty for unlimited time"
            value={formData.time_limit_minutes ?? ""}
            onChange={handleChange}
            min="1"
            disabled={isLoading}
            className="bg-background border-border/50 pr-16 h-11 focus:ring-primary/50"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">
            minutes
          </span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Set a time limit for quiz takers to complete the quiz, or leave empty
          for unlimited time
        </p>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={
          isLoading ||
          !formData.title ||
          !formData.description ||
          !formData.category
        }
        size="lg"
        className="w-full gap-2 h-12 text-base font-semibold"
      >
        {isLoading ? (
          <>
            <div className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full" />
            Creating Quiz...
          </>
        ) : (
          <>
            <Zap className="w-5 h-5" />
            Create Quiz
          </>
        )}
      </Button>
    </form>
  );
}
