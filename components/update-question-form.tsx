"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Question, QuestionOption } from "@/lib/types/quiz";
import { Plus, X, CheckCircle2, Save } from "lucide-react";

interface UpdateQuestionFormProps {
  question: Question & { question_options?: QuestionOption[] };
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function UpdateQuestionForm({
  question,
  onSubmit,
  onCancel,
  isLoading = false,
}: UpdateQuestionFormProps) {
  const [questionType, setQuestionType] = useState(question.question_type);
  const [questionText, setQuestionText] = useState(question.question_text);
  const [points, setPoints] = useState(question.points || 1);
  const [options, setOptions] = useState(
    question.question_options?.map((o) => ({
      id: o.id,
      option_text: o.option_text,
      is_correct: o.is_correct,
    })) || [
      { option_text: "", is_correct: false },
      { option_text: "", is_correct: false },
    ],
  );

  const handleAddOption = () => {
    setOptions([...options, { option_text: "", is_correct: false }] as any);
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
    await onSubmit({
      question_text: questionText,
      question_type: questionType,
      points,
      options,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-muted/5 p-4 rounded-lg border border-border/40">
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-semibold mb-2 block">Question Text</Label>
          <textarea
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            required
            rows={3}
            className="w-full px-3 py-2 border border-border/40 rounded-md bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <Label className="text-sm font-semibold mb-2 block">Points</Label>
            <Input
              type="number"
              value={points}
              onChange={(e) => setPoints(parseInt(e.target.value) || 1)}
              min="1"
              max="100"
              className="bg-transparent border-border/40"
            />
          </div>
          <div className="flex-1">
             <Label className="text-sm font-semibold mb-2 block">Type</Label>
             <div className="px-3 py-2 rounded-md border border-border/40 bg-muted/20 text-sm font-medium">
                {questionType.replace("_", " ")}
             </div>
          </div>
        </div>

        {(questionType === "multiple_choice" || questionType === "true_false") && (
          <div className="space-y-3">
            <Label className="text-sm font-semibold mb-1 block">Options</Label>
            <div className="space-y-2">
              {options.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={option.option_text}
                    onChange={(e) => handleOptionChange(index, "option_text", e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="bg-transparent border-border/40"
                    required
                  />
                  <label className="flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-muted/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={option.is_correct}
                      onChange={(e) => handleOptionChange(index, "is_correct", e.target.checked)}
                      className="w-4 h-4 accent-emerald-600"
                    />
                    <span className="text-xs font-semibold text-muted-foreground">Correct</span>
                  </label>
                  {questionType === "multiple_choice" && options.length > 2 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveOption(index)}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            {questionType === "multiple_choice" && (
              <Button type="button" variant="outline" size="sm" onClick={handleAddOption} className="mt-2">
                <Plus className="w-3 h-3 mr-2" /> Add Option
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="submit" disabled={isLoading} className="flex-1 gap-2">
          {isLoading ? (
             <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Update Question
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
