"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

type AuthGateMode = "require-auth" | "guest-only";

function FullscreenLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div
        role="status"
        aria-label="Loading"
        className="size-8 animate-spin rounded-full border-2 border-muted border-t-primary"
      />
    </div>
  );
}

export function AuthGate({
  mode,
  redirectTo,
  children,
}: {
  mode: AuthGateMode;
  redirectTo: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const accessToken = useAuthStore((s) => s.accessToken);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const isAuthed = Boolean(accessToken);
  const shouldRedirect = (mode === "require-auth" && !isAuthed) || (mode === "guest-only" && isAuthed);

  useEffect(() => {
    if (hasHydrated && shouldRedirect) {
      router.replace(redirectTo);
    }
  }, [hasHydrated, shouldRedirect, redirectTo, router]);

  if (!hasHydrated || shouldRedirect) {
    return <FullscreenLoader />;
  }

  return <>{children}</>;
}
