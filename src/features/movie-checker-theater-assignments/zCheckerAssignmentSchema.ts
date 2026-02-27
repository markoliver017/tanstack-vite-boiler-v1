import { z } from "zod";

export const createCheckerAssignmentSchema = z.object({
    checkerId: z.number().min(1, "Checker is required"),
    movieId: z.number().min(1, "Movie is required"),
    theaterId: z.number().min(1, "Theater is required"),
    slotNo: z.number().int().min(1).optional(),
    cinemaId: z.number().optional(),
    cinemaFormatId: z.number().optional(),
    remarks: z.string().max(500).optional(),
});

export type CreateCheckerAssignmentValues = z.infer<
    typeof createCheckerAssignmentSchema
>;

export type CheckerAssignmentResponse = {
    id: number;
    checkerId: number;
    movieId: number;
    theaterId: number;
    slotNo: number;
    cinemaId: number | null;
    cinemaFormatId: number | null;
    remarks: string | null;
    createdAt: string;
    updatedAt: string;
    movie?: {
        id: number;
        title: string;
    };
    theater?: {
        id: number;
        name: string;
        city: string;
        province: string | null;
    };
    cinema?: {
        id: number;
        name: string;
    };
    cinemaFormat?: {
        id: number;
        label: string;
    };
    checker?: {
        id: number;
        fullName: string;
    };
};
