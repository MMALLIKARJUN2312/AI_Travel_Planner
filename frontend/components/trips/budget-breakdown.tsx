"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import { BudgetEstimate } from "@/types/trip.types";

const CATEGORIES = [
  { key: "flights", label: "Flights" },
  { key: "accommodation", label: "Accommodation" },
  { key: "food", label: "Food" },
  { key: "transportation", label: "Transportation" },
  { key: "activities", label: "Activities" },
] as const satisfies ReadonlyArray<{ key: keyof BudgetEstimate; label: string }>;

const RADIUS = 70;
const STROKE = 26;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const GAP = 3;

export function BudgetBreakdown({ budget, currency }: { budget: BudgetEstimate; currency: string }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const total = budget.total || 1;

  const shares = CATEGORIES.map((category) => budget[category.key] / total);
  const cumulativeShares = shares.reduce<number[]>((acc, share, i) => {
    acc.push((acc[i - 1] ?? 0) + share);
    return acc;
  }, []);

  const segments = CATEGORIES.map((category, index) => {
    const value = budget[category.key];
    const share = shares[index];
    const cumulativeBefore = index === 0 ? 0 : cumulativeShares[index - 1];
    const segLength = Math.max(share * CIRCUMFERENCE - GAP, 0);
    const offset = -(cumulativeBefore * CIRCUMFERENCE) - GAP / 2;

    return {
      ...category,
      index,
      value,
      share,
      segLength,
      offset,
      color: `var(--chart-${index + 1})`,
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget breakdown</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
        <div className="relative flex size-44 shrink-0 items-center justify-center">
          <svg viewBox="0 0 180 180" className="size-44 -rotate-90">
            <circle cx="90" cy="90" r={RADIUS} fill="none" stroke="var(--muted)" strokeWidth={STROKE} />
            {segments.map((segment) =>
              segment.value > 0 ? (
                <circle
                  key={segment.key}
                  cx="90"
                  cy="90"
                  r={RADIUS}
                  fill="none"
                  stroke={segment.color}
                  strokeWidth={STROKE}
                  strokeDasharray={`${segment.segLength} ${CIRCUMFERENCE - segment.segLength}`}
                  strokeDashoffset={segment.offset}
                  strokeLinecap="butt"
                  onMouseEnter={() => setActiveIndex(segment.index)}
                  onMouseLeave={() => setActiveIndex(null)}
                  className="cursor-default transition-opacity"
                  style={{ opacity: activeIndex === null || activeIndex === segment.index ? 1 : 0.35 }}
                />
              ) : null
            )}
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-2xl font-semibold tabular-nums">{formatCurrency(budget.total, currency)}</span>
            <span className="text-xs text-muted-foreground">
              {Math.round(budget.confidenceLevel * 100)}% confidence
            </span>
          </div>
        </div>

        <ul className="flex w-full flex-col gap-3" aria-label="Budget by category">
          {segments.map((segment) => (
            <li
              key={segment.key}
              onMouseEnter={() => setActiveIndex(segment.index)}
              onMouseLeave={() => setActiveIndex(null)}
              className={cn(
                "flex flex-col gap-1 rounded-md px-1.5 py-1 transition-colors",
                activeIndex === segment.index && "bg-accent"
              )}
            >
              <div className="flex items-center justify-between gap-2 text-sm">
                <span className="flex items-center gap-2 font-medium">
                  <span
                    aria-hidden
                    className="size-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: segment.color }}
                  />
                  {segment.label}
                </span>
                <span className="tabular-nums text-muted-foreground">
                  {formatCurrency(segment.value, currency)} · {Math.round(segment.share * 100)}%
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${segment.share * 100}%`, backgroundColor: segment.color }}
                />
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
