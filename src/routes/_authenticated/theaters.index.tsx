import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { NavHeader } from "@/components/layouts/NavHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/shadcn-ui/button";
import { Plus } from "lucide-react";
import PageErrorComponent from "@/components/shared/PageErrorComponent";
import LoadingComponent from "@/components/shared/LoadingComponent";
import { theatersListOptions } from "@/features/theaters/use-theaters";
import { theatersColumns } from "@/features/theaters/theaters-columns";
import { theaterSearchSchema } from "@/features/theaters/zTheatersSchema";
import Swal from "sweetalert2";
import {
    useDeleteTheater,
    useUpdateTheater,
} from "@/features/theaters/mutations";

export const Route = createFileRoute("/_authenticated/theaters/")({
    validateSearch: (search) => theaterSearchSchema.parse(search),
    staticData: {
        title: "Theaters",
        breadcrumb: "List of Theaters",
    },
    errorComponent: ({ error }) => <PageErrorComponent error={error} />,
    pendingComponent: () => <LoadingComponent />,
    component: TheatersPage,
});

function TheatersPage() {
    const search = Route.useSearch();
    const { data: loaderData, isFetching } = useQuery({
        ...theatersListOptions(search.page || 1, search.limit || 10, search.q),
        placeholderData: keepPreviousData,
    });

    const items = loaderData?.data || [];
    const totalCount = loaderData?.total || 0;

    const navigate = useNavigate({ from: Route.fullPath });
    const page = search.page || 1;
    const limit = search.limit || 10;
    const { q } = search;

    const pageCount = Math.ceil(totalCount / limit);

    const deleteMutation = useDeleteTheater();
    const updateMutation = useUpdateTheater();

    const handleSearch = (value: string) => {
        navigate({
            search: (prev) => ({
                ...prev,
                q: value || undefined,
                page: 1,
            }),
        });
    };

    const handleDelete = async (id: string, isActive: boolean) => {
        const action = isActive ? "deactivate" : "activate";
        const result = await Swal.fire({
            title: `Confirm ${action}?`,
            text: `Are you sure you want to ${action} this theater?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: isActive ? "#d33" : "#10b981",
            confirmButtonText: `Yes, ${action} it!`,
        });

        if (result.isConfirmed) {
            // If deactivating, use delete mutation (soft delete)
            // If activating, use update mutation
            if (isActive) {
                deleteMutation.mutate(id, {
                    onSuccess: () => {
                        Swal.fire(
                            "Success",
                            "Theater deactivated successfully",
                            "success",
                        );
                    },
                    onError: (err) => {
                        Swal.fire("Error", err.message, "error");
                    },
                });
            } else {
                updateMutation.mutate(
                    { id, data: { isActive: true } },
                    {
                        onSuccess: () => {
                            Swal.fire(
                                "Success",
                                "Theater activated successfully",
                                "success",
                            );
                        },
                        onError: (err) => {
                            Swal.fire("Error", err.message, "error");
                        },
                    },
                );
            }
        }
    };

    if (!loaderData && isFetching) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin h-8 w-8 border-4 border-gray-300 border-t-blue-600 rounded-full" />
            </div>
        );
    }

    return (
        <div>
            <NavHeader
                title="Theaters"
                description="Manage your theater locations"
            />
            <DataTable
                columns={theatersColumns(handleDelete)}
                data={items}
                searchValue={q}
                onSearchChange={handleSearch}
                searchPlaceholder="Search theaters..."
                isLoading={isFetching}
                manualPagination={true}
                pageCount={pageCount}
                pagination={{
                    pageIndex: page - 1,
                    pageSize: limit,
                }}
                onPaginationChange={(updater) => {
                    const nextState =
                        typeof updater === "function"
                            ? updater({
                                  pageIndex: page - 1,
                                  pageSize: limit,
                              })
                            : updater;

                    navigate({
                        search: (prev) => ({
                            ...prev,
                            page: nextState.pageIndex + 1,
                            limit: nextState.pageSize,
                        }),
                    });
                }}
                sideComponent={
                    <Button variant="success" asChild>
                        <Link to="/theaters/create">
                            <Plus className="mr-2 h-4 w-4" /> New Theater
                        </Link>
                    </Button>
                }
            />
        </div>
    );
}
