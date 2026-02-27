import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useUpdateMovie } from "./mutations";
import {
    createMovieSchema,
    type CreateMovieValues,
    type MovieResponse,
} from "./zMovieSchema";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/shadcn-ui/form";
import { Input } from "@/components/shadcn-ui/input";
import { Button } from "@/components/shadcn-ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/shadcn-ui/select";
import { fetchList } from "@/lib/api.client";

export function EditMovieForm({ movie }: { movie: MovieResponse }) {
    const updateMovie = useUpdateMovie();

    const { data: productionCompanies } = useQuery({
        queryKey: ["production-companies", "lookup"],
        queryFn: () =>
            fetchList<{ id: number; name: string }[]>(
                `/production-companies?_page=1&_limit=200`,
            ),
    });

    const { data: agencies } = useQuery({
        queryKey: ["agencies", "lookup"],
        queryFn: () =>
            fetchList<{ id: number; name: string }[]>(
                `/agencies?_page=1&_limit=200`,
            ),
    });

    const form = useForm<CreateMovieValues>({
        resolver: zodResolver(createMovieSchema),
        defaultValues: {
            title: movie.title,
            productionCompanyId: movie.productionCompanyId,
            agencyId: movie.agencyId,
            distributor: movie.distributor || "",
            startDate: movie.startDate,
            endDate: movie.endDate || "",
        },
    });

    const onSubmit = async (data: CreateMovieValues) => {
        await updateMovie.mutateAsync({ id: movie.id, data });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="Movie title" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="productionCompanyId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Production Company</FormLabel>
                                <Select
                                    value={String(field.value)}
                                    onValueChange={(value) => field.onChange(Number(value))}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select production company" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {(productionCompanies?.data || []).map((company) => (
                                            <SelectItem key={company.id} value={String(company.id)}>
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
                        name="agencyId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Agency</FormLabel>
                                <Select
                                    value={String(field.value)}
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
                    name="distributor"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Distributor</FormLabel>
                            <FormControl>
                                <Input placeholder="Optional" {...field} value={field.value || ""} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Start Date</FormLabel>
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

                <Button type="submit" variant="success" disabled={updateMovie.isPending}>
                    {updateMovie.isPending ? "Saving..." : "Save Changes"}
                </Button>
            </form>
        </Form>
    );
}
