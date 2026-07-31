import { z } from "zod";

export const regenerateDaySchema = z.object({
  dayNumber: z.number().int().min(1),
  instruction: z.string().trim().min(1).max(300).optional(),
});

export type RegenerateDayDto = z.infer<typeof regenerateDaySchema>;
