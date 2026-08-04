import { AuthGate } from "@/components/auth/auth-gate";
import { Topbar } from "@/components/app-shell/topbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGate mode="require-auth" redirectTo="/login">
      <div className="flex min-h-screen flex-col">
        <Topbar />
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">{children}</main>
      </div>
    </AuthGate>
  );
}
