import { z } from "zod";

export const createTaxRuleOverrideSchema = z.object({
    theaterId: z.number().min(1, "Theater is required"),
    productionCompanyId: z.number().min(1, "Production company is required"),
    taxRuleId: z.number().min(1, "Tax rule is required"),
    effectiveDate: z.string().min(1, "Effective date is required"),
    expiryDate: z.string().optional(),
    notes: z.string().optional(),
});

export const taxRuleOverrideSearchSchema = z.object({
    page: z.number().default(1).catch(1),
    limit: z.number().default(10).catch(10),
    theaterId: z.number().optional(),
    productionCompanyId: z.number().optional(),
});

export type CreateTaxRuleOverrideValues = z.infer<
    typeof createTaxRuleOverrideSchema
>;

export type TaxRuleOverrideSearch = z.infer<typeof taxRuleOverrideSearchSchema>;

export type TaxRuleOverrideResponse = {
    id: number;
    theaterId: number;
    productionCompanyId: number;
    taxRuleId: number;
    effectiveDate: string;
    expiryDate: string | null;
    notes: string | null;
    createdAt: string;
    theater?: {
        id: number;
        name: string;
    };
    productionCompany?: {
        id: number;
        name: string;
    };
    taxRule?: {
        id: number;
        name: string;
        formulaType: "gross_based" | "ticket_based";
        taxRate: string;
        divisor: string;
    };
};
