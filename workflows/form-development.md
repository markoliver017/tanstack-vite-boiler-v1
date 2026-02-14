---
description: Guide for creating forms using React Hook Form, Zod, Shadcn UI, and SweetAlert2
---

This workflow defines the standard for building forms in this project.

> **PREREQUISITE**: Read `workflows/component-registry.md` first to know all available components.

# File Structure

For each feature, create these files under `src/features/[feature]/`:

```
src/features/[feature]/
├── z[Feature]Schema.ts        # Zod schema + TypeScript types
├── mutations.ts               # useMutation hooks (create, update, delete)
├── use-[feature].ts           # queryOptions for fetching (optional, for edit forms)
├── Create[Feature]Form.tsx    # Create form component
├── Edit[Feature]Form.tsx      # Edit form component (optional)
└── [Feature]FormFields.tsx    # Shared field components (optional, if Create & Edit share fields)
```

---

# 1. Define the Schema

**File**: `src/features/[feature]/z[Feature]Schema.ts`

```typescript
import { z } from "zod";

export const create[Feature]Schema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Invalid email address"),
    role: z.enum(["admin", "user"], "Please select a role"),
    notes: z.string().optional(),
});

export type Create[Feature]Values = z.infer<typeof create[Feature]Schema>;
```

**Rules**:

- Use `z.string().min(1, ...)` for required strings (not just `z.string()`)
- Always provide validation messages
- Export the inferred type alongside the schema
- Name pattern: `create[Feature]Schema` / `Create[Feature]Values`

---

# 2. Create the Mutation Hook

**File**: `src/features/[feature]/mutations.ts`

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api.client";
import type { Create[Feature]Values } from "./z[Feature]Schema";

export function useCreate[Feature]() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: Create[Feature]Values) => {
            return apiRequest("/[feature]", {
                method: "POST",
                body: JSON.stringify(data),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["[feature]"] });
        },
    });
}
```

**Rules**:

- Always use `apiRequest` from `@/lib/api.client` — never raw `fetch`
- Always invalidate the relevant query key on success
- For edit: `apiRequest(\`/[feature]/${id}\`, { method: "PATCH", ... })`

---

# 3. Build the Form Component

**File**: `src/features/[feature]/Create[Feature]Form.tsx`

## Required Imports

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Swal from "sweetalert2";
// Shadcn UI — use ONLY these, do not recreate
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/shadcn-ui/form";
import { Input } from "@/components/shadcn-ui/input";
import { Button } from "@/components/shadcn-ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/shadcn-ui/select";
import { Textarea } from "@/components/shadcn-ui/textarea";
import { Checkbox } from "@/components/shadcn-ui/checkbox";
import { Calendar } from "@/components/shadcn-ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/shadcn-ui/popover";
// Shared
import FormDebugger from "@/components/shared/FormDebugger";
// Icons — from lucide-react ONLY
import { Loader2, ArrowRightIcon } from "lucide-react";
// Local
import { create[Feature]Schema, type Create[Feature]Values } from "./z[Feature]Schema";
import { useCreate[Feature] } from "./mutations";
```

## Form Hook Setup

```tsx
const { mutate, isPending } = useCreate[Feature]();

const form = useForm<Create[Feature]Values>({
    resolver: zodResolver(create[Feature]Schema),
    defaultValues: {
        name: "",
        email: "",
        role: undefined,
        notes: "",
    },
});
```

## Submit Handler — SweetAlert2 Confirmation Pattern

**MANDATORY**: Every form submission MUST use this SweetAlert2 confirmation pattern.

```tsx
const onSubmit = async (data: Create[Feature]Values) => {
    const result = await Swal.fire({
        title: "Review Details",
        // IMPORTANT: If inside a modal, set target to the modal's container element
        target: document.getElementById("[feature]-modal") || undefined,
        html: `
            <div class="text-left text-sm space-y-4">
                <div>
                    <h4 class="font-semibold text-primary">Section Title</h4>
                    <div class="grid grid-cols-2 gap-1 ml-2">
                       <p><strong>Name:</strong> ${data.name}</p>
                       <p><strong>Email:</strong> ${data.email}</p>
                       <p><strong>Role:</strong> ${data.role}</p>
                    </div>
                </div>

                <hr class="my-2"/>
                <div class="flex items-center gap-2 mt-4 bg-muted/50 p-2 rounded">
                    <input type="checkbox" id="confirm-check" class="w-4 h-4 cursor-pointer" />
                    <label for="confirm-check" class="text-xs cursor-pointer select-none">I verify that the information above is correct.</label>
                </div>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: "Confirm & Submit",
        width: "600px",
        preConfirm: () => {
            const checkbox = Swal.getPopup()?.querySelector("#confirm-check") as HTMLInputElement;
            if (!checkbox?.checked) {
                Swal.showValidationMessage("Please verify the data to proceed");
                return false;
            }
            return true;
        },
    });

    if (result.isConfirmed) {
        mutate(data, {
            onSuccess: () => {
                Swal.fire({
                    title: "Success",
                    text: "Record created successfully",
                    icon: "success",
                    target: document.getElementById("[feature]-modal") || undefined,
                    showConfirmButton: false,
                    timer: 1500,
                });
                form.reset();
            },
            onError: (error) => {
                console.error(error);
                Swal.fire({
                    title: "Error",
                    text: error.message || "Failed to create record",
                    icon: "error",
                    target: document.getElementById("[feature]-modal") || undefined,
                });
            },
        });
    }
};
```

**SweetAlert2 Rules**:

1. The HTML summary MUST list ALL form fields
2. If inside a `<Dialog>` or modal, MUST set `target` to the modal's DOM element
3. MUST show Success alert on `onSuccess` and Error alert on `onError`
4. MUST include the verification checkbox with `preConfirm` validation

---

## Multi-Step Form Pattern

```tsx
const [currentStep, setCurrentStep] = useState(1);
const [isNextLoading, setIsNextLoading] = useState(false);

const handleNext = async () => {
    // Validate only current step's fields
    const isValid = await form.trigger(["name", "email"]);
    if (isValid) {
        setIsNextLoading(true);
        setTimeout(() => {
            setCurrentStep((prev) => prev + 1);
            setIsNextLoading(false);
        }, 800); // Artificial delay for UX
    }
};
```

---

## JSX Structure

```tsx
return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div
                className={
                    currentStep === 2
                        ? "animate-in fade-in slide-in-from-right-4 duration-700"
                        : ""
                }
            >
                {currentStep === 1 && <StepOne form={form} />}
                {currentStep === 2 && <StepTwo form={form} />}
            </div>

            <div className="flex justify-between">
                {currentStep > 1 && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setCurrentStep((prev) => prev - 1)}
                    >
                        ← Back
                    </Button>
                )}
                {currentStep < totalSteps ? (
                    <Button
                        type="button"
                        onClick={handleNext}
                        disabled={isNextLoading}
                    >
                        {isNextLoading ? (
                            <Loader2 className="animate-spin" />
                        ) : (
                            <>
                                Next <ArrowRightIcon />
                            </>
                        )}
                    </Button>
                ) : (
                    <Button
                        type="submit"
                        variant="success"
                        disabled={isPending}
                    >
                        {isPending ? (
                            <Loader2 className="animate-spin" />
                        ) : (
                            "Submit"
                        )}
                    </Button>
                )}
            </div>
        </form>
        {/* <FormDebugger form={form} /> */}
    </Form>
);
```

**JSX Rules**:

- Wrap with `<Form {...form}>` (shadcn) then `<form onSubmit={...}>` (native)
- Use `animate-in fade-in slide-in-from-right-4 duration-700` for step transitions
- Use `<FormDebugger>` during development — comment out before final review
- Use `variant="success"` for the primary submit button
- Always disable submit button with `isPending` from the mutation hook

---

# 4. For Edit Forms

**File**: `src/features/[feature]/Edit[Feature]Form.tsx`

1. Accept `initialData` as a prop
2. Initialize `defaultValues` from `initialData` (format dates/types as needed)
3. Use the same field layout — refactor fields to `[Feature]FormFields.tsx` if sharing with Create form
4. Use `useUpdate[Feature]()` mutation instead

---

# Checklist

- [ ] Schema in `z[Feature]Schema.ts` with validation messages?
- [ ] Mutation hook in `mutations.ts` with cache invalidation?
- [ ] Form uses `zodResolver` from `@hookform/resolvers/zod`?
- [ ] All UI uses Shadcn components from `@/components/shadcn-ui/`?
- [ ] Loading state uses `isPending` from mutation hook?
- [ ] Types strictly defined (no `any`)?
- [ ] Multi-step forms use `isNextLoading` with 800ms delay?
- [ ] Step transitions use `animate-in fade-in slide-in-from-right-4`?
- [ ] Submission uses SweetAlert2 confirmation with ALL fields + checkbox?
- [ ] If in modal, `Swal.fire` sets `target` to the modal element?
- [ ] Success/Error alerts in `onSuccess`/`onError` callbacks?
- [ ] `FormDebugger` commented out for production?
- [ ] API calls use `apiRequest` from `@/lib/api.client`?
