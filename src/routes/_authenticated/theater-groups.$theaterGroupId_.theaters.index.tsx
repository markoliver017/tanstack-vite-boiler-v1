import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import Swal from "sweetalert2";
import { ArrowRight, Plus } from "lucide-react";
import { NavHeader } from "@/components/layouts/NavHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/shadcn-ui/button";
import PageErrorComponent from "@/components/shared/PageErrorComponent";
import LoadingComponent from "@/components/shared/LoadingComponent";
import { theaterSearchSchema, type TheaterResponse } from "@/features/theaters/zTheatersSchema";
import { theatersListOptions } from "@/features/theaters/use-theaters";
import { theatersColumns } from "@/features/theaters/theaters-columns";
import { useDeleteTheater, useUpdateTheater } from "@/features/theaters/mutations";
import { theaterGroupByIdOptions } from "@/features/theater-groups/use-theater-groups";

export const Route = createFileRoute(
    "/_authenticated/theater-groups/$theaterGroupId_/theaters/",
)({
    validateSearch: (search) => theaterSearchSchema.parse(search),
    staticData: {
        title: "Theaters",
        breadcrumb: "Theaters",
    },
    errorComponent: ({ error }) => <PageErrorComponent error={error} />,
    pendingComponent: () => <LoadingComponent />,
    component: TheaterGroupTheatersPage,
});

function TheaterGroupTheatersPage() {
    const { theaterGroupId } = Route.useParams();
    const theaterGroupIdNumber = Number(theaterGroupId);
    const search = Route.useSearch();

    const { data: theaterGroup } = useQuery(
        theaterGroupByIdOptions(theaterGroupIdNumber),
    );

    const { data: loaderData, isFetching } = useQuery({
        ...theatersListOptions(
            search.page || 1,
            search.limit || 10,
            search.q,
            theaterGroupIdNumber,
        ),
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
                return;
            }

            updateMutation.mutate(
                { id, data: { isActive: true } },
                {
                    onSuccess: () => {
                        Swal.fire("Success", "Theater activated successfully", "success");
                    },
                    onError: (err) => {
                        Swal.fire("Error", err.message, "error");
                    },
                },
            );
        }
    };

    const columns: ColumnDef<TheaterResponse>[] = [
        ...theatersColumns(handleDelete),
        {
            id: "cinemas",
            header: "Cinemas",
            cell: ({ row }) => (
                <Button variant="outline" size="sm" asChild>
                    <Link
                        to="/theater-groups/$theaterGroupId/theaters/$theaterId/cinemas"
                        params={{
                            theaterGroupId,
                            theaterId: String(row.original.id),
                        }}
                    >
                        Manage
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            ),
        },
    ];

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
                title={`Theaters · ${theaterGroup?.name || "Theater Group"}`}
                description="Manage theaters under this theater group"
            />
            <DataTable
                columns={columns}
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
                        <Link
                            to="/theaters/create"
                            search={{ theaterGroupId: theaterGroupIdNumber }}
                        >
                            <Plus className="mr-2 h-4 w-4" /> New Theater
                        </Link>
                    </Button>
                }
            />
        </div>
    );
}
