import Image from "next/image";
import Link from "next/link";
import { Plane } from "lucide-react";
import { AuthGate } from "@/components/auth/auth-gate";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block">
        <Image
          src="/images/auth-panel.jpg"
          alt="A quiet lantern-lit street in Kyoto, Japan at dusk"
          fill
          priority
          sizes="50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
        <div className="relative z-10 flex h-full flex-col justify-between p-10">
          <Link href="/" className="flex items-center gap-2 font-semibold text-white">
            <span className="flex size-8 items-center justify-center rounded-lg bg-white/15 backdrop-blur-sm">
              <Plane className="size-4" />
            </span>
            AI Travel Planner
          </Link>
          <p className="max-w-sm text-lg text-white/90 text-balance">
            Plan a complete, budget-aware trip in minutes — from departure city to day-by-day
            itinerary.
          </p>
        </div>
      </div>

      <div className="relative flex items-center justify-center overflow-hidden px-4 py-12">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -left-24 -z-10 h-96 w-96 rounded-full bg-primary/20 blur-3xl lg:hidden"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -right-24 -z-10 h-96 w-96 rounded-full bg-secondary/20 blur-3xl lg:hidden"
        />
        <AuthGate mode="guest-only" redirectTo="/dashboard">
          {children}
        </AuthGate>
      </div>
    </div>
  );
}
