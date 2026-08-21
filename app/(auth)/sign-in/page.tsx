import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SignInForm } from "@/components/dashboard/sign-in-form";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Staff sign in for the Solden Paint & Panel lead dashboard.",
  robots: { index: false, follow: false },
};

export default function SignInPage() {
  return (
    <main className="flex min-h-screen flex-col bg-ink-950">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-0 size-[560px] rounded-full bg-brand-600/12 blur-3xl"
      />

      <div className="relative flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/images/brand/swoosh.png"
              alt=""
              width={512}
              height={512}
              className="h-10 w-auto drop-shadow-[0_0_12px_rgba(57,255,20,0.4)]"
            />
            <span className="flex flex-col leading-none">
              <span className="text-xl font-semibold tracking-tight text-white">
                SOLDEN
              </span>
              <span className="text-[11px] font-medium text-brand-neon">
                Paint &amp; Panel
              </span>
            </span>
          </Link>

          <div className="mt-9 rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur">
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              Staff sign in
            </h1>
            <p className="mt-2 text-sm text-white/60">
              The lead dashboard is for Solden staff. Accounts are created by
              invitation only.
            </p>

            <div className="mt-8">
              <SignInForm />
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-white/40">
            <Link href="/" className="transition-colors hover:text-white/70">
              ← Back to the website
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
