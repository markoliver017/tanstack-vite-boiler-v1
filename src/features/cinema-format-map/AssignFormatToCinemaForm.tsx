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
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/shadcn-ui/select";
import { Checkbox } from "@/components/shadcn-ui/checkbox";
import { Loader2 } from "lucide-react";
import {
    assignFormatSchema,
    type AssignFormatValues,
} from "./zCinemaFormatMapSchema";
import { useAssignFormat } from "./mutations";
import { useQuery } from "@tanstack/react-query";
import { cinemaFormatsListOptions } from "../cinema-formats/use-cinema-formats";

interface AssignFormatToCinemaFormProps {
    cinemaId: number;
    onSuccess?: () => void;
}

export default function AssignFormatToCinemaForm({
    cinemaId,
    onSuccess,
}: AssignFormatToCinemaFormProps) {
    const { mutate, isPending } = useAssignFormat();

    // Fetch available formats
    const { data: formatsData } = useQuery(
        cinemaFormatsListOptions({ page: 1, limit: 100 }),
    );
    const formats = formatsData?.data || [];

    const form = useForm<AssignFormatValues>({
        resolver: zodResolver(assignFormatSchema) as any,
        defaultValues: {
            cinemaId: cinemaId,
            seatCount: 0,
            isPrimary: false,
        },
    });

    const onSubmit = async (data: AssignFormatValues) => {
        // Find format label for confirmation
        const selectedFormat = formats.find(
            (f) => f.id.toString() === data.cinemaFormatId.toString(),
        );

        const result = await Swal.fire({
            title: "Review Assignment",
            target: document.getElementById("assign-format-modal") || undefined,
            html: `
            <div class="text-left text-sm space-y-4">
                <div>
                    <h4 class="font-semibold text-primary">Assignment Details</h4>
                    <div class="grid grid-cols-2 gap-1 ml-2">
                       <p><strong>Format:</strong> ${selectedFormat?.label || "Unknown"}</p>
                       <p><strong>Seat Count:</strong> ${data.seatCount}</p>
                       <p><strong>Is Primary:</strong> ${data.isPrimary ? "Yes" : "No"}</p>
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
            confirmButtonText: "Confirm & Assign",
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
                        text: "Format assigned successfully",
                        icon: "success",
                        target:
                            document.getElementById("assign-format-modal") ||
                            undefined,
                        showConfirmButton: false,
                        timer: 1500,
                    });
                    form.reset({
                        cinemaId: cinemaId,
                        seatCount: 0,
                        isPrimary: false,
                    });
                    if (onSuccess) {
                        onSuccess();
                    }
                },
                onError: (error) => {
                    console.error(error);
                    Swal.fire({
                        title: "Error",
                        text: error.message || "Failed to assign format",
                        icon: "error",
                        target:
                            document.getElementById("assign-format-modal") ||
                            undefined,
                    });
                },
            });
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Hidden Cinema ID */}
                <input
                    type="hidden"
                    {...form.register("cinemaId")}
                    value={cinemaId}
                />

                <FormField
                    control={form.control as any}
                    name="cinemaFormatId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Cinema Format{" "}
                                <span className="text-destructive">*</span>
                            </FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value?.toString()}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a format" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {formats.map((format) => (
                                        <SelectItem
                                            key={format.id}
                                            value={format.id.toString()}
                                        >
                                            {format.label} ({format.code})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control as any}
                    name="seatCount"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Seat Count</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control as any}
                    name="isPrimary"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>Primary Format</FormLabel>
                                <p className="text-sm text-muted-foreground">
                                    This will be the default format for this
                                    cinema screen.
                                </p>
                            </div>
                        </FormItem>
                    )}
                />

                <div className="flex justify-end">
                    <Button
                        type="submit"
                        variant="success"
                        disabled={isPending}
                    >
                        {isPending ? (
                            <Loader2 className="animate-spin mr-2" />
                        ) : null}
                        Assign Format
                    </Button>
                </div>
            </form>
        </Form>
    );
}
