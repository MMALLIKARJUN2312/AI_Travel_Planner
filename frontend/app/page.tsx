import { CircleDollarSign, MapPinned, ShieldAlert, Sparkles, Wallet } from "lucide-react";
import { Navbar } from "@/components/marketing/navbar";
import { Hero } from "@/components/marketing/hero";
import { DestinationGallery } from "@/components/marketing/destination-gallery";
import { Footer } from "@/components/marketing/footer";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const steps = [
  {
    icon: Sparkles,
    title: "Tell us your trip",
    description:
      "Where you're leaving from, where you're headed, how many days, your budget level, your currency, and what you're into.",
  },
  {
    icon: MapPinned,
    title: "AI builds your itinerary",
    description:
      "A full day-by-day plan with a budget breakdown, hotel picks, and an AI risk & safety assessment — in seconds.",
  },
  {
    icon: Wallet,
    title: "Edit, regenerate, go",
    description:
      "Swap activities, regenerate a day, reorder your schedule, and refresh hotel picks — fully editable, with undo.",
  },
];

const trustPoints = [
  { icon: CircleDollarSign, text: "Budget breakdowns in 15 currencies" },
  { icon: ShieldAlert, text: "AI risk & safety advisor on every trip" },
  { icon: Sparkles, text: "Fully editable, day by day" },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <Navbar />

      <main className="flex flex-1 flex-col">
        <Hero />

        <section className="border-b border-border/60 bg-muted/40 px-4 py-4 sm:px-6">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-muted-foreground">
            {trustPoints.map((point) => (
              <span key={point.text} className="flex items-center gap-2">
                <point.icon className="size-4 text-primary" />
                {point.text}
              </span>
            ))}
          </div>
        </section>

        <DestinationGallery />

        <section className="px-4 pb-24 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-8 max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl">
              How it works
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {steps.map((step) => (
                <Card key={step.title}>
                  <CardHeader>
                    <span className="mb-2 flex size-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                      <step.icon className="size-4" />
                    </span>
                    <CardTitle>{step.title}</CardTitle>
                    <CardDescription>{step.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
