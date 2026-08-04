"use client";

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { ActivityRowContent } from "@/components/trips/activity-row-content";
import { useReorderActivities } from "@/hooks/use-trip-edit";
import { cn } from "@/lib/utils";
import { Activity, ItinerarySlot } from "@/types/trip.types";

export function SortableActivityList({
  tripId,
  dayNumber,
  slot,
  activities,
  currency,
}: {
  tripId: string;
  dayNumber: number;
  slot: ItinerarySlot;
  activities: Activity[];
  currency: string;
}) {
  const reorderActivities = useReorderActivities(tripId);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = activities.findIndex((activity) => activity._id === active.id);
    const newIndex = activities.findIndex((activity) => activity._id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const newOrder = arrayMove(activities, oldIndex, newIndex);
    reorderActivities.mutate({ dayNumber, slot, activityIds: newOrder.map((activity) => activity._id) });
  };

  if (activities.length <= 1) {
    return (
      <div className="flex flex-col divide-y">
        {activities.map((activity) => (
          <div key={activity._id} className="flex items-start gap-2 py-2 pl-1">
            <ActivityRowContent
              tripId={tripId}
              dayNumber={dayNumber}
              slot={slot}
              activity={activity}
              currency={currency}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={activities.map((activity) => activity._id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col divide-y">
          {activities.map((activity) => (
            <SortableActivityRow
              key={activity._id}
              tripId={tripId}
              dayNumber={dayNumber}
              slot={slot}
              activity={activity}
              currency={currency}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

function SortableActivityRow({
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
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: activity._id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn("flex items-start gap-2 py-2", isDragging && "z-10 opacity-50")}
    >
      <button
        type="button"
        className="mt-1 shrink-0 cursor-grab touch-none text-muted-foreground hover:text-foreground active:cursor-grabbing"
        aria-label="Drag to reorder"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="size-4" />
      </button>
      <ActivityRowContent tripId={tripId} dayNumber={dayNumber} slot={slot} activity={activity} currency={currency} />
    </div>
  );
}
