import { z } from "zod";
import { RiskLevel } from "../../trips/types/risk-level.enum.js";

export const activityAiSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  duration: z.string().min(1),
  estimatedCost: z.number().min(0),
});

export const itineraryDayAiSchema = z.object({
  dayNumber: z.number().int().min(1),
  title: z.string().min(1),
  morning: z.array(activityAiSchema).min(1),
  afternoon: z.array(activityAiSchema).min(1),
  evening: z.array(activityAiSchema).min(1),
  tips: z.array(z.string()),
  estimatedCost: z.number().min(0),
});

export const budgetEstimateAiSchema = z.object({
  flights: z.number().min(0),
  accommodation: z.number().min(0),
  food: z.number().min(0),
  transportation: z.number().min(0),
  activities: z.number().min(0),
  total: z.number().min(0),
  confidenceLevel: z.number().min(0).max(1),
});

export const hotelAiSchema = z.object({
  name: z.string().min(1),
  rating: z.number().min(0).max(5),
  priceRange: z.string().min(1),
  description: z.string().min(1),
});

export const riskAssessmentAiSchema = z.object({
  riskScore: z.number().min(0).max(100),
  riskLevel: z.enum(Object.values(RiskLevel) as [string, ...string[]]),
  recommendations: z.array(z.string()),
  alternativeActivities: z.array(z.string()),
});

export const hotelSuggestionsAiResponseSchema = z.object({
  hotels: z.array(hotelAiSchema).min(1),
});

export const fullTripAiResponseSchema = z.object({
  itinerary: z.array(itineraryDayAiSchema).min(1),
  budgetEstimate: budgetEstimateAiSchema,
  hotelSuggestions: z.array(hotelAiSchema).min(1),
  riskAssessment: riskAssessmentAiSchema,
});

export type FullTripAiResponse = z.infer<typeof fullTripAiResponseSchema>;
export type ItineraryDayAiResponse = z.infer<typeof itineraryDayAiSchema>;
export type ActivityAiResponse = z.infer<typeof activityAiSchema>;
