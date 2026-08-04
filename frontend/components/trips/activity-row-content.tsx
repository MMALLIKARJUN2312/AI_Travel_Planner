"use client";

import { useState } from "react";
import { Clock, MoreVertical, RefreshCw, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RegenerateDialog } from "@/components/trips/regenerate-dialog";
import { useRegenerateActivity, useRemoveActivity } from "@/hooks/use-trip-edit";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Activity, ItinerarySlot } from "@/types/trip.types";

export function ActivityRowContent({
  tripId,
  dayNumber,
  slot,
  activity,
  currency,
}: {
  tripId: string;
  dayNumber: number;
  slot: ItinerarySlot;
  activity: Activity;
  currency: string;
}) {
  const [regenerateOpen, setRegenerateOpen] = useState(false);
  const regenerateActivity = useRegenerateActivity(tripId);
  const removeActivity = useRemoveActivity(tripId);

  const isRegenerating =
    regenerateActivity.isPending && regenerateActivity.variables?.activityId === activity._id;

  return (
    <div className={cn("flex flex-1 items-start justify-between gap-3 transition-opacity", isRegenerating && "opacity-50")}>
      <div>
        <p className="text-sm font-medium">{activity.title}</p>
        <p className="text-sm text-muted-foreground">{activity.description}</p>
        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="size-3" />
          {activity.duration}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <span className="text-sm tabular-nums text-muted-foreground">
          {formatCurrency(activity.estimatedCost, currency)}
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger
            className="rounded-md p-1 text-muted-foreground outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
            aria-label="Activity actions"
          >
            <MoreVertical className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setRegenerateOpen(true)}>
              <RefreshCw className="size-4" />
              Regenerate
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => removeActivity.mutate({ dayNumber, slot, activity })}
            >
              <Trash2 className="size-4" />
              Remove
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <RegenerateDialog
        open={regenerateOpen}
        onOpenChange={setRegenerateOpen}
        title="Regenerate activity"
        description={`Get a fresh suggestion in place of "${activity.title}".`}
        placeholder="e.g. something more relaxing, cheaper, outdoors…"
        onConfirm={(instruction) =>
          regenerateActivity.mutate({ dayNumber, activityId: activity._id, slot, instruction })
        }
      />
    </div>
  );
}
