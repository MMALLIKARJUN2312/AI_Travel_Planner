import { GoogleGenAI } from "@google/genai";
import { AppError } from "../../../core/errors/app-error.js";
import { logger } from "../../../core/logger/logger.js";
import { AiProvider } from "./ai-provider.interface.js";

export class GeminiProvider implements AiProvider {
  private readonly client: GoogleGenAI;

  constructor(
    apiKey: string,
    private readonly model: string
  ) {
    this.client = new GoogleGenAI({ apiKey });
  }

  async generateContent(prompt: string): Promise<string> {
    try {
      const response = await this.client.models.generateContent({
        model: this.model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.7,
        },
      });

      const text = response.text;

      if (!text) {
        throw new Error("Empty response from Gemini");
      }

      return text;
    } catch (error) {
      logger.error("Gemini generation failed", {
        error: error instanceof Error ? error.message : "Unknown error",
      });
      throw new AppError("AI service unavailable, please try again shortly", 502);
    }
  }
}
