import { Suspense } from "react";
import { CreateTripForm } from "@/components/trips/create-trip-form";

export default function NewTripPage() {
  return (
    <div className="mx-auto w-full max-w-2xl">
      <Suspense fallback={null}>
        <CreateTripForm />
      </Suspense>
    </div>
  );
}
