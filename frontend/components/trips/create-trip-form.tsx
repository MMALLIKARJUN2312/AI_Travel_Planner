"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Plus, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  budgetTypeOptions,
  CreateTripFormValues,
  createTripSchema,
  currencyOptions,
  interestOptions,
} from "@/lib/validations/trip";
import { useCreateTrip } from "@/hooks/use-trips";

const LOADING_MESSAGES = [
  "Researching your destination…",
  "Mapping out a day-by-day plan…",
  "Balancing your budget…",
  "Matching hotels to your style…",
  "Checking safety and seasonal risks…",
];

export function CreateTripForm() {
  const createTrip = useCreateTrip();
  const searchParams = useSearchParams();
  const [customInterest, setCustomInterest] = useState("");
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateTripFormValues>({
    resolver: zodResolver(createTripSchema),
    defaultValues: {
      destination: "",
      originCity: "",
      numberOfDays: 5,
      budgetType: "MID_RANGE",
      currency: "USD",
      interests: [],
    },
  });

  useEffect(() => {
    const destination = searchParams.get("destination");
    const interests = searchParams.get("interests");
    if (destination) setValue("destination", destination);
    if (interests) setValue("interests", interests.split(",").filter(Boolean));
  }, [searchParams, setValue]);

  if (createTrip.isPending) {
    return <GeneratingState />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Plan a new trip</CardTitle>
          <CardDescription>
            Tell us where you&apos;re headed — our AI agent builds the itinerary, budget, and hotel picks.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            noValidate
            onSubmit={handleSubmit((values) => createTrip.mutate(values))}
            className="flex flex-col gap-6"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="originCity">Leaving from</Label>
                <Input
                  id="originCity"
                  placeholder="New York, USA"
                  aria-invalid={Boolean(errors.originCity)}
                  {...register("originCity")}
                />
                {errors.originCity && (
                  <p className="text-xs text-destructive">{errors.originCity.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="destination">Destination</Label>
                <Input
                  id="destination"
                  placeholder="Tokyo, Japan"
                  aria-invalid={Boolean(errors.destination)}
                  {...register("destination")}
                />
                {errors.destination && (
                  <p className="text-xs text-destructive">{errors.destination.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="numberOfDays">Number of days</Label>
                <Input
                  id="numberOfDays"
                  type="number"
                  min={1}
                  max={30}
                  aria-invalid={Boolean(errors.numberOfDays)}
                  {...register("numberOfDays", { valueAsNumber: true })}
                />
                {errors.numberOfDays && (
                  <p className="text-xs text-destructive">{errors.numberOfDays.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="budgetType">Budget level</Label>
                <Controller
                  control={control}
                  name="budgetType"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="budgetType" className="w-full" aria-invalid={Boolean(errors.budgetType)}>
                        <SelectValue placeholder="Choose a budget level">
                          {(value: string | null) =>
                            budgetTypeOptions.find((option) => option.value === value)?.label ??
                            "Choose a budget level"
                          }
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {budgetTypeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.budgetType && (
                  <p className="text-xs text-destructive">{errors.budgetType.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="currency">Currency</Label>
                <Controller
                  control={control}
                  name="currency"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="currency" className="w-full" aria-invalid={Boolean(errors.currency)}>
                        <SelectValue placeholder="Choose a currency">
                          {(value: string | null) => {
                            const option = currencyOptions.find((o) => o.value === value);
                            return option ? `${option.flag} ${option.value}` : "Choose a currency";
                          }}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {currencyOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.flag} {option.value} — {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.currency && (
                  <p className="text-xs text-destructive">{errors.currency.message}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>Interests</Label>
              <Controller
                control={control}
                name="interests"
                render={({ field }) => {
                  const custom = (field.value ?? []).filter(
                    (v: string) => !(interestOptions as readonly string[]).includes(v)
                  );
                  const addCustomInterest = () => {
                    const trimmed = customInterest.trim();
                    if (!trimmed) return;
                    const exists = (field.value ?? []).some(
                      (v: string) => v.toLowerCase() === trimmed.toLowerCase()
                    );
                    if (!exists) {
                      field.onChange([...(field.value ?? []), trimmed]);
                    }
                    setCustomInterest("");
                  };

                  return (
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-wrap gap-2" role="group" aria-label="Interests">
                        {interestOptions.map((interest) => {
                          const selected = field.value?.includes(interest);
                          return (
                            <button
                              key={interest}
                              type="button"
                              aria-pressed={selected}
                              onClick={() =>
                                field.onChange(
                                  selected
                                    ? field.value.filter((v: string) => v !== interest)
                                    : [...(field.value ?? []), interest]
                                )
                              }
                              className={cn(
                                "rounded-full border px-3 py-1 text-sm transition-colors",
                                selected
                                  ? "border-primary bg-primary text-primary-foreground"
                                  : "border-input bg-transparent hover:bg-accent hover:text-accent-foreground"
                              )}
                            >
                              {interest}
                            </button>
                          );
                        })}
                        {custom.map((interest: string) => (
                          <span
                            key={interest}
                            className="flex items-center gap-1 rounded-full border border-primary bg-primary px-3 py-1 text-sm text-primary-foreground"
                          >
                            {interest}
                            <button
                              type="button"
                              aria-label={`Remove ${interest}`}
                              onClick={() =>
                                field.onChange(field.value.filter((v: string) => v !== interest))
                              }
                              className="rounded-full hover:opacity-75"
                            >
                              <X className="size-3" />
                            </button>
                          </span>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <Input
                          placeholder="Add your own, e.g. Tech & Innovation"
                          value={customInterest}
                          onChange={(e) => setCustomInterest(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addCustomInterest();
                            }
                          }}
                          className="max-w-xs"
                        />
                        <Button type="button" variant="outline" size="sm" onClick={addCustomInterest}>
                          <Plus className="size-4" />
                          Add
                        </Button>
                      </div>
                    </div>
                  );
                }}
              />
              {errors.interests && (
                <p className="text-xs text-destructive">{errors.interests.message}</p>
              )}
            </div>

            <Button type="submit" size="lg" className="w-full sm:w-fit">
              <Sparkles className="size-4" />
              Generate itinerary
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function GeneratingState() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-6 py-16 text-center">
        <div className="relative flex size-16 items-center justify-center">
          <Loader2 className="size-16 animate-spin text-primary/30" />
          <Sparkles className="absolute size-6 text-primary" />
        </div>
        <div>
          <p className="text-lg font-medium">Generating your itinerary</p>
          <p className="text-sm text-muted-foreground">This usually takes 15–30 seconds.</p>
        </div>
        <AnimatePresence mode="wait">
          <CyclingMessage />
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

function CyclingMessage() {
  const index = useMessageCycle();
  return (
    <motion.p
      key={index}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.25 }}
      className="text-sm text-muted-foreground"
    >
      {LOADING_MESSAGES[index]}
    </motion.p>
  );
}

function useMessageCycle() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((current) => (current + 1) % LOADING_MESSAGES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return index;
}
