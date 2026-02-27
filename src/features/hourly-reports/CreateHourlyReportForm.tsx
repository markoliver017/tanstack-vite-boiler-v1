import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useFieldArray, useForm, useWatch } from "react-hook-form";

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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/shadcn-ui/select";
import { apiRequest, fetchList } from "@/lib/api.client";
import { Plus, Trash2 } from "lucide-react";
import {
    useCreateHourlyReport,
    usePreviewHourlyReport,
    useUpdateHourlyReport,
} from "./mutations";
import {
    createHourlyReportSchema,
    type HourlyReportResponse,
    type CreateHourlyReportValues,
} from "./zHourlyReportSchema";

const today = new Date().toISOString().slice(0, 10);
const now = new Date();
const nowHm = `${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes(),
).padStart(2, "0")}`;

export function CreateHourlyReportForm({
    initialData,
}: {
    initialData?: HourlyReportResponse;
}) {
    const navigate = useNavigate();
    const createMutation = useCreateHourlyReport();
    const updateMutation = useUpdateHourlyReport();
    const previewMutation = usePreviewHourlyReport();

    const { data: cinemas } = useQuery({
        queryKey: ["cinemas", "lookup"],
        queryFn: () =>
            fetchList<{ id: number; name: string }[]>("/cinemas?_page=1&_limit=500"),
    });

    const { data: movies } = useQuery({
        queryKey: ["movies", "lookup"],
        queryFn: () =>
            fetchList<{ id: number; title: string }[]>("/movies?_page=1&_limit=500"),
    });

    const { data: ticketTypes } = useQuery({
        queryKey: ["ticket-types", "lookup"],
        queryFn: () =>
            fetchList<{ id: number; name: string }[]>("/ticket-types?_page=1&_limit=500"),
    });

    const form = useForm<CreateHourlyReportValues>({
        resolver: zodResolver(createHourlyReportSchema),
        defaultValues: {
            cinemaId: initialData?.cinemaId || 0,
            movieId: initialData?.movieId || 0,
            cinemaFormatId: initialData?.cinemaFormatId || undefined,
            reportDate: initialData?.reportDate || today,
            reportTime: initialData?.reportTime?.slice(0, 5) || nowHm,
            ticketEntries:
                initialData?.ticketEntries?.map((entry) => ({
                    ticketTypeId: entry.ticketTypeId,
                    quantity: entry.quantity,
                })) || [{ ticketTypeId: 0, quantity: 0 }],
        },
    });

    const movieId = useWatch({ control: form.control, name: "movieId" });

    const { data: movieFormats } = useQuery({
        queryKey: ["movie-format-map", "for-movie", movieId],
        queryFn: () =>
            fetchList<
                {
                    id: number;
                    cinemaFormatId: number;
                    cinemaFormat?: { id: number; label: string };
                }[]
            >(`/movie-format-map?movie_id=${movieId}`),
        enabled: Boolean(movieId),
    });

    const {
        fields: ticketEntryFields,
        append,
        remove,
    } = useFieldArray({
        control: form.control,
        name: "ticketEntries",
    });

    const onValidateSchedule = async () => {
        const selectedMovieId = form.getValues("movieId");
        const reportTime = form.getValues("reportTime");

        if (!selectedMovieId || !reportTime) {
            return;
        }

        const data = await apiRequest<{
            isValid: boolean;
            message: string;
            nextValidSlot: string | null;
            diffMinutes: number | null;
        }>(
            `/hourly-reports/validate-schedule?movie_id=${selectedMovieId}&time=${encodeURIComponent(
                reportTime,
            )}`,
        );

        if (!data.isValid) {
            form.setError("reportTime", {
                type: "validate",
                message: `${data.message}. Next slot: ${data.nextValidSlot ?? "N/A"}`,
            });
        } else {
            form.clearErrors("reportTime");
        }
    };

    const onPreview = async () => {
        const valid = await form.trigger();
        if (!valid) {
            return;
        }

        await previewMutation.mutateAsync(form.getValues());
    };

    const onSubmit = async (data: CreateHourlyReportValues) => {
        if (initialData) {
            await updateMutation.mutateAsync({ id: initialData.id, data });
            navigate({
                to: "/hourly-reports/$hourlyReportId",
                params: { hourlyReportId: initialData.id },
            });
            return;
        }

        await createMutation.mutateAsync(data);
        navigate({ to: "/hourly-reports", search: { page: 1, limit: 10 } });
    };

    const isPending = createMutation.isPending || updateMutation.isPending;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="cinemaId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cinema</FormLabel>
                                <Select
                                    value={field.value ? String(field.value) : undefined}
                                    onValueChange={(value) => field.onChange(Number(value))}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select cinema" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {(cinemas?.data || []).map((item) => (
                                            <SelectItem key={item.id} value={String(item.id)}>
                                                {item.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="movieId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Movie</FormLabel>
                                <Select
                                    value={field.value ? String(field.value) : undefined}
                                    onValueChange={(value) => field.onChange(Number(value))}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select movie" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {(movies?.data || []).map((item) => (
                                            <SelectItem key={item.id} value={String(item.id)}>
                                                {item.title}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                        control={form.control}
                        name="cinemaFormatId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Format (Optional)</FormLabel>
                                <Select
                                    value={field.value ? String(field.value) : "none"}
                                    onValueChange={(value) =>
                                        field.onChange(
                                            value === "none" ? undefined : Number(value),
                                        )
                                    }
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Any format" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="none">Any format</SelectItem>
                                        {(movieFormats?.data || []).map((item) => (
                                            <SelectItem
                                                key={item.id}
                                                value={String(item.cinemaFormatId)}
                                            >
                                                {item.cinemaFormat?.label ||
                                                    `#${item.cinemaFormatId}`}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="reportDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Report Date</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="reportTime"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Report Time</FormLabel>
                                <FormControl>
                                    <Input type="time" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="border rounded-md p-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="font-medium">Ticket Entries</h3>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => append({ ticketTypeId: 0, quantity: 0 })}
                        >
                            <Plus className="h-4 w-4 mr-1" /> Add Entry
                        </Button>
                    </div>

                    {ticketEntryFields.map((field, index) => (
                        <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <FormField
                                control={form.control}
                                name={`ticketEntries.${index}.ticketTypeId`}
                                render={({ field: itemField }) => (
                                    <FormItem className="md:col-span-2">
                                        <FormLabel>Ticket Type</FormLabel>
                                        <Select
                                            value={
                                                itemField.value
                                                    ? String(itemField.value)
                                                    : undefined
                                            }
                                            onValueChange={(value) =>
                                                itemField.onChange(Number(value))
                                            }
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select ticket type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {(ticketTypes?.data || []).map((item) => (
                                                    <SelectItem
                                                        key={item.id}
                                                        value={String(item.id)}
                                                    >
                                                        {item.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex gap-2">
                                <FormField
                                    control={form.control}
                                    name={`ticketEntries.${index}.quantity`}
                                    render={({ field: itemField }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Qty</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    min={0}
                                                    value={itemField.value}
                                                    onChange={(event) =>
                                                        itemField.onChange(
                                                            Number(event.target.value),
                                                        )
                                                    }
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="self-end"
                                    onClick={() => remove(index)}
                                    disabled={ticketEntryFields.length === 1}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                {previewMutation.data && (
                    <div className="border rounded-md p-4 space-y-2">
                        <h3 className="font-medium">Computation Preview (Six-Step)</h3>
                        <p className="text-sm text-muted-foreground">
                            Base price → Discount → Cultural tax → Effective price → Gross → Tax → Net
                        </p>
                        {previewMutation.data.entries.map((entry, index) => (
                            <div key={`${entry.ticketTypeId}-${index}`} className="text-sm border-t pt-2">
                                <p>
                                    Ticket #{entry.ticketTypeId} x {entry.quantity} | Base: {entry.basePrice.toFixed(2)} |
                                    Discount: {entry.discountAmount.toFixed(2)} | Cultural Tax: {entry.culturalTaxDeduction.toFixed(4)} |
                                    Effective: {entry.effectivePrice.toFixed(2)} | Gross: {entry.grossAmount.toFixed(2)} |
                                    Tax: {entry.taxAmount.toFixed(2)} | Net: {entry.netAmount.toFixed(2)}
                                </p>
                            </div>
                        ))}
                        <div className="pt-2 text-sm font-medium">
                            Totals | Gross: {previewMutation.data.totals.totalGross.toFixed(2)} | Tax: {previewMutation.data.totals.totalTax.toFixed(2)} | Net: {previewMutation.data.totals.totalNet.toFixed(2)}
                        </div>
                    </div>
                )}

                <div className="flex gap-3">
                    <Button type="button" variant="outline" onClick={onValidateSchedule}>
                        Validate Schedule
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onPreview}
                        disabled={previewMutation.isPending}
                    >
                        {previewMutation.isPending ? "Previewing..." : "Preview Computation"}
                    </Button>
                    <Button type="submit" variant="success" disabled={isPending}>
                        {isPending
                            ? "Submitting..."
                            : initialData
                              ? "Update Hourly Report"
                              : "Submit Hourly Report"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
