import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/shadcn-ui/form";
import { Button } from "@/components/shadcn-ui/button";
import { Input } from "@/components/shadcn-ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/shadcn-ui/select";
import { fetchList } from "@/lib/api.client";
import { useCreateMovieFormatMap } from "./mutations";
import {
    movieFormatMapSchema,
    type MovieFormatMapValues,
} from "./zMovieFormatMapSchema";

export function AssignFormatToMovieForm({ movieId }: { movieId: number }) {
    const createMap = useCreateMovieFormatMap();

    const { data: formats } = useQuery({
        queryKey: ["cinema-formats", "lookup"],
        queryFn: () =>
            fetchList<{ id: number; code: string; label: string }[]>(
                `/cinema-formats?_page=1&_limit=200`,
            ),
    });

    const form = useForm<MovieFormatMapValues>({
        resolver: zodResolver(movieFormatMapSchema),
        defaultValues: {
            movieId,
            cinemaFormatId: undefined,
            priceAdjustment: undefined,
        },
    });

    const onSubmit = async (data: MovieFormatMapValues) => {
        await createMap.mutateAsync({ ...data, movieId });
        form.reset({
            movieId,
            cinemaFormatId: undefined,
            priceAdjustment: undefined,
        });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="cinemaFormatId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Format</FormLabel>
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
                                        <SelectValue placeholder="Select format" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {(formats?.data || []).map((format) => (
                                        <SelectItem
                                            key={format.id}
                                            value={String(format.id)}
                                        >
                                            {format.code} - {format.label}
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
                    name="priceAdjustment"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Price Adjustment</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="e.g. 50"
                                    value={field.value ?? ""}
                                    onChange={(e) =>
                                        field.onChange(
                                            e.target.value === ""
                                                ? undefined
                                                : Number(e.target.value),
                                        )
                                    }
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button
                    type="submit"
                    variant="success"
                    disabled={createMap.isPending}
                >
                    {createMap.isPending ? "Assigning..." : "Assign Format"}
                </Button>
            </form>
        </Form>
    );
}
