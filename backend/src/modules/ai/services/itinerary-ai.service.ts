import { ZodType } from "zod";
import { AppError } from "../../../core/errors/app-error.js";
import { logger } from "../../../core/logger/logger.js";
import { buildItineraryPrompt } from "../prompts/itinerary.prompt.js";
import { buildRegenerateDayPrompt } from "../prompts/regenerate-day.prompt.js";
import { buildRegenerateActivityPrompt } from "../prompts/regenerate-activity.prompt.js";
import { buildHotelsPrompt } from "../prompts/hotels.prompt.js";
import { AiProvider } from "../providers/ai-provider.interface.js";
import {
  activityAiSchema,
  fullTripAiResponseSchema,
  hotelSuggestionsAiResponseSchema,
  itineraryDayAiSchema,
} from "../schemas/ai-response.schema.js";
import {
  GenerateFullTripInput,
  GenerateHotelsInput,
  RegenerateActivityInput,
  RegenerateDayInput,
} from "../types/ai-input.types.js";

const stripCodeFences = (raw: string): string => {
  const trimmed = raw.trim();
  const fenceMatch = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  return fenceMatch ? fenceMatch[1].trim() : trimmed;
};

export class ItineraryAiService {
  constructor(private readonly provider: AiProvider) {}

  private async generateStructured<T>(
    prompt: string,
    schema: ZodType<T>,
    maxRetries = 2
  ): Promise<T> {
    let lastError = "";

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      const attemptPrompt =
        attempt === 0
          ? prompt
          : `${prompt}\n\nYour previous response was invalid: ${lastError}\nReturn corrected JSON only, matching the required shape exactly.`;

      let raw: string;

      try {
        raw = await this.provider.generateContent(attemptPrompt);
      } catch (error) {
        if (error instanceof AppError) {
          throw error;
        }
        lastError = error instanceof Error ? error.message : "Unknown provider error";
        logger.warn("AI provider call failed, retrying", { attempt, lastError });
        continue;
      }

      let parsed: unknown;

      try {
        parsed = JSON.parse(stripCodeFences(raw));
      } catch {
        lastError = "response was not valid JSON";
        logger.warn("AI response failed JSON parsing, retrying", { attempt });
        continue;
      }

      const result = schema.safeParse(parsed);

      if (result.success) {
        return result.data;
      }

      lastError = result.error.issues
        .map((issue) => `(${issue.path.join(".")}) ${issue.message}`)
        .join("; ");
      logger.warn("AI response failed schema validation, retrying", { attempt, lastError });
    }

    throw new AppError("AI generation failed, please try again", 502);
  }

  async generateFullTrip(input: GenerateFullTripInput) {
    const prompt = buildItineraryPrompt(input);
    return this.generateStructured(prompt, fullTripAiResponseSchema);
  }

  async regenerateDay(input: RegenerateDayInput) {
    const prompt = buildRegenerateDayPrompt(input);
    return this.generateStructured(prompt, itineraryDayAiSchema);
  }

  async regenerateActivity(input: RegenerateActivityInput) {
    const prompt = buildRegenerateActivityPrompt(input);
    return this.generateStructured(prompt, activityAiSchema);
  }

  async regenerateHotels(input: GenerateHotelsInput) {
    const prompt = buildHotelsPrompt(input);
    const result = await this.generateStructured(prompt, hotelSuggestionsAiResponseSchema);
    return result.hotels;
  }
}
