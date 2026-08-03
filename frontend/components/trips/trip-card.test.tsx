import { render, screen } from "@testing-library/react";
import { TripCard } from "./trip-card";
import { useDeleteTrip, useDuplicateTrip } from "@/hooks/use-trips";
import { Trip } from "@/types/trip.types";

jest.mock("@/hooks/use-trips", () => ({
  useDuplicateTrip: jest.fn(),
  useDeleteTrip: jest.fn(),
}));

const mockedUseDuplicateTrip = useDuplicateTrip as jest.Mock;
const mockedUseDeleteTrip = useDeleteTrip as jest.Mock;

const trip: Trip = {
  _id: "trip-1",
  userId: "user-1",
  destination: "Kyoto, Japan",
  numberOfDays: 4,
  budgetType: "LUXURY",
  interests: ["Food", "Culture", "Art", "Shopping"],
  itinerary: [],
  budgetEstimate: {
    flights: 0,
    accommodation: 0,
    food: 0,
    transportation: 0,
    activities: 0,
    total: 0,
    confidenceLevel: 0,
  },
  hotelSuggestions: [],
  riskAssessment: {
    riskScore: 20,
    riskLevel: "LOW",
    recommendations: [],
    alternativeActivities: [],
  },
  createdAt: "2026-01-15T00:00:00.000Z",
  updatedAt: "2026-01-15T00:00:00.000Z",
};

describe("TripCard", () => {
  beforeEach(() => {
    mockedUseDuplicateTrip.mockReturnValue({ mutate: jest.fn(), isPending: false });
    mockedUseDeleteTrip.mockReturnValue({ mutate: jest.fn(), isPending: false });
  });

  it("renders the destination, days, budget level, and risk badge", () => {
    render(<TripCard trip={trip} />);

    expect(screen.getByRole("link", { name: "Kyoto, Japan" })).toHaveAttribute(
      "href",
      "/trips/trip-1"
    );
    expect(screen.getByText("4 days")).toBeInTheDocument();
    expect(screen.getByText("Luxury")).toBeInTheDocument();
    expect(screen.getByText("Low risk")).toBeInTheDocument();
  });

  it("shows only the first 3 interests plus an overflow badge", () => {
    render(<TripCard trip={trip} />);

    expect(screen.getByText("Food")).toBeInTheDocument();
    expect(screen.getByText("Culture")).toBeInTheDocument();
    expect(screen.getByText("Art")).toBeInTheDocument();
    expect(screen.queryByText("Shopping")).not.toBeInTheDocument();
    expect(screen.getByText("+1")).toBeInTheDocument();
  });
});
