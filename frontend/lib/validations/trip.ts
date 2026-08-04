import { z } from "zod";

export const budgetTypeOptions = [
  { value: "BUDGET", label: "Budget-friendly" },
  { value: "MID_RANGE", label: "Mid-range" },
  { value: "LUXURY", label: "Luxury" },
] as const;

export const currencyOptions = [
  { value: "USD", label: "US Dollar", flag: "🇺🇸" },
  { value: "EUR", label: "Euro", flag: "🇪🇺" },
  { value: "GBP", label: "British Pound", flag: "🇬🇧" },
  { value: "JPY", label: "Japanese Yen", flag: "🇯🇵" },
  { value: "CAD", label: "Canadian Dollar", flag: "🇨🇦" },
  { value: "AUD", label: "Australian Dollar", flag: "🇦🇺" },
  { value: "NZD", label: "New Zealand Dollar", flag: "🇳🇿" },
  { value: "CHF", label: "Swiss Franc", flag: "🇨🇭" },
  { value: "INR", label: "Indian Rupee", flag: "🇮🇳" },
  { value: "SGD", label: "Singapore Dollar", flag: "🇸🇬" },
  { value: "HKD", label: "Hong Kong Dollar", flag: "🇭🇰" },
  { value: "KRW", label: "South Korean Won", flag: "🇰🇷" },
  { value: "THB", label: "Thai Baht", flag: "🇹🇭" },
  { value: "IDR", label: "Indonesian Rupiah", flag: "🇮🇩" },
  { value: "AED", label: "UAE Dirham", flag: "🇦🇪" },
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

const currencyCodes = currencyOptions.map((option) => option.value) as [string, ...string[]];

export const createTripSchema = z.object({
  destination: z.string().trim().min(2, "Enter a destination").max(100, "Destination is too long"),
  originCity: z.string().trim().min(2, "Enter your departure city").max(100, "Departure city is too long"),
  numberOfDays: z
    .number({ error: "Enter the number of days" })
    .int("Must be a whole number")
    .min(1, "At least 1 day")
    .max(30, "At most 30 days"),
  budgetType: z.enum(["BUDGET", "MID_RANGE", "LUXURY"], { error: "Choose a budget level" }),
  currency: z.enum(currencyCodes, { error: "Choose a currency" }),
  interests: z
    .array(z.string().trim().min(1).max(40))
    .min(1, "Pick at least one interest")
    .max(20),
});

export type CreateTripFormValues = z.infer<typeof createTripSchema>;
