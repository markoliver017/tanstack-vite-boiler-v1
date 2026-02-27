import { zodResolver } from "@hookform/resolvers/zod";

import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";

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

import { useCreateDiscount, useUpdateDiscount } from "./mutations";
import {
    createDiscountSchema,
    type CreateDiscountValues,
    type DiscountResponse,
} from "./zDiscountSchema";

export function CreateDiscountForm({
    initialData,
}: {
    initialData?: DiscountResponse;
}) {
    const navigate = useNavigate();
    const createMutation = useCreateDiscount();
    const updateMutation = useUpdateDiscount();

    const form = useForm<CreateDiscountValues>({
        resolver: zodResolver(createDiscountSchema),
        defaultValues: {
            discountPct: initialData ? Number(initialData.discountPct) : 0,
            validFrom: initialData?.validFrom || "",
            validUntil: initialData?.validUntil || "",
        },
    });

    const onSubmit = async (data: CreateDiscountValues) => {
        if (initialData) {
            await updateMutation.mutateAsync({ id: initialData.id, data });
            return;
        }

        await createMutation.mutateAsync(data);
        navigate({ to: "/discounts", search: { page: 1, limit: 10 } });
    };

    const isPending = createMutation.isPending || updateMutation.isPending;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="discountPct"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Discount Percent</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    step="0.0001"
                                    value={field.value}
                                    onChange={(e) =>
                                        field.onChange(Number(e.target.value))
                                    }
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="validFrom"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Valid From</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="validUntil"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Valid Until</FormLabel>
                                <FormControl>
                                    <Input
                                        type="date"
                                        {...field}
                                        value={field.value || ""}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex gap-3">
                    <Button
                        type="submit"
                        variant="success"
                        disabled={isPending}
                    >
                        {isPending
                            ? "Saving..."
                            : initialData
                              ? "Save Changes"
                              : "Create Discount"}
                    </Button>
                    {!initialData && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                                navigate({
                                    to: "/discounts",
                                    search: { page: 1, limit: 10 },
                                })
                            }
                        >
                            Cancel
                        </Button>
                    )}
                </div>
            </form>
        </Form>
    );
}
