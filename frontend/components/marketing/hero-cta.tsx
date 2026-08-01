"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function HeroCta() {
  const isAuthed = useAuthStore((s) => Boolean(s.accessToken));

  if (isAuthed) {
    return (
      <Link href="/dashboard" className={cn(buttonVariants({ size: "lg" }))}>
        Go to dashboard
      </Link>
    );
  }

  return (
    <>
      <Link href="/register" className={cn(buttonVariants({ size: "lg" }))}>
        Start planning free
      </Link>
      <Link href="/login" className={cn(buttonVariants({ size: "lg", variant: "outline" }))}>
        Sign in
      </Link>
    </>
  );
}
