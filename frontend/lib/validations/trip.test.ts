import { createTripSchema } from "./trip";

const validInput = {
  destination: "Tokyo, Japan",
  originCity: "San Francisco, USA",
  numberOfDays: 5,
  budgetType: "MID_RANGE",
  currency: "USD",
  interests: ["Food", "Culture"],
};

describe("createTripSchema", () => {
  it("accepts a valid trip payload", () => {
    const result = createTripSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("rejects a destination shorter than 2 characters", () => {
    const result = createTripSchema.safeParse({ ...validInput, destination: "T" });
    expect(result.success).toBe(false);
  });

  it("rejects zero days", () => {
    const result = createTripSchema.safeParse({ ...validInput, numberOfDays: 0 });
    expect(result.success).toBe(false);
  });

  it("rejects more than 30 days", () => {
    const result = createTripSchema.safeParse({ ...validInput, numberOfDays: 31 });
    expect(result.success).toBe(false);
  });

  it("rejects a non-integer number of days", () => {
    const result = createTripSchema.safeParse({ ...validInput, numberOfDays: 2.5 });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid budget type", () => {
    const result = createTripSchema.safeParse({ ...validInput, budgetType: "FREE" });
    expect(result.success).toBe(false);
  });

  it("rejects an empty interests array", () => {
    const result = createTripSchema.safeParse({ ...validInput, interests: [] });
    expect(result.success).toBe(false);
  });
});
