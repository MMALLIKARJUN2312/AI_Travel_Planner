import {z} from 'zod';
import { BudgetType } from '../types/budget-type.enum.js';
import { Currency } from '../types/currency.enum.js';

export const updateTripSchema = z.object({
    destination : z
        .string()
        .trim()
        .min(2)
        .max(100)
        .optional(),

    originCity : z
        .string()
        .trim()
        .min(2)
        .max(100)
        .optional(),

    numberOfDays : z
        .number()
        .int()
        .min(1)
        .max(30)
        .optional(),

    budgetType : z.enum(
        Object.values(BudgetType) as [string, ...string[]])
        .optional(),

    currency : z.enum(
        Object.values(Currency) as [string, ...string[]])
        .optional(),

    interests : z
        .array(z.string())
        .optional(),
})

export type UpdateTripDto = z.infer<typeof updateTripSchema>;