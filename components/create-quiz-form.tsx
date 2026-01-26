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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Quiz Title & Description */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="title" className="text-sm font-semibold mb-2 block">
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
            className="bg-card/50 border-border/40 h-10 focus:ring-primary/50 focus:border-primary/60"
          />
          {touched.title && !formData.title && (
            <div className="mt-1.5 flex items-center gap-2 text-xs text-destructive">
              <AlertCircle className="w-3.5 h-3.5" />
              Quiz title is required
            </div>
          )}
        </div>

        <div>
          <Label
            htmlFor="description"
            className="text-sm font-semibold mb-2 block"
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
            rows={3}
            className="w-full px-3 py-2 border border-border/40 rounded-md bg-card/50 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/60 resize-none text-sm"
          />
          {touched.description && !formData.description && (
            <div className="mt-1.5 flex items-center gap-2 text-xs text-destructive">
              <AlertCircle className="w-3.5 h-3.5" />
              Description is required
            </div>
          )}
        </div>
      </div>

      {/* Grid: Category & Difficulty */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label
            htmlFor="category"
            className="text-sm font-semibold mb-2 flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5 text-primary/70" />
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
            className="bg-card/50 border-border/40 h-10 focus:ring-primary/50 focus:border-primary/60"
          />
          {touched.category && !formData.category && (
            <div className="mt-1.5 flex items-center gap-2 text-xs text-destructive">
              <AlertCircle className="w-3.5 h-3.5" />
              Category is required
            </div>
          )}
        </div>

        <div>
          <Label className="text-sm font-semibold mb-2 block">
            Difficulty Level <span className="text-destructive">*</span>
          </Label>
          <div className="flex gap-2">
            {difficultyOptions.map((option) => (
              <label
                key={option.value}
                className={`flex-1 flex items-center justify-center p-2.5 rounded-md border cursor-pointer transition-all font-medium text-xs ${
                  formData.difficulty_level === option.value
                    ? option.color === "emerald"
                      ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                      : option.color === "amber"
                        ? "border-amber-500/50 bg-amber-500/10 text-amber-700 dark:text-amber-300"
                        : "border-rose-500/50 bg-rose-500/10 text-rose-700 dark:text-rose-300"
                    : "border-border/40 hover:border-border/60 text-muted-foreground hover:text-foreground hover:bg-card/50"
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
        <Label className="text-sm font-semibold mb-2 block">
          Quiz Visibility <span className="text-destructive">*</span>
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {visibilityOptions.map((option) => {
            const Icon = option.icon;
            return (
              <label
                key={option.value}
                className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer transition-all ${
                  formData.visibility === option.value
                    ? "border-primary/50 bg-primary/5"
                    : "border-border/40 hover:border-border/60 hover:bg-card/50"
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
                <Icon
                  className={`w-4 h-4 flex-shrink-0 ${
                    formData.visibility === option.value
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div
                    className={`font-medium text-sm ${
                      formData.visibility === option.value
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {option.label}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {option.description}
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Time Limit */}
      <div>
        <Label
          htmlFor="time_limit_minutes"
          className="text-sm font-semibold mb-2 flex items-center gap-1.5"
        >
          <Clock className="w-3.5 h-3.5 text-primary/70" />
          Time Limit{" "}
          <span className="text-muted-foreground font-normal text-xs">
            (Optional)
          </span>
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
            className="bg-card/50 border-border/40 pr-16 h-10 focus:ring-primary/50 focus:border-primary/60"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-medium">
            minutes
          </span>
        </div>
        <p className="mt-1.5 text-xs text-muted-foreground">
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
        className="w-full gap-2 h-10 text-sm font-semibold mt-8"
      >
        {isLoading ? (
          <>
            <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
            Creating Quiz...
          </>
        ) : (
          <>
            <Zap className="w-4 h-4" />
            Create Quiz
          </>
        )}
      </Button>
    </form>
  );
}
