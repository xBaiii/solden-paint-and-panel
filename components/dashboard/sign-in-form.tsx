"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";
import { ConvexError } from "convex/values";
import { AlertCircle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Mode = "signIn" | "signUp";

/**
 * Email + password sign in against Convex Auth.
 *
 * Sign-up is offered because the very first account has to be created somehow —
 * that account automatically becomes the owner. Every subsequent sign-up is
 * rejected server-side unless an admin has issued an invite for that address
 * (see the afterUserCreatedOrUpdated callback in convex/auth.ts), so exposing
 * the tab here is safe.
 */
export function SignInForm() {
  const { signIn } = useAuthActions();
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signIn");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Our own checks throw ConvexError, whose `data` reaches the browser intact.
   * Anything else is either Convex Auth's deliberately vague bad-credentials
   * error or a genuine fault, and the message is redacted in production — so
   * never dress an unknown failure up as a specific cause.
   */
  const describe = (caught: unknown): string => {
    if (caught instanceof ConvexError) {
      const data = caught.data;
      if (typeof data === "string" && data.length > 0) return data;
    }
    const raw = caught instanceof Error ? caught.message : "";
    if (raw.includes("InvalidAccountId") || raw.includes("InvalidSecret")) {
      return "That email address and password don't match an account.";
    }
    // Fallback for environments where the ConvexError instance doesn't survive
    // the client boundary: the thrown message is still embedded in the string.
    for (const known of [
      "has not been invited",
      "has been deactivated",
      "email address is required",
    ]) {
      const at = raw.indexOf(known);
      if (at === -1) continue;
      const sentence = raw.slice(raw.lastIndexOf(":", at) + 1).trim();
      return sentence.length > 0 ? sentence.split("\n")[0] : raw;
    }
    return mode === "signUp"
      ? "We couldn't create that account. If you already have one, sign in instead — otherwise contact your administrator."
      : "That email address and password don't match an account.";
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const formData = new FormData(event.currentTarget);
    formData.set("flow", mode);

    try {
      await signIn("password", formData);
      router.push("/dashboard");
    } catch (caught) {
      // Surfaced in the console too: the on-screen copy is intentionally
      // non-specific for unknown failures, which makes debugging harder.
      console.error("[sign-in] failed", caught);
      setError(describe(caught));
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="flex rounded-full border border-white/10 bg-white/5 p-1">
        {(
          [
            { value: "signIn", label: "Sign in" },
            { value: "signUp", label: "Create account" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => {
              setMode(tab.value);
              setError(null);
            }}
            className={cn(
              "flex-1 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              mode === tab.value
                ? "bg-white text-ink-950"
                : "text-white/60 hover:text-white",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {mode === "signUp" && (
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm text-white/80">
            Your name
          </Label>
          <Input
            id="name"
            name="name"
            autoComplete="name"
            required
            placeholder="Michael Curtin"
            className="h-12 rounded-xl border-white/15 bg-white/5 text-white placeholder:text-white/30"
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm text-white/80">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@soldenpaintandpanel.com.au"
          className="h-12 rounded-xl border-white/15 bg-white/5 text-white placeholder:text-white/30"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm text-white/80">
          Password
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete={mode === "signUp" ? "new-password" : "current-password"}
          required
          minLength={8}
          placeholder="••••••••"
          className="h-12 rounded-xl border-white/15 bg-white/5 text-white placeholder:text-white/30"
        />
        {mode === "signUp" && (
          <p className="text-xs text-white/40">At least 8 characters.</p>
        )}
      </div>

      {error !== null && (
        <p className="flex items-start gap-2 rounded-xl border border-red-500/25 bg-red-500/10 p-3 text-sm text-red-200">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-500 text-sm font-semibold text-ink-950 transition-colors hover:bg-brand-400 disabled:opacity-70"
      >
        {submitting && <Loader2 className="size-4 animate-spin" />}
        {mode === "signUp" ? "Create account" : "Sign in"}
      </button>
    </form>
  );
}
