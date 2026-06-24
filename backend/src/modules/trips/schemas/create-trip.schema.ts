import {z} from "zod";
import { BudgetType } from "../types/budget-type.enum.js";

export const createTripSchema = z.object({
    destination : z
        .string() 
        .trim()
        .min(2)
        .max(100),
    numberOfDays : z 
        .number()
        .int()
        .min(1)
        .max(50),
    budgetType : z.enum(
        Object.values(BudgetType) as [
            string,
            ...string[]
        ]
    ),
    interests : z
        .array(z.string().trim())
        .min(1)
        .max(20)
})

export type CreateTripDto = z.infer<typeof createTripSchema>