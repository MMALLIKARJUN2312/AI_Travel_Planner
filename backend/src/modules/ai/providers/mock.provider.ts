import { AiProvider } from "./ai-provider.interface.js";

type BudgetMultiplier = {
  flights: number;
  accommodation: number;
  food: number;
  transportation: number;
  activities: number;
};

const BUDGET_MULTIPLIERS: Record<string, BudgetMultiplier> = {
  BUDGET: { flights: 60, accommodation: 35, food: 15, transportation: 8, activities: 12 },
  MID_RANGE: { flights: 90, accommodation: 70, food: 30, transportation: 15, activities: 25 },
  LUXURY: { flights: 150, accommodation: 180, food: 60, transportation: 30, activities: 55 },
};

// Rough, static approximations of currency scale relative to USD — good enough to make
// mock/dev/test output look plausible per currency. Not real FX rates, never used in prod
// (the real Gemini provider prices amounts directly per the prompt instructions).
const CURRENCY_SCALE: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149,
  CAD: 1.36,
  AUD: 1.52,
  NZD: 1.66,
  CHF: 0.88,
  INR: 83,
  SGD: 1.34,
  HKD: 7.8,
  KRW: 1330,
  THB: 35,
  IDR: 15800,
  AED: 3.67,
};

const scale = (value: number, currency: string): number => {
  const factor = CURRENCY_SCALE[currency] ?? 1;
  return Math.round(value * factor);
};

const SLOT_HOURS: Record<string, string> = {
  morning: "2-3 hours",
  afternoon: "3-4 hours",
  evening: "2 hours",
};

const extract = (prompt: string, label: string): string => {
  const match = prompt.match(new RegExp(`^${label}:\\s*(.+)$`, "m"));
  return match?.[1]?.trim() ?? "";
};

const buildActivity = (destination: string, slot: string, index: number, currency: string) => ({
  title: `${slot === "morning" ? "Explore" : slot === "afternoon" ? "Visit" : "Enjoy"} ${destination} spot #${index + 1}`,
  description: `A recommended ${slot} experience in ${destination}, tailored to your interests.`,
  duration: SLOT_HOURS[slot] ?? "2 hours",
  estimatedCost: scale(15 + index * 5, currency),
});

const buildHotels = (destination: string) => [
  { name: `${destination} Budget Inn`, rating: 3.5, priceRange: "$", description: "Clean, no-frills stay close to public transport." },
  { name: `${destination} Central Hotel`, rating: 4.2, priceRange: "$$", description: "Comfortable mid-range hotel in a central location." },
  { name: `${destination} Grand Resort`, rating: 4.8, priceRange: "$$$", description: "Premium amenities with excellent guest ratings." },
];

const buildDay = (destination: string, dayNumber: number, currency: string) => ({
  dayNumber,
  title: `Day ${dayNumber} in ${destination}`,
  morning: [buildActivity(destination, "morning", 0, currency)],
  afternoon: [buildActivity(destination, "afternoon", 0, currency)],
  evening: [buildActivity(destination, "evening", 0, currency)],
  tips: [`Carry water and comfortable shoes for day ${dayNumber}.`],
  estimatedCost: scale(80, currency),
});

export class MockProvider implements AiProvider {
  async generateContent(prompt: string): Promise<string> {
    const mode = extract(prompt, "MODE");
    const destination = extract(prompt, "DESTINATION") || "your destination";
    const budgetType = extract(prompt, "BUDGET_TYPE") || "MID_RANGE";
    const currency = extract(prompt, "CURRENCY") || "USD";

    if (mode === "REGENERATE_DAY") {
      const dayNumber = Number(extract(prompt, "DAY_NUMBER")) || 1;
      return JSON.stringify(buildDay(destination, dayNumber, currency));
    }

    if (mode === "REGENERATE_ACTIVITY") {
      const slot = extract(prompt, "SLOT") || "morning";
      return JSON.stringify(buildActivity(destination, slot, 0, currency));
    }

    if (mode === "HOTELS") {
      return JSON.stringify({ hotels: buildHotels(destination) });
    }

    const numberOfDays = Number(extract(prompt, "NUMBER_OF_DAYS")) || 3;
    const multiplier = BUDGET_MULTIPLIERS[budgetType] ?? BUDGET_MULTIPLIERS.MID_RANGE;

    const itinerary = Array.from({ length: numberOfDays }, (_, i) => buildDay(destination, i + 1, currency));

    const accommodation = scale(multiplier.accommodation * numberOfDays, currency);
    const food = scale(multiplier.food * numberOfDays, currency);
    const transportation = scale(multiplier.transportation * numberOfDays, currency);
    const activities = scale(multiplier.activities * numberOfDays, currency);
    const flights = scale(multiplier.flights, currency);
    const total = flights + accommodation + food + transportation + activities;

    return JSON.stringify({
      itinerary,
      budgetEstimate: {
        flights,
        accommodation,
        food,
        transportation,
        activities,
        total,
        confidenceLevel: 0.7,
      },
      hotelSuggestions: buildHotels(destination),
      riskAssessment: {
        riskScore: 25,
        riskLevel: "LOW",
        recommendations: [
          `Check the latest travel advisories for ${destination} before departure.`,
          "Keep a digital copy of your documents.",
        ],
        alternativeActivities: [`Indoor cultural sites in ${destination} in case of bad weather`],
      },
    });
  }
}
