import { z } from "zod";

export const hourlyTicketEntrySchema = z.object({
    ticketTypeId: z.number().int().min(1),
    quantity: z.number().int().min(0),
});

export const createHourlyReportSchema = z.object({
    cinemaId: z.number().int().min(1),
    movieId: z.number().int().min(1),
    cinemaFormatId: z.number().int().optional(),
    reportDate: z.string().min(1),
    reportTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/),
    ticketEntries: z.array(hourlyTicketEntrySchema).min(1),
});

export const hourlyReportSearchSchema = z.object({
    page: z.number().default(1).catch(1),
    limit: z.number().default(10).catch(10),
    cinemaId: z.number().optional(),
    movieId: z.number().optional(),
    reportDate: z.string().optional(),
    reportTime: z.string().optional(),
    status: z.enum(["pending", "approved", "rejected"]).optional(),
});

export type CreateHourlyReportValues = z.input<typeof createHourlyReportSchema>;

export type HourlyTicketEntryResponse = {
    id: number;
    ticketTypeId: number;
    quantity: number;
    discountSnapshot: string;
    culturalTaxSnapshot: string;
    effectivePrice: string;
    grossAmount: string;
    taxAmount: string;
    netAmount: string;
    ticketType?: { id: number; name: string };
};

export type HourlyReportResponse = {
    id: number;
    cinemaId: number;
    movieId: number;
    cinemaFormatId: number | null;
    checkerId: string;
    reportDate: string;
    reportTime: string;
    status: "pending" | "approved" | "rejected";
    createdAt: string;
    updatedAt: string;
    cinema?: { id: number; name: string };
    movie?: { id: number; title: string };
    cinemaFormat?: { id: number; label: string } | null;
    ticketEntries?: HourlyTicketEntryResponse[];
};

export type PreviewResponse = {
    cinemaId: number;
    movieId: number;
    cinemaFormatId: number | null;
    reportDate: string;
    reportTime: string;
    entries: Array<{
        ticketTypeId: number;
        quantity: number;
        basePrice: number;
        discountAmount: number;
        discountedPrice: number;
        culturalTaxDeduction: number;
        effectivePrice: number;
        grossAmount: number;
        taxAmount: number;
        netAmount: number;
    }>;
    totals: {
        totalGross: number;
        totalTax: number;
        totalNet: number;
    };
};
