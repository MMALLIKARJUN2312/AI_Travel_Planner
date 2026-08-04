"use client";

import { useSearchParams } from "next/navigation";
import { RegisterForm } from "@/components/auth/register-form";

export function RegisterPageContent() {
  const searchParams = useSearchParams();
  const interests = searchParams.get("interests");
  const destination = searchParams.get("destination");

  const params = new URLSearchParams();
  if (destination) params.set("destination", destination);
  if (interests) params.set("interests", interests);
  const redirectTo = params.size > 0 ? `/trips/new?${params.toString()}` : undefined;

  return <RegisterForm redirectTo={redirectTo} />;
}
