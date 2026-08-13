"use client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/**
 * Shared chrome for every auth-flow page (login, signup, forgot/reset
 * password, verification notices, admin login). Keeps them visually
 * consistent and fills the viewport instead of floating a small card in a
 * sea of empty space.
 */

function TopBarLink({ href, label, icon: Icon }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-sm font-medium text-neutral-600 shadow-sm transition hover:border-amber-300 hover:text-amber-700"
    >
      {Icon && <Icon className="size-4" />}
      {label}
    </Link>
  );
}

export function AuthTopBar({
  backHref = "/",
  backLabel = "Back",
  rightHref,
  rightLabel,
}) {
  return (
    <div className="flex w-full max-w-5xl items-center justify-between pb-4">
      <TopBarLink href={backHref} label={backLabel} icon={ArrowLeft} />
      {rightHref && <TopBarLink href={rightHref} label={rightLabel} />}
    </div>
  );
}

export function AuthShell({ children }) {
  return (
    <div className="flex h-full min-h-full flex-col items-center justify-center overflow-hidden bg-neutral-50 px-4 py-4">
      {children}
    </div>
  );
}

export function AuthCard({ children }) {
  return (
    <div className="flex w-full max-w-5xl flex-1 items-stretch">
      {children}
    </div>
  );
}
