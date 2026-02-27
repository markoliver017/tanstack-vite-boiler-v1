import { z } from "zod";

export const createMovieScreeningTimeSchema = z.object({
    assignmentId: z.number().int().min(1),
    time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/),
    dateStart: z.string().min(1),
    dateEnd: z.string().optional(),
    isActive: z.boolean().optional(),
});

export type CreateMovieScreeningTimeValues = z.infer<
    typeof createMovieScreeningTimeSchema
>;

export type MovieScreeningTimeResponse = {
    id: number;
    assignmentId: number;
    time: string;
    dateStart: string;
    dateEnd: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
};
