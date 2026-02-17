import { z } from "zod";

export const productionCompanyResponseSchema = z.object({
    id: z.number(),
    name: z.string(),
    shortCode: z.string().nullable().optional(),
    contactName: z.string().nullable().optional(),
    contactEmail: z.string().nullable().optional(),
    isActive: z.boolean(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export type ProductionCompanyResponse = z.infer<
    typeof productionCompanyResponseSchema
>;

export const createProductionCompanySchema = z.object({
    name: z
        .string()
        .min(1, "Name is required")
        .max(120, "Name must be less than 120 characters"),
    shortCode: z
        .string()
        .max(20, "Short code must be less than 20 characters")
        .optional(),
    contactName: z
        .string()
        .max(120, "Contact name must be less than 120 characters")
        .optional(),
    contactEmail: z
        .string()
        .email("Invalid email address")
        .max(120, "Email must be less than 120 characters")
        .optional()
        .or(z.literal("")),
    isActive: z.boolean().default(true),
});

export type CreateProductionCompanyValues = z.infer<
    typeof createProductionCompanySchema
>;

export const productionCompanySearchSchema = z.object({
    page: z.number().catch(1),
    limit: z.number().catch(10),
    q: z.string().optional(),
});
