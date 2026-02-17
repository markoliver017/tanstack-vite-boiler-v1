import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { NavHeader } from "@/components/layouts/NavHeader";
import BackButton from "@/components/shared/BackButton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    createCinemaSchema,
    type CreateCinemaValues,
} from "@/features/cinemas/zCinemaSchema";
import { useUpdateCinema } from "@/features/cinemas/mutations";
import { cinemaByIdOptions } from "@/features/cinemas/use-cinemas";
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
import { useQuery } from "@tanstack/react-query";
import { fetchList } from "@/lib/api.client";
import { Loader2 } from "lucide-react";
import { Checkbox } from "@/components/shadcn-ui/checkbox";
import LoadingComponent from "@/components/shared/LoadingComponent";
import PageErrorComponent from "@/components/shared/PageErrorComponent";
import { CinemaFormattedList } from "@/features/cinema-format-map/CinemaFormattedList";

export const Route = createFileRoute("/_authenticated/cinemas/$cinemaId")({
    loader: async ({ context, params }) => {
        const cinema = await context.queryClient.ensureQueryData(
            cinemaByIdOptions(parseInt(params.cinemaId)),
        );
        return {
            cinema,
            breadcrumb: cinema.name,
        };
    },
    errorComponent: ({ error }) => <PageErrorComponent error={error} />,
    pendingComponent: () => <LoadingComponent />,
    component: EditCinemaPage,
});

function EditCinemaPage() {
    const { cinema } = Route.useLoaderData();
    const navigate = useNavigate();
    const updateCinema = useUpdateCinema();

    // Fetch theaters for dropdown
    const { data: theatersData } = useQuery({
        queryKey: ["theaters", "all"],
        queryFn: () => fetchList("/theaters?_limit=1000"),
    });

    const form = useForm<CreateCinemaValues>({
        resolver: zodResolver(createCinemaSchema) as any,
        defaultValues: {
            theaterId: cinema.theaterId,
            name: cinema.name,
            geofenceRadius: cinema.geofenceRadius,
            isActive: cinema.isActive,
        } as any,
    });

    const onSubmit = async (data: CreateCinemaValues) => {
        await updateCinema.mutateAsync({ id: cinema.id, data });
        navigate({ to: "/cinemas", search: { page: 1, limit: 10 } });
    };

    const theaters =
        (theatersData?.data as Array<{ id: number; name: string }>) || [];

    return (
        <div className="p-6 space-y-6">
            <BackButton />
            <div className="flex justify-between items-center">
                <NavHeader
                    title={`Edit Cinema: ${cinema.name}`}
                    description="Update cinema information"
                />
                <Button variant="outline" asChild>
                    <Link
                        to="/cinemas/$cinemaId/formats"
                        params={{ cinemaId: cinema.id.toString() }}
                    >
                        Manage Formats
                    </Link>
                </Button>
            </div>
            <div className="max-w-2xl">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <FormField
                            control={form.control as any}
                            name="theaterId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Theater</FormLabel>
                                    <Select
                                        onValueChange={(value) =>
                                            field.onChange(parseInt(value))
                                        }
                                        value={field.value?.toString()}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a theater" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {theaters.map(
                                                (theater: {
                                                    id: number;
                                                    name: string;
                                                }) => (
                                                    <SelectItem
                                                        key={theater.id}
                                                        value={theater.id.toString()}
                                                    >
                                                        {theater.name}
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
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Cinema Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter cinema name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control as any}
                            name="geofenceRadius"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Geofence Radius (meters)
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="100"
                                            {...field}
                                            onChange={(e) =>
                                                field.onChange(
                                                    parseInt(e.target.value) ||
                                                        0,
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
                                        <p className="text-sm text-muted-foreground">
                                            Cinema is active and available for
                                            operations
                                        </p>
                                    </div>
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate({ to: "/cinemas" })}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="default"
                                disabled={updateCinema.isPending}
                            >
                                {updateCinema.isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    "Update Cinema"
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>

            <div className="max-w-4xl border-t pt-6">
                <CinemaFormattedList cinemaId={cinema.id} />
            </div>
        </div>
    );
}
