import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/shadcn-ui/form";
import { Input } from "@/components/shadcn-ui/input";
import { Button } from "@/components/shadcn-ui/button";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/shadcn-ui/select";
import { Textarea } from "@/components/shadcn-ui/textarea";
import { Loader2 } from "lucide-react";
import Swal from "sweetalert2";

import {
    createTaxRuleSchema,
    type CreateTaxRuleValues,
    type TaxRuleResponse,
} from "./zTaxRuleSchema";
import { useUpdateTaxRule, useDeleteTaxRule } from "./mutations";

interface EditTaxRuleFormProps {
    initialData: TaxRuleResponse;
}

export default function EditTaxRuleForm({ initialData }: EditTaxRuleFormProps) {
    const navigate = useNavigate();
    const { mutate: updateTaxRule, isPending: isUpdating } = useUpdateTaxRule();
    const { mutate: deleteTaxRule, isPending: isDeleting } = useDeleteTaxRule();

    const form = useForm<CreateTaxRuleValues>({
        resolver: zodResolver(createTaxRuleSchema),
        defaultValues: {
            name: initialData.name,
            formulaType: initialData.formulaType,
            taxRate: initialData.taxRate,
            divisor: initialData.divisor ?? "",
            description: initialData.description ?? "",
        },
    });

    const onSubmit = async (data: CreateTaxRuleValues) => {
        const result = await Swal.fire({
            title: "Review Details",
            html: `
                <div class="text-left text-sm space-y-4">
                    <div>
                        <h4 class="font-semibold text-primary">Update Tax Rule</h4>
                        <div class="grid grid-cols-2 gap-1 ml-2">
                           <p><strong>Name:</strong> ${data.name}</p>
                           <p><strong>Formula Type:</strong> ${data.formulaType}</p>
                           <p><strong>Tax Rate:</strong> ${data.taxRate}</p>
                           <p><strong>Divisor:</strong> ${data.divisor || "N/A"}</p>
                           <p><strong>Description:</strong> ${data.description || "N/A"}</p>
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
            confirmButtonText: "Confirm Update",
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
            updateTaxRule(
                { id: initialData.id, data },
                {
                    onSuccess: () => {
                        Swal.fire({
                            title: "Success",
                            text: "Record updated successfully",
                            icon: "success",
                            showConfirmButton: false,
                            timer: 1500,
                        });
                        navigate({
                            to: "/tax-rules",
                            search: { page: 1, limit: 10 },
                        });
                    },
                    onError: (error: Error) => {
                        console.error(error);
                        Swal.fire({
                            title: "Error",
                            text: error.message || "Failed to update record",
                            icon: "error",
                        });
                    },
                },
            );
        }
    };

    const handleDelete = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                deleteTaxRule(initialData.id, {
                    onSuccess: () => {
                        Swal.fire(
                            "Deleted!",
                            "Your record has been deleted.",
                            "success",
                        );
                        navigate({
                            to: "/tax-rules",
                            search: { page: 1, limit: 10 },
                        });
                    },
                    onError: (error: Error) => {
                        Swal.fire({
                            title: "Error",
                            text: error.message || "Failed to delete record",
                            icon: "error",
                        });
                    },
                });
            }
        });
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 max-w-2xl mx-auto border p-6 rounded-md shadow-sm bg-white"
            >
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter rule name..."
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="formulaType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Formula Type</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a formula type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="gross_based">
                                            Gross Based
                                        </SelectItem>
                                        <SelectItem value="ticket_based">
                                            Ticket Based
                                        </SelectItem>
                                        <SelectItem value="custom">
                                            Custom
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="taxRate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tax Rate</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        placeholder="e.g. 5.00"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="divisor"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Divisor</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="Optional divisor"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Optional description..."
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-between pt-4">
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isDeleting || isUpdating}
                    >
                        {isDeleting ? (
                            <Loader2 className="animate-spin mr-2" />
                        ) : null}
                        Delete
                    </Button>
                    <Button
                        type="submit"
                        variant="success"
                        disabled={isUpdating || isDeleting}
                    >
                        {isUpdating ? (
                            <Loader2 className="animate-spin mr-2" />
                        ) : null}
                        Update
                    </Button>
                </div>
            </form>
        </Form>
    );
}
