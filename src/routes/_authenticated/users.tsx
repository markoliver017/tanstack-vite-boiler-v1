import { mockUsers } from "@/features/users/services";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/users")({
    staticData: {
        breadcrumb: "List of Users",
    },
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div className="p-8">
            <div className="flex justify-between mb-4">
                <h1 className="text-2xl font-bold">Users</h1>
                <Link
                    search={true}
                    to="/users/create"
                    className="bg-primary text-white p-2 rounded"
                >
                    + New User
                </Link>
            </div>
            <ul className="border rounded divide-y">
                {mockUsers.map((user) => (
                    <li key={user.id} className="p-4 flex justify-between">
                        <span>{user.name}</span>
                        <span className="text-muted-foreground">
                            {user.email}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
