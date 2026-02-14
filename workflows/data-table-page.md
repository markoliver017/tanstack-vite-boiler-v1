---
description: Guide for building list/table pages with DataTable, server-side pagination, sorting, and search
---

This workflow defines the standard for building data table pages.

> **PREREQUISITE**: Read `workflows/component-registry.md` first.

# File Structure

```
src/features/[feature]/
├── z[Feature]Schema.ts          # Response type for the list item
├── use-[feature].ts             # queryOptions for fetching lists
├── [feature]-columns.tsx        # Column definitions
└── mutations.ts                 # Delete/update mutations (if needed)

src/routes/_authenticated/
└── [feature].tsx                # Route file with DataTable page
```

---

# 1. Define the Response Type

**File**: `src/features/[feature]/z[Feature]Schema.ts`

```typescript
import { z } from "zod";

export const [feature]ResponseSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    createdAt: z.string(),
});

export type [Feature]Response = z.infer<typeof [feature]ResponseSchema>;
```

---

# 2. Create Query Options

**File**: `src/features/[feature]/use-[feature].ts`

```typescript
import { queryOptions } from "@tanstack/react-query";
import { fetchList } from "@/lib/api.client";
import type { [Feature]Response } from "./z[Feature]Schema";

// List with pagination
export const [feature]ListOptions = (page: number, pageSize: number, search?: string) =>
    queryOptions({
        queryKey: ["[feature]", { page, pageSize, search }],
        queryFn: () => {
            const params = new URLSearchParams({
                _page: String(page),
                _limit: String(pageSize),
                ...(search ? { q: search } : {}),
            });
            return fetchList<[Feature]Response[]>(`/[feature]?${params}`);
        },
    });

// Single item
export const [feature]ByIdOptions = (id: string) =>
    queryOptions({
        queryKey: ["[feature]", id],
        queryFn: () => apiRequest<[Feature]Response>(`/[feature]/${id}`),
    });
```

**Rules**:

- Use `fetchList` for paginated endpoints (returns `{ data, total }`)
- Use `apiRequest` for single-item fetches
- Include all filter/pagination params in `queryKey` for proper caching

---

# 3. Define Table Columns

**File**: `src/features/[feature]/[feature]-columns.tsx`

```tsx
import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/shared/DataTableColumnHeader";
import { Badge } from "@/components/shadcn-ui/badge";
import { Button } from "@/components/shadcn-ui/button";
import { Link } from "@tanstack/react-router";
import type { [Feature]Response } from "./z[Feature]Schema";

export const [feature]Columns: ColumnDef<[Feature]Response>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    },
    {
        accessorKey: "email",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
            <Badge variant={row.original.status === "active" ? "default" : "secondary"}>
                {row.original.status}
            </Badge>
        ),
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
            <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                    <Link to={`/[feature]/${row.original.id}`}>View</Link>
                </Button>
            </div>
        ),
    },
];
```

**Rules**:

- Use `DataTableColumnHeader` for sortable columns — do NOT build custom sort headers
- Use `Badge` for status columns
- Use `Button` with `asChild` + `Link` for navigation actions

---

# 4. Build the Route Page

**File**: `src/routes/_authenticated/[feature].tsx`

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { NavHeader } from "@/components/layouts/NavHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/shadcn-ui/button";
import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import PageErrorComponent from "@/components/shared/PageErrorComponent";
import LoadingComponent from "@/components/shared/LoadingComponent";
import { [feature]ListOptions } from "@/features/[feature]/use-[feature]";
import { [feature]Columns } from "@/features/[feature]/[feature]-columns";

export const Route = createFileRoute("/_authenticated/[feature]")({
    staticData: {
        title: "[Feature]",
        breadcrumb: "List of [Feature]",
    },
    errorComponent: ({ error }) => <PageErrorComponent error={error} />,
    pendingComponent: () => <LoadingComponent />,
    component: [Feature]Page,
});

function [Feature]Page() {
    const [search, setSearch] = useState("");
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

    const { data, isLoading } = useQuery(
        [feature]ListOptions(pagination.pageIndex + 1, pagination.pageSize, search)
    );

    return (
        <div>
            <NavHeader
                title="[Feature]"
                description="Manage your [feature] records"
            />
            <DataTable
                columns={[feature]Columns}
                data={data?.data ?? []}
                searchValue={search}
                onSearchChange={setSearch}
                searchPlaceholder="Search [feature]..."
                pageCount={Math.ceil((data?.total ?? 0) / pagination.pageSize)}
                pagination={pagination}
                onPaginationChange={setPagination}
                manualPagination
                sideComponent={
                    <Button variant="success" asChild>
                        <Link to="/[feature]/create">
                            <Plus className="mr-2 h-4 w-4" /> New [Feature]
                        </Link>
                    </Button>
                }
            />
        </div>
    );
}
```

**Rules**:

- Always use `NavHeader` for the page header — do NOT create ad-hoc `<h1>` headers
- Always use `DataTable` with the shared components — do NOT build custom tables
- Set `errorComponent` and `pendingComponent` using the shared components
- Set `staticData.breadcrumb` for automatic breadcrumb generation
- Use `sideComponent` prop for action buttons (e.g., "New" button)

---

# Checklist

- [ ] Response type defined in `z[Feature]Schema.ts`?
- [ ] Query options use `fetchList` for lists, `apiRequest` for single items?
- [ ] Columns use `DataTableColumnHeader` for sortable columns?
- [ ] Page uses `NavHeader` for the header?
- [ ] Page uses `DataTable` with all pagination props?
- [ ] Route has `staticData.breadcrumb`?
- [ ] Route has `errorComponent` using `PageErrorComponent`?
- [ ] Route has `pendingComponent` using `LoadingComponent`?
- [ ] No custom table HTML — uses DataTable exclusively?
