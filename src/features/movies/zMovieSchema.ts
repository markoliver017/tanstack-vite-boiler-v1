import { z } from "zod";

export const createMovieSchema = z.object({
    productionCompanyId: z.number().min(1, "Production company is required"),
    agencyId: z.number().min(1, "Agency is required"),
    title: z.string().min(1, "Title is required").max(200),
    distributor: z.string().max(120).optional(),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional(),
});

export const movieSearchSchema = z.object({
    q: z.string().optional(),
    page: z.number().default(1).catch(1),
    limit: z.number().default(10).catch(10),
    productionCompanyId: z.number().optional(),
    agencyId: z.number().optional(),
});

export type CreateMovieValues = z.infer<typeof createMovieSchema>;
export type MovieSearch = z.infer<typeof movieSearchSchema>;

export type MovieResponse = {
    id: number;
    productionCompanyId: number;
    agencyId: number;
    title: string;
    distributor: string | null;
    startDate: string;
    endDate: string | null;
    createdAt: string;
    updatedAt: string;
    productionCompany?: {
        id: number;
        name: string;
        shortCode?: string | null;
    };
    agency?: {
        id: number;
        name: string;
    };
};
