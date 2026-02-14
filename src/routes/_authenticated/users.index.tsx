import { NavHeader } from "@/components/layouts/NavHeader";
import { Button } from "@/components/shadcn-ui/button";
import { DataTable } from "@/components/shared/DataTable";
import LoadingComponent from "@/components/shared/LoadingComponent";
import PageErrorComponent from "@/components/shared/PageErrorComponent";
import {
    useBanUser,
    useDeleteUser,
    useSetUserRole,
    useUnbanUser,
    useVerifyUserEmail,
} from "@/features/users/mutations";
import { userListOptions } from "@/features/users/use-users";
import { userColumns } from "@/features/users/users-columns";
import { userSearchSchema } from "@/features/users/zUsersSchema";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";

export const Route = createFileRoute("/_authenticated/users/")({
    validateSearch: (search) => userSearchSchema.parse(search),
    loaderDeps: ({ search }) => ({ ...search }),
    loader: ({ context: { queryClient }, deps }) => {
        return queryClient.ensureQueryData(userListOptions(deps));
    },
    staticData: {
        title: "Users Management",
        breadcrumb: "List of Users",
    },
    errorComponent: ({ error }) => <PageErrorComponent error={error} />,
    pendingComponent: () => <LoadingComponent />,
    component: UsersPage,
});

function UsersPage() {
    const search = Route.useSearch();
    const { data: loaderData } = useSuspenseQuery(userListOptions(search));

    const deleteMutation = useDeleteUser();
    const banMutation = useBanUser();
    const unbanMutation = useUnbanUser();
    const setRoleMutation = useSetUserRole();
    const verifyUserEmailMutation = useVerifyUserEmail();

    const users = Array.isArray(loaderData)
        ? loaderData
        : loaderData?.data || [];
    const totalCount = Array.isArray(loaderData) ? 0 : loaderData?.total || 0;

    const navigate = useNavigate({ from: Route.fullPath });
    const page = search.page || 1;
    const limit = search.limit || 10;
    const { q } = search;

    const pageCount = Math.ceil(totalCount / limit);

    const handleSearch = (value: string) => {
        navigate({
            search: (prev) => ({
                ...prev,
                q: value || undefined,
                page: 1,
            }),
        });
    };

    return (
        <>
            <NavHeader
                title="Users Management"
                description="Manage user accounts, roles, and access."
            />
            <div className="md:p-2">
                <DataTable
                    columns={userColumns(
                        deleteMutation,
                        banMutation,
                        unbanMutation,
                        setRoleMutation,
                        verifyUserEmailMutation,
                    )}
                    data={users}
                    searchValue={q}
                    onSearchChange={handleSearch}
                    searchPlaceholder="Search users..."
                    sideComponent={
                        <Button variant="success" asChild>
                            <Link
                                to="/users/create"
                                search={{ page: 1, limit: 10 }}
                            >
                                <PlusIcon /> New User
                            </Link>
                        </Button>
                    }
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
                />
            </div>
        </>
    );
}
