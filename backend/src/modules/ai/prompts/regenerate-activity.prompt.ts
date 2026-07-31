import { RegenerateActivityInput } from "../types/ai-input.types.js";

export const buildRegenerateActivityPrompt = (input: RegenerateActivityInput): string => {
  const { destination, dayNumber, slot, budgetType, interests, currentActivityTitle, instruction } = input;

  return `
MODE: REGENERATE_ACTIVITY
DESTINATION: ${destination}
DAY_NUMBER: ${dayNumber}
SLOT: ${slot}
BUDGET_TYPE: ${budgetType}
INTERESTS: ${interests.join(", ")}
CURRENT_ACTIVITY: ${currentActivityTitle ?? "none"}
INSTRUCTION: ${instruction ?? "Suggest a better alternative for this time slot."}

You are an expert travel planner AI. Suggest a single replacement activity for the ${slot} of day ${dayNumber} of a trip to ${destination}, for a traveler interested in ${interests.join(", ")} at a ${budgetType} budget level. The current activity is "${currentActivityTitle ?? "unspecified"}". Follow this instruction: "${instruction ?? "Suggest a better alternative for this time slot."}"

Respond with ONLY raw JSON for a SINGLE activity. No markdown, no code fences, no explanations. The JSON must match this exact shape:

{ "title": string, "description": string, "duration": string, "estimatedCost": number }

Rules:
- The activity must fit within the ${slot} time slot.
- "estimatedCost" is a number in USD, no currency symbols or strings.
- Never wrap the JSON in markdown code fences or add any text outside the JSON object.
`.trim();
};
