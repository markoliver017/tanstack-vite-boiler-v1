import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { apiRequest } from "@/lib/api.client";
import { NavHeader } from "@/components/layouts/NavHeader";
import PageErrorComponent from "@/components/shared/PageErrorComponent";
import LoadingComponent from "@/components/shared/LoadingComponent";
import {
    createProductionCompanySchema,
    type CreateProductionCompanyValues,
    type ProductionCompanyResponse,
} from "@/features/production-companies/zProductionCompanySchema";
import { Button } from "@/components/shadcn-ui/button";
import {
    useDeleteProductionCompany,
    useUpdateProductionCompany,
} from "@/features/production-companies/mutations";
import Swal from "sweetalert2";
import { Loader2, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/shadcn-ui/form";
import { Input } from "@/components/shadcn-ui/input";
import { Checkbox } from "@/components/shadcn-ui/checkbox";
import BackButton from "@/components/shared/BackButton";

export const Route = createFileRoute(
    "/_authenticated/production-companies/$companyId",
)({
    loader: async ({ params }) => {
        const item = await apiRequest<ProductionCompanyResponse>(
            `/production-companies/${params.companyId}`,
        );
        return {
            item,
            breadcrumb: item.name,
        };
    },
    component: ProductionCompanyDetailPage,
    errorComponent: ({ error }) => <PageErrorComponent error={error} />,
    pendingComponent: () => <LoadingComponent />,
});

function ProductionCompanyDetailPage() {
    const { item } = Route.useLoaderData();
    const navigate = useNavigate();
    const deleteMutation = useDeleteProductionCompany();
    const updateMutation = useUpdateProductionCompany();

    const form = useForm<CreateProductionCompanyValues>({
        resolver: zodResolver(createProductionCompanySchema) as any,
        defaultValues: {
            name: item.name,
            shortCode: item.shortCode || "",
            contactName: item.contactName || "",
            contactEmail: item.contactEmail || "",
            isActive: item.isActive,
        },
    });

    const handleDelete = async () => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        });

        if (result.isConfirmed) {
            deleteMutation.mutate(item.id, {
                onSuccess: () => {
                    Swal.fire(
                        "Deleted!",
                        "Production company has been deleted.",
                        "success",
                    );
                    navigate({
                        to: "/production-companies",
                        search: { page: 1, limit: 10 },
                    });
                },
                onError: (error) => {
                    Swal.fire(
                        "Error!",
                        error.message || "Failed to delete.",
                        "error",
                    );
                },
            });
        }
    };

    const onSubmit = async (data: CreateProductionCompanyValues) => {
        const result = await Swal.fire({
            title: "Confirm Updates",
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
            <input type="checkbox" id="confirm-updates-check" class="w-4 h-4 cursor-pointer" />
            <label for="confirm-updates-check" class="text-xs cursor-pointer select-none">I verify that the information above is correct.</label>
          </div>
        </div>
      `,
            showCancelButton: true,
            confirmButtonText: "Yes, Update",
            preConfirm: () => {
                const checkbox = Swal.getPopup()?.querySelector(
                    "#confirm-updates-check",
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
            updateMutation.mutate(
                { id: item.id, data },
                {
                    onSuccess: () => {
                        Swal.fire(
                            "Updated!",
                            "Production company has been updated.",
                            "success",
                        );
                    },
                    onError: (error) => {
                        Swal.fire(
                            "Error!",
                            error.message || "Failed to update.",
                            "error",
                        );
                    },
                },
            );
        }
    };

    return (
        <div className="space-y-6">
            <NavHeader
                title={item.name}
                description="View and edit production company details"
            />

            <div className="p-6 max-w-3xl">
                <BackButton />
                <div className="mt-4 bg-white rounded-lg border p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-medium">Company Details</h3>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleDelete}
                            disabled={deleteMutation.isPending}
                        >
                            {deleteMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Trash2 className="h-4 w-4 mr-2" />
                            )}
                            Delete
                        </Button>
                    </div>

                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-6"
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
                                                <Input
                                                    placeholder="e.g. PAR"
                                                    {...field}
                                                    value={field.value || ""}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="isActive"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={
                                                        field.onChange
                                                    }
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel>
                                                    Active Status
                                                </FormLabel>
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
                                            <FormLabel>
                                                Contact Person
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="e.g. John Doe"
                                                    {...field}
                                                    value={field.value || ""}
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
                                                    value={field.value || ""}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="flex justify-end pt-4">
                                <Button
                                    type="submit"
                                    variant="success"
                                    disabled={updateMutation.isPending}
                                >
                                    {updateMutation.isPending ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        "Save Changes"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
}
