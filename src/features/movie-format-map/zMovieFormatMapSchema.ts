import { z } from "zod";

export const movieFormatMapSchema = z.object({
    movieId: z.number().min(1, "Movie is required"),
    cinemaFormatId: z.number().min(1, "Format is required"),
    priceAdjustment: z.number().optional(),
});

export type MovieFormatMapValues = z.infer<typeof movieFormatMapSchema>;

export type MovieFormatMapResponse = {
    id: number;
    movieId: number;
    cinemaFormatId: number;
    priceAdjustment: string | null;
    createdAt: string;
    cinemaFormat?: {
        id: number;
        code: string;
        label: string;
    };
};
