"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPinned, Plus, Wallet, Globe2 } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-auth";
import { useTrips } from "@/hooks/use-trips";
import { TripCard } from "@/components/trips/trip-card";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { buttonVariants } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const { data: trips, isLoading: tripsLoading } = useTrips();

  const stats = useMemo(() => {
    const list = trips ?? [];
    const budgetByCurrency = new Map<string, number>();
    for (const trip of list) {
      const currency = trip.currency || "USD";
      budgetByCurrency.set(currency, (budgetByCurrency.get(currency) ?? 0) + (trip.budgetEstimate?.total ?? 0));
    }
    return {
      count: list.length,
      destinations: new Set(list.map((trip) => trip.destination)).size,
      totalBudgetLabel:
        budgetByCurrency.size === 0
          ? formatCurrency(0)
          : Array.from(budgetByCurrency.entries())
              .map(([currency, total]) => formatCurrency(total, currency))
              .join(" · "),
    };
  }, [trips]);

  const recentTrips = (trips ?? []).slice(0, 3);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-border/60 bg-gradient-to-br from-primary/15 via-accent/40 to-secondary/10 px-6 py-6">
        <div>
          {userLoading ? (
            <Skeleton className="h-8 w-64" />
          ) : (
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome{user ? `, ${user.name.split(" ")[0]}` : ""}
            </h1>
          )}
          <p className="mt-1 text-muted-foreground">Here&apos;s an overview of your trips.</p>
        </div>
        <Link href="/trips/new" className={cn(buttonVariants())}>
          <Plus className="size-4" />
          New trip
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={MapPinned} label="Trips planned" value={stats.count} loading={tripsLoading} />
        <StatCard icon={Globe2} label="Destinations" value={stats.destinations} loading={tripsLoading} />
        <StatCard
          icon={Wallet}
          label="Total estimated budget"
          value={stats.totalBudgetLabel}
          loading={tripsLoading}
        />
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Recent trips</h2>
          {recentTrips.length > 0 && (
            <Link href="/trips" className="text-sm text-primary hover:underline">
              View all
            </Link>
          )}
        </div>

        {tripsLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-56 w-full" />
            ))}
          </div>
        ) : recentTrips.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Card>
              <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
                <span className="flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  <MapPinned className="size-6" />
                </span>
                <div>
                  <p className="font-medium">No trips yet</p>
                  <p className="text-sm text-muted-foreground">Plan your first AI-generated itinerary.</p>
                </div>
                <Link href="/trips/new" className={cn(buttonVariants({ size: "sm" }))}>
                  <Plus className="size-4" />
                  Plan a trip
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentTrips.map((trip) => (
              <TripCard key={trip._id} trip={trip} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  loading,
}: {
  icon: typeof MapPinned;
  label: string;
  value: string | number;
  loading: boolean;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
          <Icon className="size-5" />
        </span>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          {loading ? (
            <Skeleton className="mt-1 h-6 w-16" />
          ) : (
            <p className="text-xl font-semibold tabular-nums">{value}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
