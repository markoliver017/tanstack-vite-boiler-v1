import { z } from "zod";

// ==========================================
//  RESPONSE SCHEMA
// ==========================================

export const auditTrailResponseSchema = z.object({
    id: z.number(),
    userId: z.string(),
    controller: z.string(),
    action: z.string(),
    isError: z.boolean().nullable().optional(),
    details: z.string().nullable().optional(),
    ipAddress: z.string().nullable().optional(),
    userAgent: z.string().nullable().optional(),
    stackTrace: z.string().nullable().optional(),
    createdAt: z.string(),
    updatedAt: z.string().nullable().optional(),
});

// ==========================================
//  SEARCH / FILTER SCHEMA (matches backend FindAudittrailDto)
// ==========================================

export const auditTrailSearchSchema = z.object({
    page: z.number().catch(1),
    limit: z.number().catch(20),
    controller: z.string().optional(),
    action: z.string().optional(),
    isError: z.boolean().optional(),
    sortBy: z.enum(["createdAt", "id"]).optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
});

// ==========================================
//  TYPES
// ==========================================

export type AuditTrailResponse = z.infer<typeof auditTrailResponseSchema>;
export type AuditTrailSearch = z.infer<typeof auditTrailSearchSchema>;
