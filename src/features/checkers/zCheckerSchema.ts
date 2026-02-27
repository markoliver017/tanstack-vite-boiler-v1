import { z } from "zod";

export const createCheckerSchema = z.object({
    userId: z.string().min(1, "User is required"),
    agencyId: z.number().min(1, "Agency is required"),
    fullName: z.string().min(1, "Full name is required"),
    contactNo: z.string().optional(),
    address: z.string().optional(),
    employmentDate: z.string().min(1, "Employment date is required"),
    endDate: z.string().optional(),
    idPhotoUrl: z.string().optional(),
    notes: z.string().optional(),
    isActive: z.boolean().default(true),
});

export const checkerSearchSchema = z.object({
    q: z.string().optional(),
    page: z.number().default(1).catch(1),
    limit: z.number().default(10).catch(10),
    agencyId: z.number().optional(),
});

export type CreateCheckerValues = z.input<typeof createCheckerSchema>;
export type CheckerSearch = z.infer<typeof checkerSearchSchema>;

export type CheckerResponse = {
    id: number;
    userId: string;
    agencyId: number;
    fullName: string;
    contactNo: string | null;
    address: string | null;
    employmentDate: string;
    endDate: string | null;
    isActive: boolean;
    idPhotoUrl: string | null;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
    user?: {
        id: string;
        name: string;
        email: string;
        role?: string;
    };
    agency?: {
        id: number;
        name: string;
    };
};
