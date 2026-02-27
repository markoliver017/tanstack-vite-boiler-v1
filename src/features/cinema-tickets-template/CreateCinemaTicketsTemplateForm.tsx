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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/shadcn-ui/select";
import { fetchList } from "@/lib/api.client";
import {
    useCreateCinemaTicketsTemplate,
    useUpdateCinemaTicketsTemplate,
} from "./mutations";
import {
    createCinemaTicketsTemplateSchema,
    type CinemaTicketsTemplateResponse,
    type CreateCinemaTicketsTemplateValues,
} from "./zCinemaTicketsTemplateSchema";

export function CreateCinemaTicketsTemplateForm({
    initialData,
}: {
    initialData?: CinemaTicketsTemplateResponse;
}) {
    const navigate = useNavigate();
    const createMutation = useCreateCinemaTicketsTemplate();
    const updateMutation = useUpdateCinemaTicketsTemplate();

    const { data: cinemas } = useQuery({
        queryKey: ["cinemas", "lookup"],
        queryFn: () =>
            fetchList<{ id: number; name: string }[]>("/cinemas?_page=1&_limit=500"),
    });

    const { data: ticketTypes } = useQuery({
        queryKey: ["ticket-types", "lookup"],
        queryFn: () =>
            fetchList<{ id: number; name: string }[]>("/ticket-types?_page=1&_limit=500"),
    });

    const form = useForm<CreateCinemaTicketsTemplateValues>({
        resolver: zodResolver(createCinemaTicketsTemplateSchema),
        defaultValues: {
            cinemaId: initialData?.cinemaId || 0,
            ticketTypeId: initialData?.ticketTypeId || 0,
        },
    });

    const onSubmit = async (data: CreateCinemaTicketsTemplateValues) => {
        if (initialData) {
            await updateMutation.mutateAsync({ id: initialData.id, data });
            return;
        }

        await createMutation.mutateAsync(data);
        navigate({ to: "/cinema-tickets-template", search: { page: 1, limit: 10 } });
    };

    const isPending = createMutation.isPending || updateMutation.isPending;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                    name="ticketTypeId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Ticket Type</FormLabel>
                            <Select
                                value={field.value ? String(field.value) : undefined}
                                onValueChange={(value) => field.onChange(Number(value))}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select ticket type" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {(ticketTypes?.data || []).map((item) => (
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

                <div className="flex gap-3">
                    <Button type="submit" variant="success" disabled={isPending}>
                        {isPending
                            ? "Saving..."
                            : initialData
                              ? "Save Changes"
                              : "Create Mapping"}
                    </Button>
                    {!initialData && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                                navigate({
                                    to: "/cinema-tickets-template",
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
