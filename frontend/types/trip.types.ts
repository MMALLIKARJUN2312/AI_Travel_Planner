export type BudgetType = "BUDGET" | "MID_RANGE" | "LUXURY";
export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

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
  numberOfDays: number;
  budgetType: BudgetType;
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
  numberOfDays: number;
  budgetType: BudgetType;
  interests: string[];
}
