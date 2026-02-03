import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreateQuizInput } from "@/lib/types/quiz";
import { AlertCircle, Globe, Lock } from "lucide-react";
import { ReleaseDateTimePicker } from "@/components/release-datetime-picker";

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
    release_at: null,
    visibility: "public",
    organizer_name: "",
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
    const payload: CreateQuizInput = {
      ...formData,
      release_at: formData.release_at || null,
    };
    await onSubmit(payload);
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
      {/* Quiz Title */}
      <div>
        <Label htmlFor="title" className="text-sm font-semibold mb-3 block">
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
          className="bg-card border-border h-11 focus:ring-primary/50 focus:border-primary/60"
        />
        {touched.title && !formData.title && (
          <div className="mt-2 flex items-start gap-2 text-xs text-destructive">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>Quiz title is required</span>
          </div>
        )}
      </div>

      {/* Description */}
      <div>
        <Label
          htmlFor="description"
          className="text-sm font-semibold mb-3 block"
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
          className="w-full px-4 py-3 border border-border rounded-lg bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/60 resize-none text-sm"
        />
        {touched.description && !formData.description && (
          <div className="mt-2 flex items-start gap-2 text-xs text-destructive">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>Description is required</span>
          </div>
        )}
      </div>

      {/* Organizer */}
      <div>
        <Label
          htmlFor="organizer_name"
          className="text-sm font-semibold mb-3 block"
        >
          Organized By{" "}
          <span className="text-muted-foreground font-normal text-xs">
            (Optional)
          </span>
        </Label>
        <Input
          id="organizer_name"
          name="organizer_name"
          type="text"
          placeholder="e.g., Prof. Smith, Tech Community, etc."
          value={formData.organizer_name || ""}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={isLoading}
          className="bg-card border-border h-11 focus:ring-primary/50 focus:border-primary/60"
        />
      </div>

      {/* Category */}
      <div>
        <Label htmlFor="category" className="text-sm font-semibold mb-3 block">
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
          className="bg-card border-border h-11 focus:ring-primary/50 focus:border-primary/60"
        />
        {touched.category && !formData.category && (
          <div className="mt-2 flex items-start gap-2 text-xs text-destructive">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>Category is required</span>
          </div>
        )}
      </div>

      {/* Difficulty Level */}
      <div>
        <Label className="text-sm font-semibold mb-3 block">
          Difficulty Level <span className="text-destructive">*</span>
        </Label>
        <div className="flex gap-3">
          {difficultyOptions.map((option) => (
            <label
              key={option.value}
              className={`flex-1 flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all font-medium text-sm ${
                formData.difficulty_level === option.value
                  ? option.color === "emerald"
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                    : option.color === "amber"
                      ? "border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-300"
                      : "border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-300"
                  : "border-border hover:border-border/80 text-muted-foreground hover:text-foreground hover:bg-muted/50"
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

      {/* Visibility */}
      <div>
        <Label className="text-sm font-semibold mb-3 block">
          Quiz Visibility <span className="text-destructive">*</span>
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {visibilityOptions.map((option) => {
            const Icon = option.icon;
            return (
              <label
                key={option.value}
                className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  formData.visibility === option.value
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-border/80 hover:bg-muted/30"
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
                  className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                    formData.visibility === option.value
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                />
                <div className="flex-1">
                  <div
                    className={`font-semibold text-sm ${
                      formData.visibility === option.value
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {option.label}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
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
          className="text-sm font-semibold mb-3 block"
        >
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
            className="bg-card border-border h-11 pr-20 focus:ring-primary/50 focus:border-primary/60"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">
            minutes
          </span>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Set a time limit for quiz takers, or leave empty for unlimited time
        </p>
      </div>

      {/* Release Date */}
      <ReleaseDateTimePicker
        value={formData.release_at || null}
        onChange={(value) =>
          setFormData((prev) => ({ ...prev, release_at: value }))
        }
        disabled={isLoading}
      />

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
        className="w-full h-12 text-base font-semibold mt-10"
      >
        {isLoading ? "Creating Quiz..." : "Create Quiz"}
      </Button>
    </form>
  );
}
