import { z } from "zod";

// ==========================================
//  AGENCY SCHEMA
// ==========================================

export const zAgencySchema = z.object({
    name: z
        .string()
        .min(1, "Agency name is required")
        .max(255, "Agency name must be less than 255 characters"),
    contactPerson: z
        .string()
        .min(1, "Contact person is required")
        .max(255, "Contact person must be less than 255 characters"),
    email: z
        .string()
        .email("Invalid email address")
        .max(255, "Email must be less than 255 characters"),
    phone: z
        .string()
        .min(1, "Phone number is required")
        .max(50, "Phone number must be less than 50 characters"),
});

// ==========================================
//  SEARCH / PAGINATION SCHEMA
// ==========================================

export const agencySearchSchema = z.object({
    q: z.string().optional(),
    page: z.number().default(1).catch(1),
    limit: z.number().default(10).catch(10),
});

export type AgencySearch = z.infer<typeof agencySearchSchema>;

export type AgencyFormData = z.infer<typeof zAgencySchema>;

// ==========================================
//  AGENCY RESPONSE TYPE
// ==========================================

export type Agency = {
    id: number;
    name: string;
    contactPerson: string;
    email: string;
    phone: string;
    createdAt: string;
    updatedAt: string;
};
