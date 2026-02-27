import { zodResolver } from "@hookform/resolvers/zod";
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
import {
    useCreateCulturalTax,
    useUpdateCulturalTax,
} from "./mutations";
import {
    createCulturalTaxSchema,
    type CreateCulturalTaxValues,
    type CulturalTaxResponse,
} from "./zCulturalTaxSchema";

export function CreateCulturalTaxForm({
    initialData,
}: {
    initialData?: CulturalTaxResponse;
}) {
    const navigate = useNavigate();
    const createMutation = useCreateCulturalTax();
    const updateMutation = useUpdateCulturalTax();

    const form = useForm<CreateCulturalTaxValues>({
        resolver: zodResolver(createCulturalTaxSchema),
        defaultValues: {
            name: initialData?.name || "",
            city: initialData?.city || "",
            province: initialData?.province || "",
            amountType: initialData?.amountType || "fixed_amount",
            deductionValue: initialData
                ? Number(initialData.deductionValue)
                : 0,
            effectivityDate: initialData?.effectivityDate || "",
            expiryDate: initialData?.expiryDate || "",
            memoReference: initialData?.memoReference || "",
            isActive: initialData?.isActive ?? true,
        },
    });

    const onSubmit = async (data: CreateCulturalTaxValues) => {
        if (initialData) {
            await updateMutation.mutateAsync({
                id: initialData.id,
                data,
            });
            return;
        }

        await createMutation.mutateAsync(data);
        navigate({ to: "/cultural-taxes", search: { page: 1, limit: 10 } });
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
                                <Input {...field} placeholder="Tax ordinance name" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                    <Input {...field} value={field.value || ""} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="province"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Province</FormLabel>
                                <FormControl>
                                    <Input {...field} value={field.value || ""} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="amountType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Amount Type</FormLabel>
                                <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="fixed_amount">
                                            fixed_amount
                                        </SelectItem>
                                        <SelectItem value="percentage_of_discounted_price">
                                            percentage_of_discounted_price
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="deductionValue"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Deduction Value</FormLabel>
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="effectivityDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Effectivity Date</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="expiryDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Expiry Date</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} value={field.value || ""} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="memoReference"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Memo Reference</FormLabel>
                            <FormControl>
                                <Input {...field} value={field.value || ""} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center gap-3 border rounded-md p-3">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <FormLabel>Active</FormLabel>
                        </FormItem>
                    )}
                />

                <div className="flex gap-3">
                    <Button type="submit" variant="success" disabled={isPending}>
                        {isPending
                            ? "Saving..."
                            : initialData
                              ? "Save Changes"
                              : "Create Cultural Tax"}
                    </Button>
                    {!initialData && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                                navigate({
                                    to: "/cultural-taxes",
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
