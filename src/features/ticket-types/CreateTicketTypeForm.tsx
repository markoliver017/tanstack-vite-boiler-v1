import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";

import { Button } from "@/components/shadcn-ui/button";
import { Checkbox } from "@/components/shadcn-ui/checkbox";
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
import { fetchList } from "@/lib/api.client";
import { useCreateTicketType, useUpdateTicketType } from "./mutations";
import {
    createTicketTypeSchema,
    type CreateTicketTypeValues,
    type TicketTypeResponse,
} from "./zTicketTypeSchema";

export function CreateTicketTypeForm({
    initialData,
}: {
    initialData?: TicketTypeResponse;
}) {
    const navigate = useNavigate();
    const createMutation = useCreateTicketType();
    const updateMutation = useUpdateTicketType();

    const { data: theaters } = useQuery({
        queryKey: ["theaters", "lookup"],
        queryFn: () =>
            fetchList<{ id: number; name: string }[]>(
                "/theaters?_page=1&_limit=500",
            ),
    });

    const { data: discounts } = useQuery({
        queryKey: ["discounts", "lookup"],
        queryFn: () =>
            fetchList<{ id: number; discountPct: string }[]>(
                "/discounts?_page=1&_limit=500",
            ),
    });

    const form = useForm<CreateTicketTypeValues>({
        resolver: zodResolver(createTicketTypeSchema),
        defaultValues: {
            theaterId: initialData?.theaterId || null,
            name: initialData?.name || "",
            discountId: initialData?.discountId || null,
            isTaxable: initialData?.isTaxable ?? true,
        },
    });

    const onSubmit = async (data: CreateTicketTypeValues) => {
        if (initialData) {
            await updateMutation.mutateAsync({ id: initialData.id, data });
            return;
        }

        await createMutation.mutateAsync(data);
        navigate({ to: "/ticket-types", search: { page: 1, limit: 10 } });
    };

    const isPending = createMutation.isPending || updateMutation.isPending;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="Adult, Student, Senior"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="theaterId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Theater (Optional)</FormLabel>
                                <Select
                                    value={
                                        field.value !== undefined &&
                                        field.value !== null
                                            ? String(field.value)
                                            : "none"
                                    }
                                    onValueChange={(value) =>
                                        field.onChange(
                                            value === "none"
                                                ? undefined
                                                : Number(value),
                                        )
                                    }
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Global" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="none">
                                            Global
                                        </SelectItem>
                                        {(theaters?.data || []).map(
                                            (theater) => (
                                                <SelectItem
                                                    key={theater.id}
                                                    value={String(theater.id)}
                                                >
                                                    {theater.name}
                                                </SelectItem>
                                            ),
                                        )}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="discountId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Discount (Optional)</FormLabel>
                                <Select
                                    value={
                                        field.value !== undefined &&
                                        field.value !== null
                                            ? String(field.value)
                                            : "none"
                                    }
                                    onValueChange={(value) =>
                                        field.onChange(
                                            value === "none"
                                                ? null
                                                : Number(value),
                                        )
                                    }
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="No discount" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="none">
                                            No discount
                                        </SelectItem>
                                        {(discounts?.data || []).map(
                                            (discount) => (
                                                <SelectItem
                                                    key={discount.id}
                                                    value={String(discount.id)}
                                                >
                                                    #{discount.id} (
                                                    {discount.discountPct})
                                                </SelectItem>
                                            ),
                                        )}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="isTaxable"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center gap-3 border rounded-md p-3">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <FormLabel>Taxable</FormLabel>
                        </FormItem>
                    )}
                />

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
                              : "Create Ticket Type"}
                    </Button>
                    {!initialData && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                                navigate({
                                    to: "/ticket-types",
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
