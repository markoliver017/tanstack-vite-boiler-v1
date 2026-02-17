import { z } from "zod";

export const assignFormatSchema = z.object({
    cinemaId: z.coerce.number().min(1, "Cinema is required"),
    cinemaFormatId: z.coerce.number().min(1, "Format is required"),
    seatCount: z.coerce.number().min(0).optional(),
    isPrimary: z.boolean().default(false),
});

export type AssignFormatValues = z.infer<typeof assignFormatSchema>;

export const cinemaFormatMapResponseSchema = z.object({
    id: z.number(),
    cinemaId: z.number(),
    cinemaFormatId: z.number(),
    seatCount: z.number().nullable(),
    isPrimary: z.boolean(),
    createdAt: z.string().nullable(),
    cinemaFormat: z.object({
        id: z.number(),
        code: z.string(),
        label: z.string(),
        description: z.string().nullable(),
    }),
    cinema: z.object({
        id: z.number(),
        name: z.string(),
    }),
});

export type CinemaFormatMapResponse = z.infer<
    typeof cinemaFormatMapResponseSchema
>;
