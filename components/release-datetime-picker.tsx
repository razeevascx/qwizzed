"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Calendar,
  Clock,
  X,
  CalendarCheck,
  Info,
  AlertCircle,
} from "lucide-react";

interface ReleaseDateTimePickerProps {
  value: string | null;
  onChange: (value: string | null) => void;
  disabled?: boolean;
  minDate?: Date;
}

export function ReleaseDateTimePicker({
  value,
  onChange,
  disabled = false,
  minDate,
}: ReleaseDateTimePickerProps) {
  const [isScheduled, setIsScheduled] = useState(Boolean(value));
  const [localValue, setLocalValue] = useState("");
  const [effectiveMinDate, setEffectiveMinDate] = useState<Date | null>(null);

  useEffect(() => {
    setEffectiveMinDate(minDate ?? new Date());
  }, [minDate]);

  useEffect(() => {
    if (value) {
      const date = new Date(value);
      const offset = date.getTimezoneOffset();
      const local = new Date(date.getTime() - offset * 60000);
      setLocalValue(local.toISOString().slice(0, 16));
      setIsScheduled(true);
    } else {
      setLocalValue("");
      setIsScheduled(false);
    }
  }, [value]);

  const handleToggleSchedule = () => {
    if (isScheduled) {
      setIsScheduled(false);
      setLocalValue("");
      onChange(null);
      return;
    }

    const now = new Date();
    now.setHours(now.getHours() + 1);
    const offset = now.getTimezoneOffset();
    const local = new Date(now.getTime() - offset * 60000);
    const localStr = local.toISOString().slice(0, 16);
    setLocalValue(localStr);
    setIsScheduled(true);
    onChange(new Date(localStr).toISOString());
  };

  const handleDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    if (newValue) {
      onChange(new Date(newValue).toISOString());
    } else {
      onChange(null);
    }
  };

  const getTimeRemaining = () => {
    if (!value) return null;
    const now = Date.now();
    const target = new Date(value).getTime();
    const diff = target - now;

    if (diff <= 0) return "Now available";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `Releases in ${days}d ${hours}h`;
    if (hours > 0) return `Releases in ${hours}h ${minutes}m`;
    return `Releases in ${minutes}m`;
  };

  const formatDateTime = (iso: string | null) => {
    if (!iso) return "";
    const date = new Date(iso);
    return date.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const isPast = value && new Date(value).getTime() < Date.now();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold flex items-center gap-2">
          <CalendarCheck className="w-4 h-4 text-primary/70" />
          Schedule Release
        </Label>
        <Button
          type="button"
          variant={isScheduled ? "outline" : "default"}
          size="sm"
          onClick={handleToggleSchedule}
          disabled={disabled}
          className="h-8 text-xs"
        >
          {isScheduled ? (
            <>
              <X className="w-3 h-3 mr-1" />
              Clear Schedule
            </>
          ) : (
            <>
              <Calendar className="w-3 h-3 mr-1" />
              Schedule Quiz
            </>
          )}
        </Button>
      </div>

      {isScheduled && (
        <div className="space-y-3 rounded-lg border border-border/60 bg-muted/20 p-4">
          <div className="space-y-2">
            <Label htmlFor="release-datetime" className="text-xs font-medium">
              Release Date & Time
            </Label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                id="release-datetime"
                type="datetime-local"
                value={localValue}
                onChange={handleDateTimeChange}
                disabled={disabled}
                min={
                  effectiveMinDate
                    ? new Date(
                        effectiveMinDate.getTime() -
                          effectiveMinDate.getTimezoneOffset() * 60000,
                      )
                        .toISOString()
                        .slice(0, 16)
                    : undefined
                }
                className="pl-9 bg-background h-10 focus:ring-primary/50 focus:border-primary/60"
              />
            </div>
          </div>

          {value && (
            <div
              className={`rounded-md p-3 text-xs space-y-1 ${
                isPast
                  ? "bg-destructive/10 border border-destructive/40 text-destructive"
                  : "bg-primary/5 border border-primary/40 text-foreground"
              }`}
            >
              <div className="flex items-start gap-2">
                {isPast ? (
                  <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                ) : (
                  <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                )}
                <div className="space-y-0.5">
                  <p className="font-medium">
                    {isPast
                      ? "Release time is in the past"
                      : getTimeRemaining()}
                  </p>
                  <p className="text-muted-foreground">
                    {formatDateTime(value)}
                  </p>
                  {!isPast && (
                    <p className="text-[11px] text-muted-foreground mt-1">
                      Quiz will be hidden until this time. Users will see a
                      countdown.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {!isScheduled && (
        <div className="rounded-md border border-dashed border-border/60 p-4 text-center">
          <Calendar className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
          <p className="text-xs text-muted-foreground">
            Quiz will be available immediately upon publishing
          </p>
          <p className="text-[11px] text-muted-foreground/70 mt-1">
            Click "Schedule Quiz" to set a release time
          </p>
        </div>
      )}
    </div>
  );
}
