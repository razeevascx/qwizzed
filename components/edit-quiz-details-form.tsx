"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Quiz, UpdateQuizInput } from "@/lib/types/quiz";
import { Clock, BookOpen, Save, AlertCircle } from "lucide-react";
import { ReleaseDateTimePicker } from "@/components/release-datetime-picker";

interface EditQuizDetailsFormProps {
  quiz: Quiz;
  onSubmit: (data: UpdateQuizInput) => Promise<void>;
  isLoading?: boolean;
}

export function EditQuizDetailsForm({
  quiz,
  onSubmit,
  isLoading = false,
}: EditQuizDetailsFormProps) {
  const [formData, setFormData] = useState<UpdateQuizInput>({
    title: quiz.title,
    description: quiz.description,
    difficulty_level: quiz.difficulty_level,
    category: quiz.category,
    time_limit_minutes: quiz.time_limit_minutes,
    release_at: quiz.release_at || null,
    organizer_name: quiz.organizer_name || undefined,
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
    const payload: UpdateQuizInput = {
      ...formData,
      release_at: formData.release_at || null,
    };
    await onSubmit(payload);
  };

  const toLocalInputValue = (iso: string | null | undefined) => {
    if (!iso) return "";
    const date = new Date(iso);
    const offset = date.getTimezoneOffset();
    const local = new Date(date.getTime() - offset * 60000);
    return local.toISOString().slice(0, 16);
  };

  const difficultyOptions = [
    { value: "easy", label: "Easy", color: "emerald" },
    { value: "medium", label: "Medium", color: "amber" },
    { value: "hard", label: "Hard", color: "rose" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title" className="text-sm font-semibold mb-2 block">
            Quiz Title <span className="text-destructive">*</span>
          </Label>
          <Input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            disabled={isLoading}
            className="bg-card/50 border-border/40 h-10"
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
            value={formData.description}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            disabled={isLoading}
            rows={3}
            className="w-full px-3 py-2 border border-border/40 rounded-md bg-card/50 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/60 resize-none text-sm"
          />
        </div>

        <div>
          <Label
            htmlFor="organizer_name"
            className="text-sm font-semibold mb-2 block"
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
            className="bg-card/50 border-border/40 h-10"
          />
        </div>
      </div>

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
            value={formData.category}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            disabled={isLoading}
            className="bg-card/50 border-border/40 h-10"
          />
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label
            htmlFor="time_limit_minutes"
            className="text-sm font-semibold mb-2 flex items-center gap-1.5"
          >
            <Clock className="w-3.5 h-3.5 text-primary/70" />
            Time Limit (minutes)
          </Label>
          <Input
            id="time_limit_minutes"
            name="time_limit_minutes"
            type="number"
            value={formData.time_limit_minutes ?? ""}
            onChange={handleChange}
            min="1"
            disabled={isLoading}
            className="bg-card/50 border-border/40 h-10"
          />
        </div>

        <ReleaseDateTimePicker
          value={formData.release_at}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, release_at: value }))
          }
          disabled={isLoading}
        />
      </div>

      <Button
        type="submit"
        disabled={
          isLoading ||
          !formData.title ||
          !formData.description ||
          !formData.category
        }
        className="w-full gap-2"
      >
        {isLoading ? (
          <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
        ) : (
          <Save className="w-4 h-4" />
        )}
        Save Details
      </Button>
    </form>
  );
}
