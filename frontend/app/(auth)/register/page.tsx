import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Create account — AI Travel Planner",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
