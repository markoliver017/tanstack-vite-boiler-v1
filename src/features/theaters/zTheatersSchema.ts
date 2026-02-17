import { z } from "zod";

export const theaterResponseSchema = z.object({
    id: z.number(),
    theaterGroupId: z.number(),
    taxRuleId: z.number(),
    name: z.string(),
    address: z.string(),
    city: z.string(),
    province: z.string().optional().nullable(),
    latitude: z.string().transform((val) => Number(val)), // Decimal comes as string from API
    longitude: z.string().transform((val) => Number(val)), // Decimal comes as string from API
    isActive: z.boolean(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    // Relations
    theaterGroup: z
        .object({
            id: z.number(),
            name: z.string(),
        })
        .optional(),
    taxRule: z
        .object({
            id: z.number(),
            name: z.string(),
            taxRate: z.string(),
        })
        .optional(),
});

export type TheaterResponse = z.infer<typeof theaterResponseSchema>;

export const createTheaterSchema = z.object({
    theaterGroupId: z.number(),
    taxRuleId: z.number(),
    name: z.string().min(1, "Name is required").max(150),
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required").max(80),
    province: z.string().max(80).optional(),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    isActive: z.boolean().default(true),
});

export type CreateTheaterValues = z.infer<typeof createTheaterSchema>;

export const theaterSearchSchema = z.object({
    page: z.number().optional(),
    limit: z.number().optional(),
    q: z.string().optional(),
    theaterGroupId: z.number().optional(),
});

export type TheaterSearch = z.infer<typeof theaterSearchSchema>;
