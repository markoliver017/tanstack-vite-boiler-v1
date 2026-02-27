import { z } from "zod";

export const createCulturalTaxSchema = z
    .object({
        name: z.string().min(1, "Name is required"),
        city: z.string().optional(),
        province: z.string().optional(),
        amountType: z.enum(["fixed_amount", "percentage_of_discounted_price"]),
        deductionValue: z.number().nonnegative("Deduction must be non-negative"),
        effectivityDate: z.string().min(1, "Effectivity date is required"),
        expiryDate: z.string().optional(),
        memoReference: z.string().optional(),
        isActive: z.boolean().default(true),
    })
    .refine((value) => Boolean(value.city || value.province), {
        message: "Either city or province is required",
        path: ["city"],
    });

export const culturalTaxSearchSchema = z.object({
    q: z.string().optional(),
    page: z.number().default(1).catch(1),
    limit: z.number().default(10).catch(10),
});

export type CreateCulturalTaxValues = z.input<typeof createCulturalTaxSchema>;
export type CulturalTaxSearch = z.infer<typeof culturalTaxSearchSchema>;

export type CulturalTaxResponse = {
    id: number;
    name: string;
    city: string | null;
    province: string | null;
    amountType: "fixed_amount" | "percentage_of_discounted_price";
    deductionValue: string;
    effectivityDate: string;
    expiryDate: string | null;
    memoReference: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
};
