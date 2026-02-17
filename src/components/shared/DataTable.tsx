import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    type SortingState,
    flexRender,
    type ColumnDef,
    type PaginationState,
    type OnChangeFn,
    getPaginationRowModel,
} from "@tanstack/react-table";
import { useState } from "react";
import { DataTablePagination } from "./DataTablePagination";

interface DataTableProps<TData> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    columns: ColumnDef<TData, any>[];
    data: TData[];
    searchValue?: string;
    onSearchChange?: (value: string) => void;
    searchPlaceholder?: string;
    sideComponent?: React.ReactNode;
    pageCount?: number;
    pagination?: PaginationState;
    onPaginationChange?: OnChangeFn<PaginationState>;
    manualPagination?: boolean;
    isLoading?: boolean;
}

export function DataTable<TData>({
    columns,
    data,
    searchValue,
    onSearchChange,
    searchPlaceholder = "Search...",
    sideComponent,
    pageCount,
    pagination,
    onPaginationChange,
    manualPagination,
    isLoading = false,
}: DataTableProps<TData>) {
    // 2. Initialize the table
    const [sorting, setSorting] = useState<SortingState>([]);

    // eslint-disable-next-line react-hooks/incompatible-library
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        pageCount,
        manualPagination,
        onPaginationChange: onPaginationChange,
        state: {
            sorting,
            pagination: pagination ?? undefined,
        },
    });

    return (
        <div className="p-4 overflow-x-auto">
            <div className="flex justify-between">
                {onSearchChange && (
                    <div className="relative w-full max-w-sm">
                        <input
                            value={searchValue ?? ""}
                            onChange={(e) => onSearchChange(e.target.value)}
                            placeholder={searchPlaceholder}
                            className="p-2 border rounded mb-4 w-full"
                        />
                        {isLoading && (
                            <div className="absolute right-2 top-2">
                                <div className="animate-spin h-5 w-5 border-2 border-gray-300 border-t-blue-600 rounded-full" />
                            </div>
                        )}
                    </div>
                )}
                {sideComponent}
            </div>
            <table className="min-w-full border-collapse border border-gray-200">
                <thead className="bg-gray-100">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th
                                    key={header.id}
                                    className="p-2 text-left border border-gray-200"
                                >
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext(),
                                    )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.id} className="hover:bg-gray-50">
                            {row.getVisibleCells().map((cell) => (
                                <td
                                    key={cell.id}
                                    className="p-2 border border-gray-200"
                                >
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext(),
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="py-2">
                <DataTablePagination table={table} />
            </div>
        </div>
    );
}
