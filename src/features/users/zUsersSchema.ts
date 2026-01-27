import { z } from "zod";

// 1. Define the Schema
export const createUserSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.email("Invalid email address"),
    role: z.enum(["admin", "user", "guest"], "Please select a role"),
});

export type CreateUserValues = z.infer<typeof createUserSchema>;
