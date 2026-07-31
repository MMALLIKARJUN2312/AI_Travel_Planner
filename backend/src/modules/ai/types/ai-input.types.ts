export type ItinerarySlot = "morning" | "afternoon" | "evening";

export interface GenerateFullTripInput {
  destination: string;
  numberOfDays: number;
  budgetType: string;
  interests: string[];
}

export interface RegenerateDayInput extends GenerateFullTripInput {
  dayNumber: number;
  instruction?: string;
}

export interface RegenerateActivityInput {
  destination: string;
  budgetType: string;
  interests: string[];
  dayNumber: number;
  slot: ItinerarySlot;
  currentActivityTitle?: string;
  instruction?: string;
}

export interface GenerateHotelsInput {
  destination: string;
  budgetType: string;
}
