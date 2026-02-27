import { z } from "zod";

export const createTicketTypeSchema = z.object({
    theaterId: z.number().int().nullable(),
    name: z.string().min(1, "Name is required"),
    discountId: z.number().int().nullable(),
    isTaxable: z.boolean().default(true),
});

export const ticketTypeSearchSchema = z.object({
    q: z.string().optional(),
    page: z.number().default(1).catch(1),
    limit: z.number().default(10).catch(10),
    theaterId: z.number().optional(),
});

export type CreateTicketTypeValues = z.input<typeof createTicketTypeSchema>;
export type TicketTypeSearch = z.infer<typeof ticketTypeSearchSchema>;

export type TicketTypeResponse = {
    id: number;
    theaterId: number | null;
    name: string;
    discountId: number | null;
    isTaxable: boolean;
    createdAt: string;
    updatedAt: string;
    theater?: { id: number; name: string } | null;
    discount?: { id: number; name: string; percentage: string } | null;
};
