import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";
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
import { Loader2, Plus, Trash2 } from "lucide-react";

import {
    bulkCreateScreeningTicketEntrySchema,
    type BulkCreateScreeningTicketEntryValues,
} from "./zScreeningTicketEntrySchema";
import { useCreateBulkScreeningTicketEntries } from "./mutations";
import { ticketTypesListOptions } from "../ticket-types/use-ticket-types";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/shadcn-ui/card";

interface Props {
    screeningId: number;
    basePrice: number;
    taxRate: number;
    taxDivisor: number;
    taxFormulaType: "gross_based" | "ticket_based";
    culturalTax: number;
    onSuccess?: () => void;
}

export function BulkCreateScreeningTicketEntryForm({
    screeningId,
    basePrice,
    taxRate,
    taxDivisor,
    taxFormulaType,
    culturalTax,
    onSuccess,
}: Props) {
    const { mutate: createBulkEntries, isPending } =
        useCreateBulkScreeningTicketEntries();

    const { data: ticketTypesData, isFetching: isFetchingTicketTypes } =
        useQuery(ticketTypesListOptions(1, 100));
    const ticketTypes = ticketTypesData?.data || [];

    const form = useForm<BulkCreateScreeningTicketEntryValues>({
        resolver: zodResolver(bulkCreateScreeningTicketEntrySchema),
        defaultValues: {
            entries: [
                {
                    screeningId,
                    ticketTypeId: undefined,
                    quantity: 0,
                    remarks: "",
                    discountSnapshot: 0,
                    culturalTaxSnapshot: 0,
                    effectivePrice: 0,
                    grossAmount: 0,
                    taxAmount: 0,
                    netAmount: 0,
                },
            ],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "entries",
    });

    // Helper to calculate totals based on valid form segments
    const computeTotals = (
        entries: BulkCreateScreeningTicketEntryValues["entries"],
    ) => {
        let totalQuantity = 0;
        let totalGross = 0;
        let totalNet = 0;
        let totalTax = 0;

        entries.forEach((entry) => {
            const ticketType = ticketTypes.find(
                (t) => t.id === entry.ticketTypeId,
            );
            if (!ticketType || !entry.quantity) return;

            // Compute discount
            const discountPct = Number(ticketType.discount?.percentage || 0);
            const discountVal = basePrice * (discountPct / 100);

            // Effective price
            const discountedPrice = basePrice - discountVal;
            const effectivePrice = Math.max(0, discountedPrice - culturalTax);

            // Row Gross
            const gross = effectivePrice * entry.quantity;

            // Tax and Net
            const taxMultiplier = taxDivisor
                ? taxRate / taxDivisor
                : taxRate / 100;

            let taxAmount = 0;
            if (taxFormulaType === "ticket_based") {
                taxAmount = gross * taxMultiplier;
            }
            const net = gross - taxAmount;

            totalQuantity += entry.quantity;
            totalGross += gross;
            if (taxFormulaType === "ticket_based") {
                totalNet += net;
                totalTax += taxAmount;
            }
        });

        // Apply gross aggregation logic for taxes if tax_rules demands it
        if (taxFormulaType === "gross_based") {
            const taxMultiplier = taxDivisor
                ? taxRate / taxDivisor
                : taxRate / 100;
            const overallTax = totalGross * taxMultiplier;
            totalTax = overallTax;
            totalNet = totalGross - overallTax;
        }

        return { totalQuantity, totalGross, totalNet, totalTax };
    };

    const onSubmit = async (data: BulkCreateScreeningTicketEntryValues) => {
        // Validate at least one entry
        if (data.entries.length === 0) {
            Swal.fire({
                title: "Validation Error",
                text: "You must add at least one ticket entry line.",
                icon: "warning",
            });
            return;
        }

        // Validate duplicates
        const ticketTypeSet = new Set(data.entries.map((e) => e.ticketTypeId));
        if (ticketTypeSet.size !== data.entries.length) {
            Swal.fire({
                title: "Validation Error",
                text: "Duplicate ticket classes cannot be selected in the batch.",
                icon: "warning",
            });
            return;
        }

        // Hydrate payloads for backend calculation bypassing generic mapped array
        const taxMultiplier = taxDivisor ? taxRate / taxDivisor : taxRate / 100;

        const hydratedEntries = data.entries.map((entry) => {
            const ticketType = ticketTypes.find(
                (t) => t.id === entry.ticketTypeId,
            );
            const discountPct = Number(ticketType?.discount?.percentage || 0);
            const discountSnapshot = basePrice * (discountPct / 100);

            const discountedPrice = basePrice - discountSnapshot;
            const effectivePrice = Math.max(0, discountedPrice - culturalTax);
            const grossAmount = effectivePrice * entry.quantity;

            let taxAmount = 0;
            if (taxFormulaType === "ticket_based") {
                taxAmount = grossAmount * taxMultiplier;
            } else if (taxFormulaType === "gross_based") {
                const percentageOfGross = grossAmount / totals.totalGross;
                const overallTax = totals.totalGross * taxMultiplier;
                taxAmount = overallTax * percentageOfGross; // Spread gross tax propotionally
            }

            const netAmount = grossAmount - taxAmount;

            return {
                ...entry,
                discountSnapshot,
                culturalTaxSnapshot: culturalTax,
                effectivePrice,
                grossAmount,
                taxAmount,
                netAmount,
            };
        });

        const totals = computeTotals(data.entries);

        const result = await Swal.fire({
            title: "Confirm Bulk Entry",
            html: `
        <div class="text-left text-sm space-y-4">
          <div>
            <h4 class="font-semibold text-primary">Summary</h4>
            <div class="grid grid-cols-2 gap-1 ml-2 mt-2">
               <p><strong>Total Tickets:</strong> ${totals.totalQuantity}</p>
               <p><strong>Base Price:</strong> ${basePrice.toFixed(2)}</p>
               <p><strong>Gross Amount:</strong> ${totals.totalGross.toFixed(2)}</p>
               <p><strong>Net Amount:</strong> ${totals.totalNet.toFixed(2)}</p>
               <p class="col-span-2 text-xs text-muted-foreground mt-2">
                  Tax deductions arrayed across ${taxFormulaType === "gross_based" ? "Gross Overall" : "Per Ticket"} @ ${taxMultiplier.toFixed(4)}x VAT/Tax rate and ${culturalTax} cultural offset.
               </p>
            </div>
          </div>
          <hr class="my-2"/>
          <div class="flex items-center gap-2 mt-4 bg-muted/50 p-2 rounded">
            <input type="checkbox" id="confirm-check" class="w-4 h-4 cursor-pointer" />
            <label for="confirm-check" class="text-xs cursor-pointer select-none">I verify that the batch processing details are final.</label>
          </div>
        </div>
      `,
            showCancelButton: true,
            confirmButtonText: "Submit Entries",
            width: "500px",
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
            createBulkEntries(
                { ...data, entries: hydratedEntries },
                {
                    onSuccess: () => {
                        Swal.fire({
                            title: "Records Appended",
                            text: "All ticket entries processed successfully.",
                            icon: "success",
                            showConfirmButton: false,
                            timer: 1500,
                        });
                        form.reset({
                            entries: [
                                {
                                    screeningId,
                                    ticketTypeId: undefined,
                                    quantity: 0,
                                    remarks: "",
                                    discountSnapshot: 0,
                                    culturalTaxSnapshot: 0,
                                    effectivePrice: 0,
                                    grossAmount: 0,
                                    taxAmount: 0,
                                    netAmount: 0,
                                },
                            ],
                        });
                        onSuccess?.();
                    },
                    onError: (error) => {
                        Swal.fire({
                            title: "Error",
                            text:
                                error.message ||
                                "Failed to submit ticket entries",
                            icon: "error",
                        });
                    },
                },
            );
        }
    };

    // eslint-disable-next-line react-hooks/incompatible-library
    const currentEntries = form.watch("entries");
    const { totalQuantity, totalGross, totalNet, totalTax } =
        computeTotals(currentEntries);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                    <CardTitle className="text-xl">Bulk Ticket Entry</CardTitle>
                    <CardDescription>
                        Input rapid quantities over assigned ticket classes.
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <div className="space-y-4">
                            {fields.map((field, index) => (
                                <div
                                    key={field.id}
                                    className="flex items-start gap-4 p-4 border rounded-md relative group bg-background"
                                >
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4">
                                        <div className="md:col-span-5">
                                            <FormField
                                                control={form.control}
                                                name={`entries.${index}.ticketTypeId`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-xs flex justify-between">
                                                            Ticket Type
                                                        </FormLabel>
                                                        <Select
                                                            onValueChange={(
                                                                val,
                                                            ) =>
                                                                field.onChange(
                                                                    parseInt(
                                                                        val,
                                                                        10,
                                                                    ),
                                                                )
                                                            }
                                                            value={
                                                                field.value?.toString() ||
                                                                ""
                                                            }
                                                            disabled={
                                                                isFetchingTicketTypes
                                                            }
                                                        >
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select type" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {ticketTypes.map(
                                                                    (t) => {
                                                                        const isSelectedElsewhere =
                                                                            currentEntries.some(
                                                                                (
                                                                                    e,
                                                                                    eIdx,
                                                                                ) =>
                                                                                    e.ticketTypeId ===
                                                                                        t.id &&
                                                                                    eIdx !==
                                                                                        index,
                                                                            );
                                                                        return (
                                                                            <SelectItem
                                                                                key={
                                                                                    t.id
                                                                                }
                                                                                value={t.id.toString()}
                                                                                disabled={
                                                                                    isSelectedElsewhere
                                                                                }
                                                                                className={
                                                                                    isSelectedElsewhere
                                                                                        ? "opacity-50 cursor-not-allowed"
                                                                                        : ""
                                                                                }
                                                                            >
                                                                                {
                                                                                    t.name
                                                                                }
                                                                                <i className="text-xs">
                                                                                    {t
                                                                                        .discount
                                                                                        ?.percentage &&
                                                                                        `(${t.discount?.percentage}% off)`}
                                                                                </i>
                                                                            </SelectItem>
                                                                        );
                                                                    },
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <FormField
                                                control={form.control}
                                                name={`entries.${index}.quantity`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-xs">
                                                            Quantity
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="number"
                                                                min="0"
                                                                {...field}
                                                                onChange={(e) =>
                                                                    field.onChange(
                                                                        parseInt(
                                                                            e
                                                                                .target
                                                                                .value,
                                                                            10,
                                                                        ) || 0,
                                                                    )
                                                                }
                                                                value={
                                                                    field.value ||
                                                                    0
                                                                }
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="md:col-span-5 flex flex-col justify-end">
                                            <FormField
                                                control={form.control}
                                                name={`entries.${index}.remarks`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-xs">
                                                            Remarks (Optional)
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Override notes"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            {(() => {
                                                const e = currentEntries[index];
                                                if (
                                                    !e?.quantity ||
                                                    !e?.ticketTypeId
                                                )
                                                    return null;
                                                const taxMultiplier = taxDivisor
                                                    ? taxRate / taxDivisor
                                                    : taxRate / 100;
                                                const ticketType =
                                                    ticketTypes.find(
                                                        (t) =>
                                                            t.id ===
                                                            e.ticketTypeId,
                                                    );
                                                const discountPct = Number(
                                                    ticketType?.discount
                                                        ?.percentage || 0,
                                                );
                                                const discountVal =
                                                    basePrice *
                                                    (discountPct / 100);
                                                const effectivePrice = Math.max(
                                                    0,
                                                    basePrice -
                                                        discountVal -
                                                        culturalTax,
                                                );
                                                const gross =
                                                    effectivePrice * e.quantity;
                                                const tax =
                                                    taxFormulaType ===
                                                    "ticket_based"
                                                        ? gross * taxMultiplier
                                                        : 0;

                                                return (
                                                    <div className="text-[10px] text-muted-foreground mt-2 flex gap-3 text-right">
                                                        <span>
                                                            Cultural Tax: ₱
                                                            {culturalTax.toFixed(
                                                                2,
                                                            )}
                                                        </span>
                                                        <span>
                                                            Effective: ₱
                                                            {effectivePrice.toFixed(
                                                                2,
                                                            )}
                                                        </span>
                                                        <span>
                                                            Gross: ₱
                                                            {gross.toFixed(2)}
                                                        </span>
                                                        <span>
                                                            Tax: ₱
                                                            {taxFormulaType ===
                                                            "gross_based"
                                                                ? "(Aggregated)"
                                                                : tax.toFixed(
                                                                      2,
                                                                  )}
                                                        </span>
                                                        <span className="font-semibold text-primary">
                                                            Net: ₱
                                                            {taxFormulaType ===
                                                            "gross_based"
                                                                ? "..."
                                                                : (
                                                                      gross -
                                                                      tax
                                                                  ).toFixed(2)}
                                                        </span>
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                    </div>

                                    {fields.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive h-10 w-10 mt-[26px]"
                                            onClick={() => remove(index)}
                                            title="Remove Entry"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between items-center bg-muted/30 p-4 rounded-md border">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    append({
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        ticketTypeId: undefined as any,
                                        screeningId,
                                        quantity: 0,
                                        remarks: "",
                                        discountSnapshot: 0,
                                        culturalTaxSnapshot: 0,
                                        effectivePrice: 0,
                                        grossAmount: 0,
                                        taxAmount: 0,
                                        netAmount: 0,
                                    })
                                }
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Add Entry Line
                            </Button>

                            <div className="flex gap-6 text-sm">
                                <span className="text-muted-foreground">
                                    Gross:{" "}
                                    <span className="font-semibold text-foreground">
                                        ₱ {totalGross.toFixed(2)}
                                    </span>
                                </span>
                                <span className="text-muted-foreground">
                                    Tax (est):{" "}
                                    <span className="font-semibold text-foreground">
                                        ₱ {totalTax.toFixed(2)}
                                    </span>
                                </span>
                                <span className="text-muted-foreground">
                                    Net (est):{" "}
                                    <span className="font-semibold text-foreground">
                                        ₱ {totalNet.toFixed(2)}
                                    </span>
                                </span>
                                <span className="text-muted-foreground">
                                    Total Qty:{" "}
                                    <span className="font-semibold text-foreground">
                                        {totalQuantity}
                                    </span>
                                </span>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button
                                type="submit"
                                variant="default"
                                size="lg"
                                disabled={isPending}
                            >
                                {isPending ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : null}
                                Submit Batch Entries
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
