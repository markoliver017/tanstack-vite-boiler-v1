import { z } from "zod";

export const createUserSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.email("Invalid email address"),
    role: z.enum(
        ["super_admin", "admin", "user", "patient"],
        "Please select a role",
    ),
});

export const signUpSchema = z.object({
    name: z
        .string()
        .min(2, "Please enter at least 2 characters")
        .max(80, "Name must be under 80 characters"),
    email: z.email("Enter a valid email address"),
    password: z
        .string()
        .min(8, "Password needs at least 8 characters")
        .max(64, "Password must be under 64 characters"),
    callbackURL: z.string().optional(),
});

export type CreateUserValues = z.infer<typeof createUserSchema>;
export type SignUpValues = z.infer<typeof signUpSchema>;
