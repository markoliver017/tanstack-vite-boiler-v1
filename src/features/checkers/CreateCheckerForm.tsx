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
import {
    useCreateChecker,
    useUpdateChecker,
} from "./mutations";
import {
    createCheckerSchema,
    type CheckerResponse,
    type CreateCheckerValues,
} from "./zCheckerSchema";

type CheckerUserLookup = {
    id: string;
    name: string;
    email: string;
    role?: string;
};

export function CreateCheckerForm({
    initialData,
}: {
    initialData?: CheckerResponse;
}) {
    const navigate = useNavigate();
    const createMutation = useCreateChecker();
    const updateMutation = useUpdateChecker();

    const { data: users } = useQuery({
        queryKey: ["users", "checker-lookup"],
        queryFn: () =>
            fetchList<CheckerUserLookup[]>(`/users?_page=1&_limit=500`),
    });

    const { data: agencies } = useQuery({
        queryKey: ["agencies", "lookup"],
        queryFn: () => fetchList<{ id: number; name: string }[]>(`/agencies?_page=1&_limit=200`),
    });

    const checkerUsers = (users?.data || []).filter((user) => user.role === "checker");

    const form = useForm<CreateCheckerValues>({
        resolver: zodResolver(createCheckerSchema),
        defaultValues: {
            userId: initialData?.userId || "",
            agencyId: initialData?.agencyId || 0,
            fullName: initialData?.fullName || "",
            contactNo: initialData?.contactNo || "",
            address: initialData?.address || "",
            employmentDate: initialData?.employmentDate || "",
            endDate: initialData?.endDate || "",
            idPhotoUrl: initialData?.idPhotoUrl || "",
            notes: initialData?.notes || "",
            isActive: initialData?.isActive ?? true,
        },
    });

    const onSubmit = async (data: CreateCheckerValues) => {
        if (initialData) {
            await updateMutation.mutateAsync({ id: initialData.id, data });
            return;
        }

        await createMutation.mutateAsync(data);
        navigate({ to: "/checkers", search: { page: 1, limit: 10 } });
    };

    const isPending = createMutation.isPending || updateMutation.isPending;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="userId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>User Account</FormLabel>
                                <Select
                                    value={field.value || undefined}
                                    onValueChange={field.onChange}
                                    disabled={Boolean(initialData)}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select checker user" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {checkerUsers.map((user) => (
                                            <SelectItem key={user.id} value={user.id}>
                                                {user.name} ({user.email})
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
                        name="agencyId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Agency</FormLabel>
                                <Select
                                    value={field.value ? String(field.value) : undefined}
                                    onValueChange={(value) => field.onChange(Number(value))}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select agency" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {(agencies?.data || []).map((agency) => (
                                            <SelectItem key={agency.id} value={String(agency.id)}>
                                                {agency.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="contactNo"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Contact No.</FormLabel>
                                <FormControl>
                                    <Input {...field} value={field.value || ""} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="idPhotoUrl"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>ID Photo URL</FormLabel>
                                <FormControl>
                                    <Input {...field} value={field.value || ""} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                                <Input {...field} value={field.value || ""} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="employmentDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Employment Date</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="endDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>End Date</FormLabel>
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
                              : "Create Checker"}
                    </Button>
                    {!initialData && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                                navigate({
                                    to: "/checkers",
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
