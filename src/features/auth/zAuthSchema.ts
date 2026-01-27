import z from "zod";

export const signInSchema = z.object({
    email: z.email("Enter a valid email address"),
    password: z.string("Password is required").min(1, "Password is required"),
    role: z.string().optional(),
    rememberMe: z.boolean().optional(),
    callbackURL: z.string().optional(),
});

export const searchSchema = z.object({
    redirect: z.string().optional(),
});

export type SignInValues = z.infer<typeof signInSchema>;
