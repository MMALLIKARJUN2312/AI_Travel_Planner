"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, MapPinned, Plus, Search } from "lucide-react";
import { useTrips } from "@/hooks/use-trips";
import { TripCard } from "@/components/trips/trip-card";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Trip } from "@/types/trip.types";

const PAGE_SIZE = 9;

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "destination", label: "Destination A–Z" },
] as const;

type SortValue = (typeof SORT_OPTIONS)[number]["value"];

const sortTrips = (trips: Trip[], sort: SortValue) => {
  const sorted = [...trips];
  if (sort === "newest") {
    sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else if (sort === "oldest") {
    sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  } else {
    sorted.sort((a, b) => a.destination.localeCompare(b.destination));
  }
  return sorted;
};

export default function TripsPage() {
  const { data: trips, isLoading } = useTrips();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortValue>("newest");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const list = trips ?? [];
    const query = search.trim().toLowerCase();
    const matched = query ? list.filter((trip) => trip.destination.toLowerCase().includes(query)) : list;
    return sortTrips(matched, sort);
  }, [trips, search, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Your trips</h1>
        <Link href="/trips/new" className={cn(buttonVariants())}>
          <Plus className="size-4" />
          New trip
        </Link>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search by destination…"
            className="pl-8"
            aria-label="Search trips by destination"
          />
        </div>
        <Select value={sort} onValueChange={(value) => setSort(value as SortValue)}>
          <SelectTrigger className="w-full sm:w-48" aria-label="Sort trips">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-56 w-full" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState hasTrips={Boolean(trips?.length)} />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pageItems.map((trip) => (
              <TripCard key={trip._id} trip={trip} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3">
              <Button
                variant="outline"
                size="icon"
                aria-label="Previous page"
                disabled={currentPage <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft className="size-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                aria-label="Next page"
                disabled={currentPage >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function EmptyState({ hasTrips }: { hasTrips: boolean }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed py-16 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
        <MapPinned className="size-6" />
      </span>
      {hasTrips ? (
        <p className="text-sm text-muted-foreground">No trips match your search.</p>
      ) : (
        <>
          <p className="font-medium">No trips yet</p>
          <Link href="/trips/new" className={cn(buttonVariants({ size: "sm" }))}>
            <Plus className="size-4" />
            Plan your first trip
          </Link>
        </>
      )}
    </div>
  );
}
