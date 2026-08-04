import { GenerateFullTripInput } from "../types/ai-input.types.js";

export const buildItineraryPrompt = (input: GenerateFullTripInput): string => {
  const { destination, originCity, numberOfDays, budgetType, currency, interests } = input;

  return `
MODE: FULL_TRIP
DESTINATION: ${destination}
ORIGIN_CITY: ${originCity}
NUMBER_OF_DAYS: ${numberOfDays}
BUDGET_TYPE: ${budgetType}
CURRENCY: ${currency}
INTERESTS: ${interests.join(", ")}

You are an expert travel planner AI. Design a complete ${numberOfDays}-day trip to ${destination} for a traveler departing from ${originCity}, interested in ${interests.join(", ")}, targeting a ${budgetType} budget level.

Also assess realistic travel-safety risk (weather, seasonal hazards, common traveler safety concerns) for this destination and provide mitigation guidance.

Respond with ONLY raw JSON. No markdown, no code fences, no explanations before or after. The JSON must match this exact shape:

{
  "itinerary": [
    {
      "dayNumber": number,
      "title": string,
      "morning": [{ "title": string, "description": string, "duration": string, "estimatedCost": number }],
      "afternoon": [{ "title": string, "description": string, "duration": string, "estimatedCost": number }],
      "evening": [{ "title": string, "description": string, "duration": string, "estimatedCost": number }],
      "tips": [string],
      "estimatedCost": number
    }
  ],
  "budgetEstimate": {
    "flights": number,
    "accommodation": number,
    "food": number,
    "transportation": number,
    "activities": number,
    "total": number,
    "confidenceLevel": number
  },
  "hotelSuggestions": [
    { "name": string, "rating": number, "priceRange": string, "description": string }
  ],
  "riskAssessment": {
    "riskScore": number,
    "riskLevel": "LOW" | "MEDIUM" | "HIGH",
    "recommendations": [string],
    "alternativeActivities": [string]
  }
}

Rules:
- "itinerary" must contain exactly ${numberOfDays} entries with "dayNumber" from 1 to ${numberOfDays}, in order.
- Each day must include at least one activity in each of morning/afternoon/evening.
- All monetary values are numbers in ${currency}, no currency symbols or strings. Price them realistically for ${currency}'s actual numeric scale in that country/region (e.g. Japanese Yen, Indonesian Rupiah, and Korean Won amounts are nominally much larger than US Dollar amounts for the same real value) — do not just take a USD estimate and relabel it.
- "budgetEstimate.flights" must reflect a realistic round-trip cost for the specific route from ${originCity} to ${destination}, not a generic average.
- "confidenceLevel" is a number between 0 and 1.
- "hotelSuggestions" must contain exactly 3 hotels spanning budget, mid-range, and luxury options.
- "riskScore" is a number between 0 and 100 reflecting realistic risk for ${destination}; "riskLevel" must be consistent with the score (LOW < 34, MEDIUM 34-66, HIGH > 66).
- "alternativeActivities" should be indoor/low-risk alternatives a traveler could swap in if the flagged risks materialize.
- Never wrap the JSON in markdown code fences or add any text outside the JSON object.
`.trim();
};
