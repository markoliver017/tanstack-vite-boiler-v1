import { z } from "zod";

export const createAuthorizationSchema = z.object({
    checkerId: z.number().min(1, "Checker is required"),
    productionCompanyId: z.number().min(1, "Production company is required"),
    authorizedFrom: z.string().min(1, "Authorized from date is required"),
    authorizedUntil: z.string().optional(),
    notes: z.string().optional(),
});

export type CreateAuthorizationValues = z.infer<typeof createAuthorizationSchema>;

export type AuthorizationResponse = {
    id: number;
    checkerId: number;
    productionCompanyId: number;
    authorizedFrom: string;
    authorizedUntil: string | null;
    notes: string | null;
    createdAt: string;
    checker?: {
        id: number;
        fullName: string;
    };
    productionCompany?: {
        id: number;
        name: string;
    };
};
