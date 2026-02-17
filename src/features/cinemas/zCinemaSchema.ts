import { z } from "zod";

// Response schema for cinema list items
export const cinemaResponseSchema = z.object({
    id: z.number(),
    theaterId: z.number(),
    name: z.string(),
    geofenceRadius: z.number(),
    isActive: z.boolean(),
    createdAt: z.string().nullable(),
    updatedAt: z.string().nullable(),
    // Relations
    theater: z
        .object({
            id: z.number(),
            name: z.string(),
            theaterGroup: z
                .object({
                    id: z.number(),
                    name: z.string(),
                })
                .optional(),
        })
        .optional(),
});

export type CinemaResponse = z.infer<typeof cinemaResponseSchema>;

// Form schema for creating/editing cinemas
export const createCinemaSchema = z.object({
    theaterId: z.number({ message: "Theater is required" }),
    name: z.string().min(1, "Cinema name is required").max(120),
    geofenceRadius: z.number().min(1).default(100),
    isActive: z.boolean().default(true),
});

export type CreateCinemaValues = z.infer<typeof createCinemaSchema>;

// Search params schema for URL
export const cinemaSearchSchema = z.object({
    page: z.number().optional().catch(1),
    limit: z.number().optional().catch(10),
    q: z.string().optional(),
    theater_id: z.number().optional(),
});

export type CinemaSearch = z.infer<typeof cinemaSearchSchema>;
