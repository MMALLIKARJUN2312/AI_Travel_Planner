"use client";

import Link from "next/link";
import { Plane } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { ThemeToggle } from "@/components/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Navbar() {
  const isAuthed = useAuthStore((s) => Boolean(s.accessToken));

  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/70 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Plane className="size-4" />
          </span>
          AI Travel Planner
        </Link>
        <div className="flex items-center gap-2">
          {isAuthed ? (
            <Link href="/dashboard" className={cn(buttonVariants({ size: "sm" }))}>
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className={cn(buttonVariants({ size: "sm", variant: "ghost" }))}>
                Log in
              </Link>
              <Link href="/register" className={cn(buttonVariants({ size: "sm" }))}>
                Get started
              </Link>
            </>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
