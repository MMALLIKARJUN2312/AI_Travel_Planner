import { render, screen } from "@testing-library/react";
import { BudgetBreakdown } from "./budget-breakdown";
import { BudgetEstimate } from "@/types/trip.types";

const budget: BudgetEstimate = {
  flights: 400,
  accommodation: 300,
  food: 150,
  transportation: 50,
  activities: 100,
  total: 1000,
  confidenceLevel: 0.85,
};

describe("BudgetBreakdown", () => {
  it("renders the total and confidence level", () => {
    render(<BudgetBreakdown budget={budget} currency="USD" />);

    expect(screen.getByText("$1,000")).toBeInTheDocument();
    expect(screen.getByText("85% confidence")).toBeInTheDocument();
  });

  it("renders each category with its amount and correct percentage share", () => {
    render(<BudgetBreakdown budget={budget} currency="USD" />);

    expect(screen.getByText("Flights")).toBeInTheDocument();
    expect(screen.getByText("$400 · 40%")).toBeInTheDocument();

    expect(screen.getByText("Accommodation")).toBeInTheDocument();
    expect(screen.getByText("$300 · 30%")).toBeInTheDocument();

    expect(screen.getByText("Food")).toBeInTheDocument();
    expect(screen.getByText("$150 · 15%")).toBeInTheDocument();

    expect(screen.getByText("Transportation")).toBeInTheDocument();
    expect(screen.getByText("$50 · 5%")).toBeInTheDocument();

    expect(screen.getByText("Activities")).toBeInTheDocument();
    expect(screen.getByText("$100 · 10%")).toBeInTheDocument();
  });

  it("omits the donut segment for a category with zero cost", () => {
    const budgetWithNoFlights: BudgetEstimate = { ...budget, flights: 0, total: 600 };
    const { container } = render(<BudgetBreakdown budget={budgetWithNoFlights} currency="USD" />);

    const circles = container.querySelectorAll("circle");
    // one background track circle + one segment per non-zero category (4, since flights is 0)
    expect(circles).toHaveLength(5);
  });
});
