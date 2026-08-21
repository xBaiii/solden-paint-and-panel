"use client";

import type { ReactNode } from "react";
import { AlertCircle, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

/** Label + error wrapper shared by every wizard field. */
export function FieldShell({
  label,
  htmlFor,
  error,
  hint,
  optional = false,
  children,
  className,
}: {
  label: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <label
        htmlFor={htmlFor}
        className="flex items-baseline gap-2 text-sm font-medium text-foreground"
      >
        {label}
        {optional && (
          <span className="text-xs font-normal text-muted-foreground">
            optional
          </span>
        )}
      </label>
      {children}
      {hint !== undefined && error === undefined && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
      {error !== undefined && (
        <p className="flex items-center gap-1.5 text-xs font-medium text-destructive">
          <AlertCircle className="size-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

export function TextField({
  label,
  error,
  hint,
  optional,
  className,
  inputClassName,
  ...props
}: React.ComponentProps<typeof Input> & {
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  /** `className` styles the field wrapper (grid spans); this styles the input. */
  inputClassName?: string;
}) {
  return (
    <FieldShell
      label={label}
      htmlFor={props.id}
      error={error}
      hint={hint}
      optional={optional}
      className={className}
    >
      <Input
        {...props}
        aria-invalid={error !== undefined}
        className={cn("h-12 rounded-xl", inputClassName)}
      />
    </FieldShell>
  );
}

/**
 * Multi-select chip group. Used for damage types, where checkboxes would be a
 * wall of text and a native multi-select is unusable on a phone.
 */
export function ChipGroup({
  options,
  value,
  onChange,
  multiple = true,
  columns = 2,
}: {
  options: readonly { value: string; label: string; hint?: string }[];
  value: string[];
  onChange: (next: string[]) => void;
  multiple?: boolean;
  columns?: 1 | 2 | 3;
}) {
  const toggle = (option: string) => {
    if (!multiple) {
      onChange([option]);
      return;
    }
    onChange(
      value.includes(option)
        ? value.filter((item) => item !== option)
        : [...value, option],
    );
  };

  return (
    <div
      role={multiple ? "group" : "radiogroup"}
      className={cn(
        "grid gap-3",
        columns === 1 && "grid-cols-1",
        columns === 2 && "sm:grid-cols-2",
        columns === 3 && "sm:grid-cols-3",
      )}
    >
      {options.map((option) => {
        const selected = value.includes(option.value);
        return (
          <button
            key={option.value}
            type="button"
            role={multiple ? "checkbox" : "radio"}
            aria-checked={selected}
            onClick={() => toggle(option.value)}
            className={cn(
              "group relative flex items-start gap-3 rounded-xl border p-4 text-left transition-all",
              selected
                ? "border-brand-600 bg-brand-50 ring-1 ring-brand-600"
                : "border-black/10 bg-card hover:border-brand-500/50 hover:bg-surface-2",
            )}
          >
            <span
              className={cn(
                "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors",
                selected
                  ? "border-brand-600 bg-brand-600 text-white"
                  : "border-black/20 bg-background",
              )}
            >
              {selected && <Check className="size-3.5" strokeWidth={3} />}
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-medium text-foreground">
                {option.label}
              </span>
              {option.hint !== undefined && (
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  {option.hint}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/** Single-choice segmented control, for short option sets. */
export function SegmentedControl({
  options,
  value,
  onChange,
  name,
}: {
  options: readonly { value: string; label: string }[];
  value: string;
  onChange: (next: string) => void;
  name: string;
}) {
  return (
    <div role="radiogroup" aria-label={name} className="flex flex-wrap gap-2">
      {options.map((option) => {
        const selected = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.value)}
            className={cn(
              "rounded-full border px-5 py-2.5 text-sm font-medium transition-all",
              selected
                ? "border-brand-600 bg-brand-600 text-white"
                : "border-black/10 bg-card text-muted-foreground hover:border-brand-500/50 hover:text-foreground",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
