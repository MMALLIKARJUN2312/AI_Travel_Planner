import { z } from "zod";

export const budgetTypeOptions = [
  { value: "BUDGET", label: "Budget-friendly" },
  { value: "MID_RANGE", label: "Mid-range" },
  { value: "LUXURY", label: "Luxury" },
] as const;

export const interestOptions = [
  "Food",
  "Culture",
  "Adventure",
  "Shopping",
  "Nature",
  "Nightlife",
  "History",
  "Relaxation",
  "Art",
  "Sports",
] as const;

export const createTripSchema = z.object({
  destination: z.string().trim().min(2, "Enter a destination").max(100, "Destination is too long"),
  numberOfDays: z
    .number({ error: "Enter the number of days" })
    .int("Must be a whole number")
    .min(1, "At least 1 day")
    .max(30, "At most 30 days"),
  budgetType: z.enum(["BUDGET", "MID_RANGE", "LUXURY"], { error: "Choose a budget level" }),
  interests: z.array(z.string()).min(1, "Pick at least one interest").max(20),
});

export type CreateTripFormValues = z.infer<typeof createTripSchema>;
