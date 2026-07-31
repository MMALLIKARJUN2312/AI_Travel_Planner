import { env } from "../../../config/env.js";
import { logger } from "../../../core/logger/logger.js";
import { AiProvider } from "./ai-provider.interface.js";
import { GeminiProvider } from "./gemini.provider.js";
import { MockProvider } from "./mock.provider.js";

let cachedProvider: AiProvider | null = null;

export const getAiProvider = (): AiProvider => {
  if (cachedProvider) {
    return cachedProvider;
  }

  if (env.AI_PROVIDER === "gemini" && env.GEMINI_API_KEY) {
    logger.info("Using Gemini AI provider", { model: env.GEMINI_MODEL });
    cachedProvider = new GeminiProvider(env.GEMINI_API_KEY, env.GEMINI_MODEL);
  } else {
    logger.warn("Using mock AI provider (no GEMINI_API_KEY configured)");
    cachedProvider = new MockProvider();
  }

  return cachedProvider;
};
