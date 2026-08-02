"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAddActivity } from "@/hooks/use-trip-edit";
import { ItinerarySlot } from "@/types/trip.types";

const addActivitySchema = z.object({
  title: z.string().trim().min(1, "Required").max(150),
  description: z.string().trim().min(1, "Required").max(500),
  duration: z.string().trim().min(1, "Required").max(50),
  estimatedCost: z.number({ error: "Enter a cost" }).min(0, "Must be 0 or more"),
});

type AddActivityFormValues = z.infer<typeof addActivitySchema>;

export function AddActivityDialog({
  tripId,
  dayNumber,
  slot,
}: {
  tripId: string;
  dayNumber: number;
  slot: ItinerarySlot;
}) {
  const [open, setOpen] = useState(false);
  const addActivity = useAddActivity(tripId);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddActivityFormValues>({
    resolver: zodResolver(addActivitySchema),
    defaultValues: { title: "", description: "", duration: "", estimatedCost: 0 },
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <DialogTrigger render={<Button variant="ghost" size="sm" />}>
        <Plus className="size-4" />
        Add activity
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add an activity</DialogTitle>
          <DialogDescription>Add a manual activity to this time slot.</DialogDescription>
        </DialogHeader>
        <form
          className="flex flex-col gap-3"
          onSubmit={handleSubmit((values) => {
            addActivity.mutate(
              { dayNumber, slot, activity: values },
              {
                onSuccess: () => {
                  setOpen(false);
                  reset();
                },
              }
            );
          })}
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="activity-title">Title</Label>
            <Input id="activity-title" aria-invalid={Boolean(errors.title)} {...register("title")} />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="activity-description">Description</Label>
            <Textarea
              id="activity-description"
              rows={2}
              aria-invalid={Boolean(errors.description)}
              {...register("description")}
            />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description.message}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="activity-duration">Duration</Label>
              <Input
                id="activity-duration"
                placeholder="2 hours"
                aria-invalid={Boolean(errors.duration)}
                {...register("duration")}
              />
              {errors.duration && <p className="text-xs text-destructive">{errors.duration.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="activity-cost">Est. cost (USD)</Label>
              <Input
                id="activity-cost"
                type="number"
                min={0}
                step="1"
                aria-invalid={Boolean(errors.estimatedCost)}
                {...register("estimatedCost", { valueAsNumber: true })}
              />
              {errors.estimatedCost && (
                <p className="text-xs text-destructive">{errors.estimatedCost.message}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>Cancel</DialogClose>
            <Button type="submit" disabled={addActivity.isPending}>
              Add
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
