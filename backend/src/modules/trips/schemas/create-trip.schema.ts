import {z} from "zod";
import { BudgetType } from "../types/budget-type.enum.js";
import { Currency } from "../types/currency.enum.js";

export const createTripSchema = z.object({
    destination : z
        .string()
        .trim()
        .min(2)
        .max(100),
    originCity : z
        .string()
        .trim()
        .min(2)
        .max(100),
    numberOfDays : z
        .number()
        .int()
        .min(1)
        .max(30),
    budgetType : z.enum(
        Object.values(BudgetType) as [
            string,
            ...string[]
        ]
    ),
    currency : z.enum(
        Object.values(Currency) as [
            string,
            ...string[]
        ]
    ),
    interests : z
        .array(z.string().trim().min(1).max(40))
        .min(1)
        .max(20)
})

export type CreateTripDto = z.infer<typeof createTripSchema>