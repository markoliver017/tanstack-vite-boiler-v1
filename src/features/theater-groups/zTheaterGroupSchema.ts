import { z } from "zod";

export const zTheaterGroupSchema = z.object({
    id: z.number(),
    name: z.string().min(1, "Name is required").max(120),
    shortCode: z.string().min(1, "Short code is required").max(20),
    logoUrl: z
        .string()
        .url("Must be a valid URL")
        .max(255)
        .optional()
        .or(z.literal("")),
    website: z
        .string()
        .url("Must be a valid URL")
        .max(255)
        .optional()
        .or(z.literal("")),
    isActive: z.boolean().default(true),
    createdAt: z.string().or(z.date()),
    updatedAt: z.string().or(z.date()).nullable(),
});

export const zCreateTheaterGroupSchema = zTheaterGroupSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});

export const zUpdateTheaterGroupSchema = zCreateTheaterGroupSchema.partial();

export const theaterGroupSearchSchema = z.object({
    query: z.string().optional(),
    page: z.number().default(1).catch(1),
    limit: z.number().default(10).catch(10),
});

export type TheaterGroup = z.infer<typeof zTheaterGroupSchema>;
export type CreateTheaterGroup = z.infer<typeof zCreateTheaterGroupSchema>;
export type UpdateTheaterGroup = z.infer<typeof zUpdateTheaterGroupSchema>;
export type TheaterGroupSearch = z.infer<typeof theaterGroupSearchSchema>;
