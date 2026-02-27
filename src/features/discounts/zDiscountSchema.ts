import { z } from "zod";

export const createDiscountSchema = z.object({
    discountPct: z.number().min(0),
    validFrom: z.string().min(1),
    validUntil: z.string().optional(),
});

export const discountSearchSchema = z.object({
    page: z.number().default(1).catch(1),
    limit: z.number().default(10).catch(10),
});

export type CreateDiscountValues = z.input<typeof createDiscountSchema>;

export type DiscountResponse = {
    id: number;
    discountPct: string;
    validFrom: string;
    validUntil: string | null;
    createdAt: string;
    updatedAt: string;
};
