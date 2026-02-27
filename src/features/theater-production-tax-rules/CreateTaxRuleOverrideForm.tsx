import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/shadcn-ui/select";
import { fetchList } from "@/lib/api.client";
import {
    useCreateTaxRuleOverride,
    useUpdateTaxRuleOverride,
} from "./mutations";
import {
    createTaxRuleOverrideSchema,
    type CreateTaxRuleOverrideValues,
    type TaxRuleOverrideResponse,
} from "./zTaxRuleOverrideSchema";

export function CreateTaxRuleOverrideForm({
    initialData,
    defaultTheaterId,
    defaultProductionCompanyId,
    lockTheaterAndCompany = false,
    onSuccess,
}: {
    initialData?: TaxRuleOverrideResponse;
    defaultTheaterId?: number;
    defaultProductionCompanyId?: number;
    lockTheaterAndCompany?: boolean;
    onSuccess?: () => void;
}) {
    const navigate = useNavigate();
    const createMutation = useCreateTaxRuleOverride();
    const updateMutation = useUpdateTaxRuleOverride();

    const { data: theaters } = useQuery({
        queryKey: ["theaters", "lookup"],
        queryFn: () =>
            fetchList<{ id: number; name: string }[]>(
                `/theaters?_page=1&_limit=300`,
            ),
    });

    const { data: companies } = useQuery({
        queryKey: ["production-companies", "lookup"],
        queryFn: () =>
            fetchList<{ id: number; name: string }[]>(
                `/production-companies?_page=1&_limit=300`,
            ),
    });

    const { data: taxRules } = useQuery({
        queryKey: ["tax-rules", "lookup"],
        queryFn: () =>
            fetchList<{ id: number; name: string }[]>(
                `/tax-rules?_page=1&_limit=300`,
            ),
    });

    const form = useForm<CreateTaxRuleOverrideValues>({
        resolver: zodResolver(createTaxRuleOverrideSchema),
        defaultValues: {
            theaterId: initialData?.theaterId || defaultTheaterId || 0,
            productionCompanyId:
                initialData?.productionCompanyId ||
                defaultProductionCompanyId ||
                0,
            taxRuleId: initialData?.taxRuleId || 0,
            effectiveDate: initialData?.effectiveDate || "",
            expiryDate: initialData?.expiryDate || "",
            notes: initialData?.notes || "",
        },
    });

    const onSubmit = async (data: CreateTaxRuleOverrideValues) => {
        if (initialData) {
            await updateMutation.mutateAsync({ id: initialData.id, data });
            return;
        }

        await createMutation.mutateAsync(data);

        if (onSuccess) {
            onSuccess();
            return;
        }

        navigate({
            to: "/theater-production-tax-rules",
            search: { page: 1, limit: 10 },
        });
    };

    const isPending = createMutation.isPending || updateMutation.isPending;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="theaterId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Theater</FormLabel>
                            <Select
                                value={
                                    field.value
                                        ? String(field.value)
                                        : undefined
                                }
                                onValueChange={(value) =>
                                    field.onChange(Number(value))
                                }
                                disabled={lockTheaterAndCompany && !initialData}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select theater" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {(theaters?.data || []).map((theater) => (
                                        <SelectItem
                                            key={theater.id}
                                            value={String(theater.id)}
                                        >
                                            {theater.name}
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
                    name="productionCompanyId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Production Company</FormLabel>
                            <Select
                                value={
                                    field.value
                                        ? String(field.value)
                                        : undefined
                                }
                                onValueChange={(value) =>
                                    field.onChange(Number(value))
                                }
                                disabled={lockTheaterAndCompany && !initialData}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select production company" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {(companies?.data || []).map((company) => (
                                        <SelectItem
                                            key={company.id}
                                            value={String(company.id)}
                                        >
                                            {company.name}
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
                    name="taxRuleId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tax Rule</FormLabel>
                            <Select
                                value={
                                    field.value
                                        ? String(field.value)
                                        : undefined
                                }
                                onValueChange={(value) =>
                                    field.onChange(Number(value))
                                }
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select tax rule" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {(taxRules?.data || []).map((taxRule) => (
                                        <SelectItem
                                            key={taxRule.id}
                                            value={String(taxRule.id)}
                                        >
                                            {taxRule.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="effectiveDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Effective Date</FormLabel>
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

                <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Notes</FormLabel>
                            <FormControl>
                                <Input {...field} value={field.value || ""} />
                            </FormControl>
                            <FormMessage />
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
                              : "Create Override"}
                    </Button>
                    {!initialData && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                if (onSuccess) {
                                    onSuccess();
                                } else {
                                    navigate({
                                        to: "/theater-production-tax-rules",
                                        search: { page: 1, limit: 10 },
                                    });
                                }
                            }}
                        >
                            Cancel
                        </Button>
                    )}
                </div>
            </form>
        </Form>
    );
}
