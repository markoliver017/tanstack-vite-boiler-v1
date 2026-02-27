import { Button } from "@/components/shadcn-ui/button";
import { Checkbox } from "@/components/shadcn-ui/checkbox";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/shadcn-ui/form";
import { Input } from "@/components/shadcn-ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { useCreateSchedule } from "./mutations";
import { scheduleSchema, type ScheduleFormValues } from "./zScheduleSchema";

interface CreateScheduleFormProps {
    productionCompanyId: number;
}

export function CreateScheduleForm({
    productionCompanyId,
}: CreateScheduleFormProps) {
    const { mutate, isPending } = useCreateSchedule();

    const form = useForm<ScheduleFormValues>({
        resolver: zodResolver(scheduleSchema),
        defaultValues: {
            production_company_id: productionCompanyId,
            slotTime: "",
            isActive: true,
            notes: "",
        },
    });

    const onSubmit = async (data: ScheduleFormValues) => {
        // Force set the company ID from props to ensure consistency
        data.production_company_id = productionCompanyId;

        const result = await Swal.fire({
            title: "Review Details",
            html: `
            <div class="text-left text-sm space-y-4">
                <div>
                    <h4 class="font-semibold text-primary">Schedule Slot</h4>
                    <div class="grid grid-cols-2 gap-1 ml-2">
                       <p><strong>Time:</strong> ${data.slotTime}</p>
                       <p><strong>Status:</strong> ${data.isActive ? "Active" : "Inactive"}</p>
                       <p><strong>Notes:</strong> ${data.notes || "-"}</p>
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
                        text: "Schedule slot created successfully",
                        icon: "success",
                        showConfirmButton: false,
                        timer: 1500,
                    });
                    form.reset({
                        production_company_id: productionCompanyId,
                        slotTime: "",
                        isActive: true,
                        notes: "",
                    });
                },
                onError: (error) => {
                    Swal.fire({
                        title: "Error",
                        text: error.message || "Failed to create schedule",
                        icon: "error",
                    });
                },
            });
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="slotTime"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Slot Time (HH:mm)</FormLabel>
                            <FormControl>
                                <Input type="time" step={60} {...field} />
                            </FormControl>
                            <FormDescription>
                                Format: 24-hour HH:mm (e.g. 13:30)
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Notes</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="E.g. Last full show"
                                    {...field}
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
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>Active Status</FormLabel>
                                <FormDescription>
                                    Uncheck to disable this slot without
                                    deleting it.
                                </FormDescription>
                            </div>
                        </FormItem>
                    )}
                />

                <Button type="submit" variant="success" disabled={isPending}>
                    {isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        "Add Schedule Slot"
                    )}
                </Button>
            </form>
        </Form>
    );
}
