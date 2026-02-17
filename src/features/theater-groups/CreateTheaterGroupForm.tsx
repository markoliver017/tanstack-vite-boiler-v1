import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    zCreateTheaterGroupSchema,
    type CreateTheaterGroup,
} from "./zTheaterGroupSchema";
import { useCreateTheaterGroup } from "./mutations";
import { Button } from "@/components/shadcn-ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/shadcn-ui/form";
import { Input } from "@/components/shadcn-ui/input";
import { useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { Checkbox } from "@/components/shadcn-ui/checkbox";
import Swal from "sweetalert2";

export function CreateTheaterGroupForm() {
    const navigate = useNavigate();
    const createTheaterGroup = useCreateTheaterGroup();

    const form = useForm<CreateTheaterGroup>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(zCreateTheaterGroupSchema) as any,
        defaultValues: {
            name: "",
            shortCode: "",
            website: "",
            logoUrl: "",
            isActive: true,
        },
    });

    const onSubmit = async (data: CreateTheaterGroup) => {
        const result = await Swal.fire({
            title: "Review Details",
            html: `
                <div class="text-left text-sm space-y-4">
                    <div>
                        <h4 class="font-semibold text-primary">Theater Group Details</h4>
                        <div class="grid grid-cols-2 gap-1 ml-2">
                           <p><strong>Name:</strong> ${data.name}</p>
                           <p><strong>Short Code:</strong> ${data.shortCode}</p>
                           <p><strong>Website:</strong> ${data.website || "N/A"}</p>
                           <p><strong>Active:</strong> ${data.isActive ? "Yes" : "No"}</p>
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
            createTheaterGroup.mutate(data, {
                onSuccess: () => {
                    Swal.fire({
                        title: "Success",
                        text: "Theater Group created successfully",
                        icon: "success",
                        showConfirmButton: false,
                        timer: 1500,
                    });
                    form.reset();
                    navigate({
                        to: "/theater-groups",
                        search: { page: 1, limit: 10 },
                    });
                },
                onError: (error) => {
                    console.error(error);
                    Swal.fire({
                        title: "Error",
                        text: error.message || "Failed to create record",
                        icon: "error",
                    });
                },
            });
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Theater Group Name</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter theater group name"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="shortCode"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Short Code</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter short code (e.g., IMX)"
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
                        name="website"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Website (Optional)</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="https://example.com"
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
                        name="logoUrl"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Logo URL (Optional)</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="https://example.com/logo.png"
                                        {...field}
                                        value={field.value || ""}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>Active Status</FormLabel>
                            </div>
                        </FormItem>
                    )}
                />

                <div className="flex gap-4">
                    <Button
                        type="submit"
                        disabled={createTheaterGroup.isPending}
                        className="flex-1"
                    >
                        {createTheaterGroup.isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            "Create Theater Group"
                        )}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                            navigate({
                                to: "/theater-groups",
                                search: { page: 1, limit: 10 },
                            })
                        }
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </Form>
    );
}
