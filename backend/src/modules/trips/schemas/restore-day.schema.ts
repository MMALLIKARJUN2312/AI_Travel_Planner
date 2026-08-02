import { z } from "zod";

const activitySchema = z.object({
  title: z.string().trim().min(1).max(150),
  description: z.string().trim().min(1).max(500),
  duration: z.string().trim().min(1).max(50),
  estimatedCost: z.number().min(0),
});

export const restoreDaySchema = z.object({
  title: z.string().trim().min(1).max(150),
  morning: z.array(activitySchema),
  afternoon: z.array(activitySchema),
  evening: z.array(activitySchema),
  tips: z.array(z.string()),
  estimatedCost: z.number().min(0),
});

export type RestoreDayDto = z.infer<typeof restoreDaySchema>;
