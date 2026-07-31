import { GenerateFullTripInput } from "../types/ai-input.types.js";

export const buildItineraryPrompt = (input: GenerateFullTripInput): string => {
  const { destination, numberOfDays, budgetType, interests } = input;

  return `
MODE: FULL_TRIP
DESTINATION: ${destination}
NUMBER_OF_DAYS: ${numberOfDays}
BUDGET_TYPE: ${budgetType}
INTERESTS: ${interests.join(", ")}

You are an expert travel planner AI. Design a complete ${numberOfDays}-day trip to ${destination} for a traveler interested in ${interests.join(", ")}, targeting a ${budgetType} budget level.

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
- All monetary values are numbers in USD, no currency symbols or strings.
- "confidenceLevel" is a number between 0 and 1.
- "hotelSuggestions" must contain exactly 3 hotels spanning budget, mid-range, and luxury options.
- "riskScore" is a number between 0 and 100 reflecting realistic risk for ${destination}; "riskLevel" must be consistent with the score (LOW < 34, MEDIUM 34-66, HIGH > 66).
- "alternativeActivities" should be indoor/low-risk alternatives a traveler could swap in if the flagged risks materialize.
- Never wrap the JSON in markdown code fences or add any text outside the JSON object.
`.trim();
};
