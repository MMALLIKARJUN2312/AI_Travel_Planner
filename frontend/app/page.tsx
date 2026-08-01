import { Sparkles, Wallet, ShieldAlert } from "lucide-react";
import { Navbar } from "@/components/marketing/navbar";
import { HeroCta } from "@/components/marketing/hero-cta";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const features = [
  {
    icon: Sparkles,
    title: "AI-generated itineraries",
    description: "Tell us your destination, days, budget, and interests — get a full day-by-day plan in seconds.",
  },
  {
    icon: Wallet,
    title: "Real budget estimates",
    description: "Flights, hotels, food, and activities broken down, with hotel picks matched to your budget.",
  },
  {
    icon: ShieldAlert,
    title: "AI Risk & Safety Advisor",
    description: "Every trip gets a safety/weather risk score with mitigation tips and backup activity ideas.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <Navbar />

      <main className="flex flex-1 flex-col">
        <section className="relative overflow-hidden px-4 py-24 sm:px-6">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl"
          />
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
            <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              Plan your next trip with an AI travel agent
            </h1>
            <p className="max-w-xl text-lg text-muted-foreground text-balance">
              Give us your destination, dates, and interests. Get a complete itinerary, budget
              breakdown, and hotel picks — editable and regenerable, day by day.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <HeroCta />
            </div>
          </div>
        </section>

        <section className="px-4 pb-24 sm:px-6">
          <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title}>
                <CardHeader>
                  <span className="mb-2 flex size-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    <feature.icon className="size-4" />
                  </span>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
