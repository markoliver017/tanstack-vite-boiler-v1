import { z } from "zod";

export const createCinemaTicketsTemplateSchema = z.object({
    cinemaId: z.number().int().min(1),
    ticketTypeId: z.number().int().min(1),
});

export const cinemaTicketsTemplateSearchSchema = z.object({
    page: z.number().default(1).catch(1),
    limit: z.number().default(10).catch(10),
    cinemaId: z.number().optional(),
    ticketTypeId: z.number().optional(),
});

export type CreateCinemaTicketsTemplateValues = z.input<
    typeof createCinemaTicketsTemplateSchema
>;

export type CinemaTicketsTemplateResponse = {
    id: number;
    cinemaId: number;
    ticketTypeId: number;
    createdAt: string;
    cinema?: { id: number; name: string };
    ticketType?: { id: number; name: string };
};
