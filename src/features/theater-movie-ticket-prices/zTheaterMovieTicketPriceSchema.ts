import { z } from "zod";

export const createTheaterMovieTicketPriceSchema = z.object({
    theaterId: z.number().int().min(1),
    movieId: z.number().int().min(1),
    cinemaFormatId: z.number().int().optional(),
    cinemaId: z.number().int().optional(),
    basePrice: z.number().min(0),
    validFrom: z.string().min(1),
    validUntil: z.string().optional(),
});

export const theaterMovieTicketPriceSearchSchema = z.object({
    page: z.number().default(1).catch(1),
    limit: z.number().default(10).catch(10),
    theaterId: z.number().optional(),
    movieId: z.number().optional(),
});

export type CreateTheaterMovieTicketPriceValues = z.input<
    typeof createTheaterMovieTicketPriceSchema
>;

export type TheaterMovieTicketPriceResponse = {
    id: number;
    theaterId: number;
    movieId: number;
    cinemaFormatId: number | null;
    cinemaId: number | null;
    basePrice: string;
    validFrom: string;
    validUntil: string | null;
    createdAt: string;
    updatedAt: string;
    theater?: { id: number; name: string };
    movie?: { id: number; title: string };
    cinemaFormat?: { id: number; label: string } | null;
    cinema?: { id: number; name: string } | null;
};
