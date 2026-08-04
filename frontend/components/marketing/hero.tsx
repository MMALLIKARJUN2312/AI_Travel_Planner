import Image from "next/image";
import Link from "next/link";
import { HeroCta } from "@/components/marketing/hero-cta";

const QUICK_START = [
  { label: "Weekend getaway", interests: "Relaxation,Nature" },
  { label: "Beach escape", interests: "Relaxation,Nature,Food" },
  { label: "Adventure trip", interests: "Adventure,Nature,Sports" },
  { label: "Culture & food", interests: "Culture,History,Food" },
] as const;

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[85vh] items-center overflow-hidden">
      <Image
        src="/images/hero.jpg"
        alt="A traditional houseboat gliding through the palm-lined backwaters of Kerala, India"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-start gap-6 px-4 py-24 sm:px-6">
        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-balance text-white sm:text-5xl">
          Plan your next trip with an AI travel agent
        </h1>
        <p className="max-w-xl text-lg text-balance text-white/85">
          Tell us where you&apos;re leaving from, where you&apos;re headed, your budget, and your
          currency. Get a complete itinerary, budget breakdown, and hotel picks — editable and
          regenerable, day by day.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <HeroCta />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {QUICK_START.map((item) => (
            <Link
              key={item.label}
              href={`/register?interests=${encodeURIComponent(item.interests)}`}
              className="rounded-full border border-white/30 bg-white/10 px-3 py-1.5 text-sm text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
