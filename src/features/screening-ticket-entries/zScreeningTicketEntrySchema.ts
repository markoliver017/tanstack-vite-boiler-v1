import { z } from "zod";

export const createScreeningTicketEntrySchema = z.object({
    screeningId: z.number(),
    ticketTypeId: z.number("Ticket Type is required"),
    quantity: z.number().min(1, "Quantity must be 0 or more"),
    remarks: z.string().optional(),
    discountSnapshot: z.number(),
    culturalTaxSnapshot: z.number(),
    effectivePrice: z.number(),
    grossAmount: z.number(),
    taxAmount: z.number(),
    netAmount: z.number(),
});

export type CreateScreeningTicketEntryValues = z.infer<
    typeof createScreeningTicketEntrySchema
>;

export const screeningTicketEntryResponseSchema = z.object({
    id: z.number(),
    screeningId: z.number(),
    ticketTypeId: z.number(),
    quantity: z.number(),
    remarks: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
    ticketType: z
        .object({
            id: z.number(),
            name: z.string(),
        })
        .optional(),
});

export type ScreeningTicketEntryResponse = z.infer<
    typeof screeningTicketEntryResponseSchema
>;

export const bulkCreateScreeningTicketEntrySchema = z.object({
    entries: z.array(
        z.object({
            screeningId: z.number(),
            ticketTypeId: z.number().min(1, "Ticket Type is required"),
            quantity: z.number().min(1, "Quantity must be 1 or more"),
            remarks: z.string().optional(),
            discountSnapshot: z.number(),
            culturalTaxSnapshot: z.number(),
            effectivePrice: z.number(),
            grossAmount: z.number(),
            taxAmount: z.number(),
            netAmount: z.number(),
        }),
    ),
});

export type BulkCreateScreeningTicketEntryValues = z.infer<
    typeof bulkCreateScreeningTicketEntrySchema
>;
