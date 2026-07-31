import { RegenerateDayInput } from "../types/ai-input.types.js";

export const buildRegenerateDayPrompt = (input: RegenerateDayInput): string => {
  const { destination, dayNumber, budgetType, interests, instruction } = input;

  return `
MODE: REGENERATE_DAY
DESTINATION: ${destination}
DAY_NUMBER: ${dayNumber}
BUDGET_TYPE: ${budgetType}
INTERESTS: ${interests.join(", ")}
INSTRUCTION: ${instruction ?? "Provide a fresh alternative plan for this day."}

You are an expert travel planner AI. Redesign day ${dayNumber} of a trip to ${destination} for a traveler interested in ${interests.join(", ")}, targeting a ${budgetType} budget level. Follow this specific instruction: "${instruction ?? "Provide a fresh alternative plan for this day."}"

Respond with ONLY raw JSON for a SINGLE itinerary day. No markdown, no code fences, no explanations. The JSON must match this exact shape:

{
  "dayNumber": ${dayNumber},
  "title": string,
  "morning": [{ "title": string, "description": string, "duration": string, "estimatedCost": number }],
  "afternoon": [{ "title": string, "description": string, "duration": string, "estimatedCost": number }],
  "evening": [{ "title": string, "description": string, "duration": string, "estimatedCost": number }],
  "tips": [string],
  "estimatedCost": number
}

Rules:
- "dayNumber" must be exactly ${dayNumber}.
- Include at least one activity in each of morning/afternoon/evening.
- All monetary values are numbers in USD, no currency symbols or strings.
- Never wrap the JSON in markdown code fences or add any text outside the JSON object.
`.trim();
};
