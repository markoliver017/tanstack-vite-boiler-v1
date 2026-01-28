import z from "zod";

export const patientSchema = z.object({
    patient_id_number: z.string().min(2, "Patient ID Number is required"),
    first_name: z
        .string("First Name is required")
        .regex(/^[a-zA-ZñÑ.\s*$]+$/, "Only contain letters")
        .min(2, "Minimum of 2 characters"),
    middle_name: z.optional(
        z
            .string()
            .regex(/^[a-zA-ZñÑ\s.]+$/, "Only contain letters")
            .optional(),
    ),
    last_name: z
        .string()
        .regex(/^[a-zA-ZñÑ\s.]+$/, "Only contain letters")
        .min(2, "Minimum of 2 characters"),
    suffix: z
        .string()
        .regex(/^[a-zA-ZñÑ\s.]+$/, "Only contain letters")
        .optional(),
    date_of_birth: z.iso.date(),
    sex: z.enum(["male", "female", "other"], "Require to select"),
    email: z.email("Invalid email address").optional(),
    contact_number: z
        .string()
        .regex(/^(?:\+63|0)\d{9,10}$/, "Invalid phone number")
        .optional(),
    emergency_contact_name: z
        .string()
        .regex(/^[a-zA-ZñÑ\s.]+$/, "Only contain letters")
        .optional(),
    emergency_contact_number: z
        .string()
        .regex(/^(?:\+63|0)\d{9,10}$/, "Invalid phone number")
        .optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    province: z.string().optional(),
    region: z.string().optional(),
    weight: z
        .number("Weight must be a positive number")
        .min(1, "Weight must be a positive number")
        .optional(),
    weight_unit: z.enum(["kg", "lbs"], "Invalid weight unit").optional(),
    height: z
        .number("Height must be a positive number")
        .min(1, "Height must be a positive number")
        .optional(),
    height_unit: z.enum(["ft", "cm", "m"], "Invalid height unit").optional(),
    blood_type: z
        .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
        .optional(),
    allergies: z.string().optional(),
    comorbidities: z.string().optional(),
});

export type PatientFormValues = z.infer<typeof patientSchema>;
