import type { Metadata } from "next";
import { Suspense } from "react";
import { RegisterPageContent } from "@/components/auth/register-page-content";

export const metadata: Metadata = {
  title: "Create account — AI Travel Planner",
};

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterPageContent />
    </Suspense>
  );
}
