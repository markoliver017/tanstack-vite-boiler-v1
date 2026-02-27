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
    useCreateTheaterMovieTicketPrice,
    useUpdateTheaterMovieTicketPrice,
} from "./mutations";
import {
    createTheaterMovieTicketPriceSchema,
    type CreateTheaterMovieTicketPriceValues,
    type TheaterMovieTicketPriceResponse,
} from "./zTheaterMovieTicketPriceSchema";

export function CreateTheaterMovieTicketPriceForm({
    initialData,
    defaultMovieId,
    defaultTheaterId,
    lockMovieAndTheater = false,
    onSuccess,
}: {
    initialData?: TheaterMovieTicketPriceResponse;
    defaultMovieId?: number;
    defaultTheaterId?: number;
    lockMovieAndTheater?: boolean;
    onSuccess?: () => void;
}) {
    const navigate = useNavigate();
    const createMutation = useCreateTheaterMovieTicketPrice();
    const updateMutation = useUpdateTheaterMovieTicketPrice();

    const { data: theaters } = useQuery({
        queryKey: ["theaters", "lookup"],
        queryFn: () =>
            fetchList<{ id: number; name: string }[]>(
                "/theaters?_page=1&_limit=500",
            ),
    });

    const { data: movies } = useQuery({
        queryKey: ["movies", "lookup"],
        queryFn: () =>
            fetchList<{ id: number; title: string }[]>(
                "/movies?_page=1&_limit=500",
            ),
    });

    const { data: formats } = useQuery({
        queryKey: ["cinema-formats", "lookup"],
        queryFn: () =>
            fetchList<{ id: number; label: string }[]>(
                "/cinema-formats?_page=1&_limit=500",
            ),
    });

    const { data: cinemas } = useQuery({
        queryKey: ["cinemas", "lookup"],
        queryFn: () =>
            fetchList<{ id: number; name: string }[]>(
                "/cinemas?_page=1&_limit=500",
            ),
    });

    const form = useForm<CreateTheaterMovieTicketPriceValues>({
        resolver: zodResolver(createTheaterMovieTicketPriceSchema),
        defaultValues: {
            theaterId: initialData?.theaterId || defaultTheaterId || 0,
            movieId: initialData?.movieId || defaultMovieId || 0,
            cinemaFormatId: initialData?.cinemaFormatId || undefined,
            cinemaId: initialData?.cinemaId || undefined,
            basePrice: initialData ? Number(initialData.basePrice) : 0,
            validFrom: initialData?.validFrom || "",
            validUntil: initialData?.validUntil || "",
        },
    });

    const onSubmit = async (data: CreateTheaterMovieTicketPriceValues) => {
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
            to: "/theater-movie-ticket-prices",
            search: { page: 1, limit: 10 },
        });
    };

    const isPending = createMutation.isPending || updateMutation.isPending;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                    disabled={
                                        lockMovieAndTheater && !initialData
                                    }
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select theater" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {(theaters?.data || []).map((item) => (
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

                    <FormField
                        control={form.control}
                        name="movieId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Movie</FormLabel>
                                <Select
                                    value={
                                        field.value
                                            ? String(field.value)
                                            : undefined
                                    }
                                    onValueChange={(value) =>
                                        field.onChange(Number(value))
                                    }
                                    disabled={
                                        lockMovieAndTheater && !initialData
                                    }
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select movie" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {(movies?.data || []).map((item) => (
                                            <SelectItem
                                                key={item.id}
                                                value={String(item.id)}
                                            >
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="cinemaFormatId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cinema Format (Optional)</FormLabel>
                                <Select
                                    value={
                                        field.value
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
                                            <SelectValue placeholder="Any format" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="none">
                                            Any format
                                        </SelectItem>
                                        {(formats?.data || []).map((item) => (
                                            <SelectItem
                                                key={item.id}
                                                value={String(item.id)}
                                            >
                                                {item.label}
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
                        name="cinemaId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cinema (Optional)</FormLabel>
                                <Select
                                    value={
                                        field.value
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
                                            <SelectValue placeholder="Any cinema" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="none">
                                            Any cinema
                                        </SelectItem>
                                        {(cinemas?.data || []).map((item) => (
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
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <FormField
                        control={form.control}
                        name="basePrice"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Base Price</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        value={field.value}
                                        onChange={(event) =>
                                            field.onChange(
                                                Number(event.target.value),
                                            )
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
                              : "Create Price"}
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
                                        to: "/theater-movie-ticket-prices",
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
