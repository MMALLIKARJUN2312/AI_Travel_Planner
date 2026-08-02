import { z } from "zod";

const slotEnum = z.enum(["morning", "afternoon", "evening"]);

const addActivitySchema = z.object({
  action: z.literal("add"),
  slot: slotEnum,
  activity: z.object({
    title: z.string().trim().min(1).max(150),
    description: z.string().trim().min(1).max(500),
    duration: z.string().trim().min(1).max(50),
    estimatedCost: z.number().min(0),
  }),
});

const removeActivitySchema = z.object({
  action: z.literal("remove"),
  slot: slotEnum,
  activityId: z.string().min(1),
});

const reorderActivitiesSchema = z.object({
  action: z.literal("reorder"),
  slot: slotEnum,
  activityIds: z.array(z.string().min(1)).min(1),
});

export const activityEditSchema = z.discriminatedUnion("action", [
  addActivitySchema,
  removeActivitySchema,
  reorderActivitiesSchema,
]);

export type ActivityEditDto = z.infer<typeof activityEditSchema>;
