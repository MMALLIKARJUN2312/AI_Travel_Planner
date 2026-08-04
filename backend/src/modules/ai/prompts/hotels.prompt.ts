import { GenerateHotelsInput } from "../types/ai-input.types.js";

export const buildHotelsPrompt = (input: GenerateHotelsInput): string => {
  const { destination, budgetType, currency } = input;

  return `
MODE: HOTELS
DESTINATION: ${destination}
BUDGET_TYPE: ${budgetType}
CURRENCY: ${currency}

You are an expert travel planner AI. Suggest 3 hotels in ${destination} suited to a ${budgetType} budget level: one budget-friendly, one mid-range, and one luxury option, reflecting popular traveler ratings.

Respond with ONLY raw JSON. No markdown, no code fences, no explanations. The JSON must match this exact shape:

{
  "hotels": [
    { "name": string, "rating": number, "priceRange": string, "description": string }
  ]
}

Rules:
- Exactly 3 hotels, spanning budget, mid-range, and luxury price points.
- "rating" is a number between 0 and 5.
- Never wrap the JSON in markdown code fences or add any text outside the JSON object.
`.trim();
};
