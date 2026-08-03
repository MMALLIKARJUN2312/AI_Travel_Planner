import { ItineraryAiService } from "../../modules/ai/services/itinerary-ai.service.js";
import { AiProvider } from "../../modules/ai/providers/ai-provider.interface.js";
import { AppError } from "../../core/errors/app-error.js";
import { RegenerateActivityInput } from "../../modules/ai/types/ai-input.types.js";

const validActivityJson = JSON.stringify({
  title: "Sunset Beach Walk",
  description: "A relaxing walk along the shoreline at sunset.",
  duration: "1 hour",
  estimatedCost: 0,
});

const baseInput: RegenerateActivityInput = {
  destination: "Lisbon",
  budgetType: "MID_RANGE",
  interests: ["Nature"],
  dayNumber: 1,
  slot: "evening",
};

function createStubProvider(responses: Array<string | Error>): AiProvider {
  let call = 0;
  return {
    generateContent: jest.fn(async () => {
      const response = responses[Math.min(call, responses.length - 1)];
      call += 1;
      if (response instanceof Error) throw response;
      return response;
    }),
  };
}

describe("ItineraryAiService generateStructured retry logic", () => {
  it("returns parsed data on the first successful attempt", async () => {
    const provider = createStubProvider([validActivityJson]);
    const service = new ItineraryAiService(provider);

    const result = await service.regenerateActivity(baseInput);

    expect(result.title).toBe("Sunset Beach Walk");
    expect(provider.generateContent).toHaveBeenCalledTimes(1);
  });

  it("retries after malformed JSON and succeeds on the next attempt", async () => {
    const provider = createStubProvider(["not json at all", validActivityJson]);
    const service = new ItineraryAiService(provider);

    const result = await service.regenerateActivity(baseInput);

    expect(result.title).toBe("Sunset Beach Walk");
    expect(provider.generateContent).toHaveBeenCalledTimes(2);
  });

  it("retries after schema-invalid JSON and succeeds on the next attempt", async () => {
    const invalidShape = JSON.stringify({ title: "Missing fields" });
    const provider = createStubProvider([invalidShape, validActivityJson]);
    const service = new ItineraryAiService(provider);

    const result = await service.regenerateActivity(baseInput);

    expect(result.title).toBe("Sunset Beach Walk");
    expect(provider.generateContent).toHaveBeenCalledTimes(2);
  });

  it("strips markdown code fences before parsing", async () => {
    const fenced = "```json\n" + validActivityJson + "\n```";
    const provider = createStubProvider([fenced]);
    const service = new ItineraryAiService(provider);

    const result = await service.regenerateActivity(baseInput);

    expect(result.title).toBe("Sunset Beach Walk");
  });

  it("throws a 502 AppError after exhausting all retries", async () => {
    const provider = createStubProvider(["still not json", "still not json", "still not json"]);
    const service = new ItineraryAiService(provider);

    await expect(service.regenerateActivity(baseInput)).rejects.toMatchObject({
      statusCode: 502,
    });
    expect(provider.generateContent).toHaveBeenCalledTimes(3);
  });

  it("immediately rethrows an AppError from the provider without retrying", async () => {
    const provider = createStubProvider([
      new AppError("AI service unavailable, please try again shortly", 502),
    ]);
    const service = new ItineraryAiService(provider);

    await expect(service.regenerateActivity(baseInput)).rejects.toMatchObject({ statusCode: 502 });
    expect(provider.generateContent).toHaveBeenCalledTimes(1);
  });
});
