import { z } from "zod";

export const cinemaFormatResponseSchema = z.object({
    id: z.number(),
    code: z.string(),
    label: z.string(),
    description: z.string().nullable().optional(),
    createdAt: z.string().nullable().optional(),
    updatedAt: z.string().nullable().optional(),
});

export type CinemaFormatResponse = z.infer<typeof cinemaFormatResponseSchema>;

export const createCinemaFormatSchema = z.object({
    code: z
        .string()
        .min(1, "Code is required")
        .max(20, "Code must be 20 characters or less"),
    label: z
        .string()
        .min(1, "Label is required")
        .max(60, "Label must be 60 characters or less"),
    description: z.string().optional(),
});

export type CreateCinemaFormatValues = z.infer<typeof createCinemaFormatSchema>;

export const cinemaFormatSearchSchema = z.object({
    q: z.string().optional(),
    page: z.number().default(1),
    limit: z.number().default(10),
});

export type CinemaFormatSearch = z.infer<typeof cinemaFormatSearchSchema>;
