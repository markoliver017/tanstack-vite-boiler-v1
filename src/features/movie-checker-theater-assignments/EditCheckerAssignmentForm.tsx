import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";

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
import { Textarea } from "@/components/shadcn-ui/textarea";
import { fetchList } from "@/lib/api.client";
import { useUpdateCheckerAssignment } from "./mutations";
import {
    createCheckerAssignmentSchema,
    type CheckerAssignmentResponse,
    type CreateCheckerAssignmentValues,
} from "./zCheckerAssignmentSchema";

interface EditCheckerAssignmentFormProps {
    assignment: CheckerAssignmentResponse;
    onSuccess?: () => void;
    compact?: boolean;
}

export function EditCheckerAssignmentForm({
    assignment,
    onSuccess,
    compact = false,
}: EditCheckerAssignmentFormProps) {
    const updateMutation = useUpdateCheckerAssignment();

    const { data: movies } = useQuery({
        queryKey: ["movies", "lookup"],
        queryFn: () =>
            fetchList<{ id: number; title: string }[]>(
                `/movies?_page=1&_limit=300`,
            ),
    });

    const { data: theaters } = useQuery({
        queryKey: ["theaters", "lookup"],
        queryFn: () =>
            fetchList<{ id: number; name: string }[]>(
                `/theaters?_page=1&_limit=300`,
            ),
    });

    const { data: cinemas } = useQuery({
        queryKey: ["cinemas", "lookup"],
        queryFn: () =>
            fetchList<{ id: number; name: string; theaterId: number }[]>(
                `/cinemas?_page=1&_limit=500`,
            ),
    });

    const { data: formats } = useQuery({
        queryKey: ["cinema-formats", "lookup"],
        queryFn: () =>
            fetchList<{ id: number; label: string }[]>(
                `/cinema-formats?_page=1&_limit=500`,
            ),
    });

    const form = useForm<CreateCheckerAssignmentValues>({
        resolver: zodResolver(createCheckerAssignmentSchema),
        defaultValues: {
            checkerId: assignment.checkerId,
            movieId: assignment.movieId,
            theaterId: assignment.theaterId,
            slotNo: assignment.slotNo,
            cinemaId: assignment.cinemaId ?? undefined,
            cinemaFormatId: assignment.cinemaFormatId ?? undefined,
            remarks: assignment.remarks ?? "",
        },
    });

    const selectedTheaterId = useWatch({
        control: form.control,
        name: "theaterId",
    });
    const filteredCinemas = (cinemas?.data || []).filter(
        (cinema) => cinema.theaterId === selectedTheaterId,
    );

    useEffect(() => {
        if (selectedTheaterId && selectedTheaterId !== assignment.theaterId) {
            form.setValue("cinemaId", undefined);
            form.setValue("cinemaFormatId", undefined);
        }
    }, [selectedTheaterId, form, assignment.theaterId]);

    const onSubmit = async (data: CreateCheckerAssignmentValues) => {
        await updateMutation.mutateAsync({ id: assignment.id, data });
        if (onSuccess) {
            onSuccess();
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {!compact && (
                    <>
                        <FormField
                            control={form.control}
                            name="movieId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Movie</FormLabel>
                                    <Select
                                        value={
                                            field.value ? String(field.value) : undefined
                                        }
                                        onValueChange={(value) =>
                                            field.onChange(Number(value))
                                        }
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select movie" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {(movies?.data || []).map((movie) => (
                                                <SelectItem
                                                    key={movie.id}
                                                    value={String(movie.id)}
                                                >
                                                    {movie.title}
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
                            name="theaterId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Theater</FormLabel>
                                    <Select
                                        value={
                                            field.value ? String(field.value) : undefined
                                        }
                                        onValueChange={(value) =>
                                            field.onChange(Number(value))
                                        }
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
                    </>
                )}

                <FormField
                    control={form.control}
                    name="slotNo"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Slot No</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    min={1}
                                    value={field.value ?? ""}
                                    onChange={(event) =>
                                        field.onChange(
                                            event.target.value
                                                ? Number(event.target.value)
                                                : undefined,
                                        )
                                    }
                                />
                            </FormControl>
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
                                value={field.value ? String(field.value) : "all"}
                                onValueChange={(value) =>
                                    field.onChange(
                                        value === "all" ? undefined : Number(value),
                                    )
                                }
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Unset (planning stage)" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="all">Unset (planning stage)</SelectItem>
                                    {filteredCinemas.map((cinema) => (
                                        <SelectItem
                                            key={cinema.id}
                                            value={String(cinema.id)}
                                        >
                                            {cinema.name}
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
                    name="cinemaFormatId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Cinema Format (Optional)</FormLabel>
                            <Select
                                value={field.value ? String(field.value) : "none"}
                                onValueChange={(value) =>
                                    field.onChange(
                                        value === "none" ? undefined : Number(value),
                                    )
                                }
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Unset (planning stage)" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="none">
                                        Unset (planning stage)
                                    </SelectItem>
                                    {(formats?.data || []).map((format) => (
                                        <SelectItem key={format.id} value={String(format.id)}>
                                            {format.label}
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
                    name="remarks"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Remarks (Optional)</FormLabel>
                            <FormControl>
                                <Textarea {...field} value={field.value ?? ""} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button
                    type="submit"
                    variant="success"
                    disabled={updateMutation.isPending}
                >
                    {updateMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
            </form>
        </Form>
    );
}
