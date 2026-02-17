import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Swal from "sweetalert2";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
    FormDescription,
} from "@/components/shadcn-ui/form";
import { Input } from "@/components/shadcn-ui/input";
import { Button } from "@/components/shadcn-ui/button";
import { Checkbox } from "@/components/shadcn-ui/checkbox";
import { Loader2 } from "lucide-react";
import {
    createProductionCompanySchema,
    type CreateProductionCompanyValues,
} from "./zProductionCompanySchema";
import { useCreateProductionCompany } from "./mutations";
import { useNavigate } from "@tanstack/react-router";

export function CreateProductionCompanyForm() {
    const { mutate, isPending } = useCreateProductionCompany();
    const navigate = useNavigate();

    const form = useForm<CreateProductionCompanyValues>({
        resolver: zodResolver(createProductionCompanySchema) as any,
        defaultValues: {
            name: "",
            shortCode: "",
            contactName: "",
            contactEmail: "",
            isActive: true,
        },
    });

    const onSubmit = async (data: CreateProductionCompanyValues) => {
        const result = await Swal.fire({
            title: "Review Details",
            html: `
        <div class="text-left text-sm space-y-4">
          <div>
            <h4 class="font-semibold text-primary">Production Company Details</h4>
            <div class="grid grid-cols-2 gap-1 ml-2">
               <p><strong>Name:</strong> ${data.name}</p>
               <p><strong>Short Code:</strong> ${data.shortCode || "-"}</p>
               <p><strong>Contact Name:</strong> ${data.contactName || "-"}</p>
               <p><strong>Contact Email:</strong> ${data.contactEmail || "-"}</p>
               <p><strong>Status:</strong> ${data.isActive ? "Active" : "Inactive"}</p>
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
                const checkbox = Swal.getPopup()?.querySelector(
                    "#confirm-check",
                ) as HTMLInputElement;
                if (!checkbox?.checked) {
                    Swal.showValidationMessage(
                        "Please verify the data to proceed",
                    );
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
                        text: "Production Company created successfully",
                        icon: "success",
                        showConfirmButton: false,
                        timer: 1500,
                    });
                    navigate({
                        to: "/production-companies",
                        search: { page: 1, limit: 10 },
                    });
                },
                onError: (error) => {
                    console.error(error);
                    Swal.fire({
                        title: "Error",
                        text:
                            error.message ||
                            "Failed to create production company",
                        icon: "error",
                    });
                },
            });
        }
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 max-w-2xl"
            >
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Company Name *</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="e.g. Paramount Pictures"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="shortCode"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Short Code</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. PAR" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Optional shorthand identifier
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="isActive"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 mt-8">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>Active Status</FormLabel>
                                    <FormDescription>
                                        Uncheck to disable this company
                                    </FormDescription>
                                </div>
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="contactName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Contact Person</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="e.g. John Doe"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="contactEmail"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Contact Email</FormLabel>
                                <FormControl>
                                    <Input
                                        type="email"
                                        placeholder="e.g. john@paramount.com"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex justify-end gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                            navigate({
                                to: "/production-companies",
                                search: { page: 1, limit: 10 },
                            })
                        }
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="success"
                        disabled={isPending}
                    >
                        {isPending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            "Create Company"
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
