import { z } from "zod";

export const scheduleSchema = z.object({
    production_company_id: z.number().min(1, "Production company is required"),
    slotTime: z
        .string()
        .min(1, "Slot time is required")
        .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Must be in HH:mm format"),
    isActive: z.boolean().default(true),
    notes: z.string().optional(),
});

export type ScheduleFormValues = z.input<typeof scheduleSchema>;

export const scheduleResponseSchema = scheduleSchema.extend({
    id: z.number(),
    created_at: z.string(),
    updated_at: z.string(),
});

export type ScheduleResponse = z.infer<typeof scheduleResponseSchema>;
