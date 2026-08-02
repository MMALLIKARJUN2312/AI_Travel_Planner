import { z } from "zod";

export const regenerateActivitySchema = z.object({
  slot: z.enum(["morning", "afternoon", "evening"]),
  instruction: z.string().trim().min(1).max(300).optional(),
});

export type RegenerateActivityDto = z.infer<typeof regenerateActivitySchema>;
