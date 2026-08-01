import { AuthGate } from "@/components/auth/auth-gate";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -left-24 -z-10 h-96 w-96 rounded-full bg-primary/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -right-24 -z-10 h-96 w-96 rounded-full bg-secondary/20 blur-3xl"
      />
      <AuthGate mode="guest-only" redirectTo="/dashboard">
        {children}
      </AuthGate>
    </div>
  );
}
