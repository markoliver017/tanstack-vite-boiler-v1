import { z } from "zod";

// ==========================================
//  FORM SCHEMAS
// ==========================================

export const createUserSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.email("Invalid email address"),
    role: z.enum(
        ["super_admin", "admin", "user", "patient"],
        "Please select a role",
    ),
});

export const updateUserSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.email("Invalid email address"),
});

export const changePasswordSchema = z
    .object({
        currentPassword: z.string().min(1, "Current password is required"),
        newPassword: z
            .string()
            .min(8, "Password needs at least 8 characters")
            .max(64, "Password must be under 64 characters"),
        confirmPassword: z.string().min(1, "Please confirm your password"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export const adminChangePasswordSchema = z
    .object({
        newPassword: z
            .string()
            .min(8, "Password needs at least 8 characters")
            .max(64, "Password must be under 64 characters"),
        confirmPassword: z.string().min(1, "Please confirm your password"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
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

// ==========================================
//  RESPONSE SCHEMA
// ==========================================

export const userResponseSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    emailVerified: z.boolean(),
    image: z.string().nullable().optional(),
    role: z.string().nullable().optional(),
    banned: z.boolean().nullable().optional(),
    banReason: z.string().nullable().optional(),
    banExpires: z.string().nullable().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

// ==========================================
//  SEARCH / PAGINATION SCHEMA
// ==========================================

export const userSearchSchema = z.object({
    q: z.string().optional(),
    page: z.number().catch(1),
    limit: z.number().catch(10),
});

// ==========================================
//  TYPES
// ==========================================

export type CreateUserValues = z.infer<typeof createUserSchema>;
export type UpdateUserValues = z.infer<typeof updateUserSchema>;
export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;
export type AdminChangePasswordValues = z.infer<
    typeof adminChangePasswordSchema
>;
export type SignUpValues = z.infer<typeof signUpSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;
export type UserSearch = z.infer<typeof userSearchSchema>;
