import { useEffect } from "react";
import { useForm } from "react-hook-form";
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
import { Textarea } from "@/components/shadcn-ui/textarea";
import { Loader2 } from "lucide-react";

import {
    createScreeningTicketEntrySchema,
    type CreateScreeningTicketEntryValues,
    type ScreeningTicketEntryResponse,
} from "./zScreeningTicketEntrySchema";
import {
    useCreateScreeningTicketEntry,
    useUpdateScreeningTicketEntry,
} from "./mutations";
import { ticketTypesListOptions } from "../ticket-types/use-ticket-types";
import FormDebugger from "@/components/shared/FormDebugger";

interface Props {
    screeningId: number;
    basePrice: number;
    taxRate: number;
    taxDivisor: number;
    taxFormulaType: "gross_based" | "ticket_based";
    culturalTax: number;
    initialData?: ScreeningTicketEntryResponse;
    onSuccess?: () => void;
}

export function CreateScreeningTicketEntryForm({
    screeningId,
    basePrice,
    taxRate,
    taxDivisor,
    taxFormulaType,
    culturalTax,
    initialData,
    onSuccess,
}: Props) {
    const { mutate: createEntry, isPending: isCreating } =
        useCreateScreeningTicketEntry();
    const { mutate: updateEntry, isPending: isUpdating } =
        useUpdateScreeningTicketEntry();

    const isPending = isCreating || isUpdating;

    const { data: ticketTypesData, isFetching: isFetchingTicketTypes } =
        useQuery(ticketTypesListOptions(1, 100));
    const ticketTypes = ticketTypesData?.data || [];

    const form = useForm<CreateScreeningTicketEntryValues>({
        resolver: zodResolver(createScreeningTicketEntrySchema),
        defaultValues: {
            screeningId,
            ticketTypeId: initialData?.ticketTypeId || undefined,
            quantity: 0,
            remarks: "",
            discountSnapshot: 0,
            culturalTaxSnapshot: 0,
            effectivePrice: 0,
            grossAmount: 0,
            taxAmount: 0,
            netAmount: 0,
        },
    });

    useEffect(() => {
        if (initialData) {
            form.reset({
                screeningId: initialData.screeningId,
                ticketTypeId: initialData.ticketTypeId,
                quantity: initialData.quantity,
                remarks: initialData.remarks || "",
                discountSnapshot: 0,
                culturalTaxSnapshot: 0,
                effectivePrice: 0,
                grossAmount: 0,
                taxAmount: 0,
                netAmount: 0,
            });
        } else {
            form.reset({
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
            });
        }
    }, [initialData, form, screeningId]);

    const onSubmit = async (data: CreateScreeningTicketEntryValues) => {
        const selectedTicketType = ticketTypes.find(
            (t) => t.id === data.ticketTypeId,
        );
        const ticketTypeName = selectedTicketType?.name || data.ticketTypeId;

        // Perform computation
        const discountPct = Number(
            selectedTicketType?.discount?.percentage || 0,
        );
        const discountSnapshot = basePrice * (discountPct / 100);

        const discountedPrice = basePrice - discountSnapshot;
        const effectivePrice = Math.max(0, discountedPrice - culturalTax);
        const grossAmount = effectivePrice * data.quantity;

        const taxMultiplier = taxDivisor ? taxRate / taxDivisor : taxRate / 100;
        // For a single entry, just linearly apply the tax
        const taxAmount = grossAmount * taxMultiplier;
        const netAmount = grossAmount - taxAmount;

        const payload = {
            ...data,
            discountSnapshot,
            culturalTaxSnapshot: culturalTax,
            effectivePrice,
            grossAmount,
            taxAmount,
            netAmount,
        };

        const result = await Swal.fire({
            title: "Review Details",
            target:
                document.getElementById("screening-ticket-entry-modal") ||
                undefined,
            html: `
        <div class="text-left text-sm space-y-4">
          <div>
            <h4 class="font-semibold text-primary">Ticket Entry</h4>
            <div class="grid grid-cols-2 gap-1 ml-2 mt-2">
               <p><strong>Ticket Type:</strong> ${ticketTypeName}</p>
               <p><strong>Quantity:</strong> ${payload.quantity}</p>
               <p><strong>Gross:</strong> ₱${payload.grossAmount.toFixed(2)}</p>
               <p><strong>Net:</strong> ₱${payload.netAmount.toFixed(2)}</p>
               <p class="col-span-2"><strong>Remarks:</strong> ${payload.remarks || "None"}</p>
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
            confirmButtonText: initialData ? "Update Entry" : "Add Entry",
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
            if (initialData) {
                updateEntry(
                    { id: initialData.id, data: payload },
                    {
                        onSuccess: () => {
                            Swal.fire({
                                title: "Success",
                                text: "Ticket entry updated successfully",
                                icon: "success",
                                target:
                                    document.getElementById(
                                        "screening-ticket-entry-modal",
                                    ) || undefined,
                                showConfirmButton: false,
                                timer: 1500,
                            });
                            onSuccess?.();
                        },
                        onError: (error) => {
                            Swal.fire({
                                title: "Error",
                                text:
                                    error.message ||
                                    "Failed to update ticket entry",
                                icon: "error",
                                target:
                                    document.getElementById(
                                        "screening-ticket-entry-modal",
                                    ) || undefined,
                            });
                        },
                    },
                );
            } else {
                createEntry(payload, {
                    onSuccess: () => {
                        Swal.fire({
                            title: "Success",
                            text: "Ticket entry added successfully",
                            icon: "success",
                            target:
                                document.getElementById(
                                    "screening-ticket-entry-modal",
                                ) || undefined,
                            showConfirmButton: false,
                            timer: 1500,
                        });
                        form.reset({
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
                        });
                        onSuccess?.();
                    },
                    onError: (error) => {
                        Swal.fire({
                            title: "Error",
                            text: error.message || "Failed to add ticket entry",
                            icon: "error",
                            target:
                                document.getElementById(
                                    "screening-ticket-entry-modal",
                                ) || undefined,
                        });
                    },
                });
            }
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="ticketTypeId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Ticket Type</FormLabel>
                            <Select
                                onValueChange={(val) =>
                                    field.onChange(parseInt(val, 10))
                                }
                                value={field.value?.toString() || ""}
                                disabled={isFetchingTicketTypes}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select ticket type" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {ticketTypes.map((t) => (
                                        <SelectItem
                                            key={t.id}
                                            value={t.id.toString()}
                                        >
                                            {t.name}
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
                    name="quantity"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Quantity</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    min="0"
                                    {...field}
                                    onChange={(e) =>
                                        field.onChange(
                                            parseInt(e.target.value, 10) || 0,
                                        )
                                    }
                                    value={field.value || 0}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="remarks"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Remarks (Optional)</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Any notes about these tickets..."
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {(() => {
                    const currentTicketTypeId = form.watch("ticketTypeId");
                    const currentQuantity = form.watch("quantity") || 0;
                    if (!currentTicketTypeId || !currentQuantity) return null;

                    const currentTicketType = ticketTypes.find(
                        (t) => t.id === currentTicketTypeId,
                    );
                    const discountPct = Number(
                        currentTicketType?.discount?.percentage || 0,
                    );
                    const discountVal = basePrice * (discountPct / 100);
                    const effectivePrice = Math.max(
                        0,
                        basePrice - discountVal - culturalTax,
                    );
                    const gross = effectivePrice * currentQuantity;
                    const taxMultiplier = taxDivisor
                        ? taxRate / taxDivisor
                        : taxRate / 100;
                    const tax =
                        taxFormulaType === "ticket_based"
                            ? gross * taxMultiplier
                            : 0;
                    const net = gross - tax;

                    return (
                        <div className="text-xs text-muted-foreground mt-4 mb-2 flex flex-wrap gap-4 p-3 bg-muted/30 rounded border">
                            <span>Cultural Tax: ₱{culturalTax.toFixed(2)}</span>
                            <span>Effective: ₱{effectivePrice.toFixed(2)}</span>
                            <span>Gross: ₱{gross.toFixed(2)}</span>
                            <span>
                                Tax: ₱
                                {taxFormulaType === "gross_based"
                                    ? "(Aggregated)"
                                    : tax.toFixed(2)}
                            </span>
                            <span className="font-semibold text-primary">
                                Net: ₱
                                {taxFormulaType === "gross_based"
                                    ? "..."
                                    : net.toFixed(2)}
                            </span>
                        </div>
                    );
                })()}

                <div className="flex justify-end pt-4">
                    <Button
                        type="submit"
                        variant="success"
                        disabled={isPending}
                    >
                        {isPending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : null}
                        {initialData ? "Update Entry" : "Add Entry"}
                    </Button>
                </div>
            </form>
            <FormDebugger form={form} />
        </Form>
    );
}
