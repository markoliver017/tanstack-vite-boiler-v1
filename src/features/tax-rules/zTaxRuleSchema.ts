import { z } from "zod";

export const taxRuleResponseSchema = z.object({
    id: z.number(),
    name: z.string(),
    formulaType: z.enum(["gross_based", "ticket_based", "custom"]),
    taxRate: z.string(),
    divisor: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
    createdAt: z.string().nullable().optional(),
    updatedAt: z.string().nullable().optional(),
});

export type TaxRuleResponse = z.infer<typeof taxRuleResponseSchema>;

export const createTaxRuleSchema = z.object({
    name: z.string().min(1, "Name is required").max(255, "Name is too long"),
    formulaType: z.enum(["gross_based", "ticket_based", "custom"], {
        message: "Formula type is required",
    }),
    taxRate: z.string().min(1, "Tax rate is required"),
    divisor: z.string().optional(),
    description: z.string().optional(),
});

export type CreateTaxRuleValues = z.infer<typeof createTaxRuleSchema>;

export const taxRuleSearchSchema = z.object({
    page: z.number().catch(1),
    limit: z.number().catch(10),
    q: z.string().optional(),
});

export type TaxRuleSearch = z.infer<typeof taxRuleSearchSchema>;
