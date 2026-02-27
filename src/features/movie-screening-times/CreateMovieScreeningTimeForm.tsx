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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import {
    createMovieScreeningTimeSchema,
    type CreateMovieScreeningTimeValues,
} from "./zMovieScreeningTimeSchema";
import { useCreateMovieScreeningTime } from "./mutations";

interface CreateMovieScreeningTimeFormProps {
    assignmentId: number;
    disabled?: boolean;
}

export function CreateMovieScreeningTimeForm({
    assignmentId,
    disabled = false,
}: CreateMovieScreeningTimeFormProps) {
    const createScreening = useCreateMovieScreeningTime();

    const form = useForm<CreateMovieScreeningTimeValues>({
        resolver: zodResolver(createMovieScreeningTimeSchema),
        defaultValues: {
            assignmentId,
            time: "",
            dateStart: "",
            dateEnd: "",
            isActive: true,
        },
    });

    const onSubmit = (values: CreateMovieScreeningTimeValues) => {
        Swal.fire({
            title: "Add Screening Time?",
            text: `Confirm adding screening time ${values.time} starting ${values.dateStart}?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes, add it",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // Send undefined if dateEnd is an empty string to match schema/db expectation
                    const payload = { ...values };
                    if (!payload.dateEnd) {
                        delete payload.dateEnd;
                    }

                    await createScreening.mutateAsync(payload);
                    form.reset({
                        assignmentId,
                        time: "",
                        dateStart: "",
                        dateEnd: "",
                        isActive: true,
                    });
                } catch {
                    // Mutation handles error toasts
                }
            }
        });
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end"
            >
                <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Time</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="time"
                                    disabled={
                                        disabled || createScreening.isPending
                                    }
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="dateStart"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Date Start</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="date"
                                    disabled={
                                        disabled || createScreening.isPending
                                    }
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="dateEnd"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Date End (Optional)</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="date"
                                    disabled={
                                        disabled || createScreening.isPending
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
                    disabled={disabled || createScreening.isPending}
                    className="w-full"
                >
                    {createScreening.isPending ? "Adding..." : "Add Time"}
                </Button>
            </form>
        </Form>
    );
}
