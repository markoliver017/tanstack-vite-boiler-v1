import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";
import { fetchList } from "@/lib/api.client";
import { useNavigate } from "@tanstack/react-router";

// Shadcn UI
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
    FormDescription,
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
import { Checkbox } from "@/components/shadcn-ui/checkbox";

// Icons
import { Loader2 } from "lucide-react";

// Local
import {
    createTheaterSchema,
    type CreateTheaterValues,
    type TheaterResponse,
} from "./zTheatersSchema";
import { useCreateTheater, useUpdateTheater } from "./mutations";

interface TheaterFormProps {
    initialData?: TheaterResponse;
}

export default function TheaterForm({ initialData }: TheaterFormProps) {
    const navigate = useNavigate();
    const isEdit = !!initialData;

    const createMutation = useCreateTheater();
    const updateMutation = useUpdateTheater();

    const isPending = createMutation.isPending || updateMutation.isPending;

    const form = useForm<CreateTheaterValues>({
        resolver: zodResolver(createTheaterSchema) as any,
        defaultValues: {
            theaterGroupId: initialData?.theaterGroupId,
            taxRuleId: initialData?.taxRuleId,
            name: initialData?.name || "",
            address: initialData?.address || "",
            city: initialData?.city || "",
            province: initialData?.province || "",
            latitude: initialData?.latitude
                ? Number(initialData.latitude)
                : undefined,
            longitude: initialData?.longitude
                ? Number(initialData.longitude)
                : undefined,
            isActive: initialData?.isActive ?? true,
        } as any,
    });

    // Fetch Theater Groups
    const { data: theaterGroupsData, isLoading: isLoadingGroups } = useQuery({
        queryKey: ["theater-groups-list"],
        queryFn: () => fetchList<any[]>("/theater-groups?_limit=100"), // Simple fetch for dropdown
    });

    // Fetch Tax Rules
    const { data: taxRulesData, isLoading: isLoadingTaxRules } = useQuery({
        queryKey: ["tax-rules-list"],
        queryFn: () => fetchList<any[]>("/tax-rules?_limit=100"), // Simple fetch for dropdown
    });

    const onSubmit = async (data: CreateTheaterValues) => {
        // Find labels for summary
        const group =
            theaterGroupsData?.data.find((g) => g.id === data.theaterGroupId)
                ?.name || data.theaterGroupId;
        const taxRule =
            taxRulesData?.data.find((t) => t.id === data.taxRuleId)?.name ||
            data.taxRuleId;

        const result = await Swal.fire({
            title: isEdit ? "Update Theater?" : "Create Theater?",
            html: `
        <div class="text-left text-sm space-y-2">
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Group:</strong> ${group}</p>
            <p><strong>Tax Rule:</strong> ${taxRule}</p>
            <p><strong>City:</strong> ${data.city}</p>
            <p><strong>Location:</strong> ${data.latitude}, ${data.longitude}</p>
            <div class="flex items-center gap-2 mt-4 bg-muted/50 p-2 rounded">
                <input type="checkbox" id="confirm-check" class="w-4 h-4 cursor-pointer" />
                <label for="confirm-check" class="text-xs cursor-pointer select-none">I verify that the information above is correct.</label>
            </div>
        </div>
      `,
            showCancelButton: true,
            confirmButtonText: isEdit ? "Update" : "Create",
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
            if (isEdit && initialData) {
                updateMutation.mutate(
                    { id: String(initialData.id), data },
                    {
                        onSuccess: () => {
                            Swal.fire(
                                "Success",
                                "Theater updated successfully",
                                "success",
                            );
                            navigate({ to: "/theaters" });
                        },
                        onError: (err) => {
                            Swal.fire("Error", err.message, "error");
                        },
                    },
                );
            } else {
                createMutation.mutate(data, {
                    onSuccess: () => {
                        Swal.fire(
                            "Success",
                            "Theater created successfully",
                            "success",
                        );
                        navigate({ to: "/theaters" });
                    },
                    onError: (err) => {
                        Swal.fire("Error", err.message, "error");
                    },
                });
            }
        }
    };

    if (isLoadingGroups || isLoadingTaxRules) {
        return (
            <div className="p-4 flex items-center justify-center">
                <Loader2 className="animate-spin" /> Loading metadata...
            </div>
        );
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit as any)}
                className="space-y-6 max-w-2xl"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control as any}
                        name="theaterGroupId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Theater Group</FormLabel>
                                <Select
                                    onValueChange={(val) =>
                                        field.onChange(Number(val))
                                    }
                                    defaultValue={
                                        field.value
                                            ? String(field.value)
                                            : undefined
                                    }
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a group" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {theaterGroupsData?.data.map(
                                            (group) => (
                                                <SelectItem
                                                    key={group.id}
                                                    value={String(group.id)}
                                                >
                                                    {group.name}
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
                        control={form.control as any}
                        name="taxRuleId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tax Rule</FormLabel>
                                <Select
                                    onValueChange={(val) =>
                                        field.onChange(Number(val))
                                    }
                                    defaultValue={
                                        field.value
                                            ? String(field.value)
                                            : undefined
                                    }
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a tax rule" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {taxRulesData?.data.map((rule) => (
                                            <SelectItem
                                                key={rule.id}
                                                value={String(rule.id)}
                                            >
                                                {rule.name} ({rule.taxRate}%)
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormDescription>
                                    Determines tax calculation logic.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control as any}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Theater Name</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="e.g. SM City Fairview"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control as any}
                    name="address"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Full street address"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control as any}
                        name="city"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="e.g. Quezon City"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control as any}
                        name="province"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Province (Optional)</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="e.g. NCR"
                                        {...field}
                                        value={field.value || ""}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control as any}
                        name="latitude"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Latitude</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        step="any"
                                        placeholder="14.123456"
                                        {...field}
                                        onChange={(e) =>
                                            field.onChange(
                                                e.target.valueAsNumber,
                                            )
                                        }
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control as any}
                        name="longitude"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Longitude</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        step="any"
                                        placeholder="121.123456"
                                        {...field}
                                        onChange={(e) =>
                                            field.onChange(
                                                e.target.valueAsNumber,
                                            )
                                        }
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control as any}
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
                                    Inactive theaters won't appear in selection
                                    lists.
                                </FormDescription>
                            </div>
                        </FormItem>
                    )}
                />

                <div className="flex justify-end gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate({ to: "/theaters" })}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="success"
                        disabled={isPending}
                    >
                        {isPending && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {isEdit ? "Update Theater" : "Create Theater"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
