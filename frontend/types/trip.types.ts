export type BudgetType = "BUDGET" | "MID_RANGE" | "LUXURY";
export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";
export type ItinerarySlot = "morning" | "afternoon" | "evening";

export interface Activity {
  _id: string;
  title: string;
  description: string;
  duration: string;
  estimatedCost: number;
}

export interface ItineraryDay {
  _id: string;
  dayNumber: number;
  title: string;
  morning: Activity[];
  afternoon: Activity[];
  evening: Activity[];
  tips: string[];
  estimatedCost: number;
}

export interface BudgetEstimate {
  flights: number;
  accommodation: number;
  food: number;
  transportation: number;
  activities: number;
  total: number;
  confidenceLevel: number;
}

export interface Hotel {
  name: string;
  rating: number;
  priceRange: string;
  description: string;
}

export interface RiskAssessment {
  riskScore: number;
  riskLevel: RiskLevel;
  recommendations: string[];
  alternativeActivities: string[];
}

export interface Trip {
  _id: string;
  userId: string;
  destination: string;
  originCity: string;
  numberOfDays: number;
  budgetType: BudgetType;
  currency: string;
  interests: string[];
  itinerary: ItineraryDay[];
  budgetEstimate: BudgetEstimate;
  hotelSuggestions: Hotel[];
  riskAssessment: RiskAssessment;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTripInput {
  destination: string;
  originCity: string;
  numberOfDays: number;
  budgetType: BudgetType;
  currency: string;
  interests: string[];
}

export interface RegenerateDayInput {
  dayNumber: number;
  instruction?: string;
}

export interface RegenerateActivityInput {
  dayNumber: number;
  activityId: string;
  slot: ItinerarySlot;
  instruction?: string;
}

export type ActivityEditInput =
  | { action: "add"; slot: ItinerarySlot; activity: Omit<Activity, "_id"> }
  | { action: "remove"; slot: ItinerarySlot; activityId: string }
  | { action: "reorder"; slot: ItinerarySlot; activityIds: string[] };

export interface RestoreDayInput {
  title: string;
  morning: Omit<Activity, "_id">[];
  afternoon: Omit<Activity, "_id">[];
  evening: Omit<Activity, "_id">[];
  tips: string[];
  estimatedCost: number;
}
