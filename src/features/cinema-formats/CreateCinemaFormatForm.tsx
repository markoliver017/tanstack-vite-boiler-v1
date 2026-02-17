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
} from "@/components/shadcn-ui/form";
import { Input } from "@/components/shadcn-ui/input";
import { Button } from "@/components/shadcn-ui/button";
import { Textarea } from "@/components/shadcn-ui/textarea";
import { Loader2 } from "lucide-react";
import {
    createCinemaFormatSchema,
    type CreateCinemaFormatValues,
    type CinemaFormatResponse,
} from "./zCinemaFormatSchema";
import { useCreateCinemaFormat, useUpdateCinemaFormat } from "./mutations";
import { useNavigate } from "@tanstack/react-router";

interface CreateCinemaFormatFormProps {
    initialData?: CinemaFormatResponse;
}

export function CreateCinemaFormatForm({
    initialData,
}: CreateCinemaFormatFormProps) {
    const navigate = useNavigate();
    const { mutate: create, isPending: isCreatePending } =
        useCreateCinemaFormat();
    const { mutate: update, isPending: isUpdatePending } =
        useUpdateCinemaFormat(initialData?.id || 0);

    const isPending = isCreatePending || isUpdatePending;

    const form = useForm<CreateCinemaFormatValues>({
        resolver: zodResolver(createCinemaFormatSchema),
        defaultValues: {
            code: initialData?.code || "",
            label: initialData?.label || "",
            description: initialData?.description || "",
        },
    });

    const onSubmit = async (data: CreateCinemaFormatValues) => {
        const result = await Swal.fire({
            title: "Review Details",
            html: `
            <div class="text-left text-sm space-y-4">
                <div>
                    <h4 class="font-semibold text-primary">Cinema Format</h4>
                    <div class="grid grid-cols-2 gap-1 ml-2">
                       <p><strong>Code:</strong> ${data.code}</p>
                       <p><strong>Label:</strong> ${data.label}</p>
                       <p><strong>Description:</strong> ${data.description || "-"}</p>
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
            const action = initialData ? update : create;

            action(data, {
                onSuccess: () => {
                    Swal.fire({
                        title: "Success",
                        text: `Cinema format ${initialData ? "updated" : "created"} successfully`,
                        icon: "success",
                        showConfirmButton: false,
                        timer: 1500,
                    });
                    if (!initialData) {
                        form.reset();
                    }
                    navigate({
                        to: "/cinema-formats",
                        search: { page: 1, limit: 10 },
                    });
                },
                onError: (error) => {
                    console.error(error);
                    Swal.fire({
                        title: "Error",
                        text: error.message || "Failed to save record",
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
                className="space-y-4 max-w-2xl"
            >
                <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Code</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="e.g. IMAX, 3D, 2D"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="label"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Label</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="e.g. IMAX Laser, Standard 2D"
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

                <div className="flex justify-end pt-4">
                    <Button
                        type="submit"
                        variant="success"
                        disabled={isPending}
                    >
                        {isPending ? (
                            <Loader2 className="animate-spin mr-2" />
                        ) : null}
                        {initialData ? "Update Format" : "Create Format"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
