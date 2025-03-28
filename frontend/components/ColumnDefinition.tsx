"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Interface for dynamic column definition
export interface DynamicColumn {
    id: string;
    name: string;
    dataType: string; // Changed from "TEXT" | "DATE" to string to match MongoDB
    position: number;
    isDynamic: boolean;
}

// This is a dynamic column creator
export function createColumns(
    headers: string[],
    dynamicColumns: DynamicColumn[] = [],
    updateDynamicColumnValue: (
        rowIndex: number,
        columnId: string,
        value: any
    ) => void
): ColumnDef<Record<string, any>>[] {
    console.log("Creating columns with headers:", headers);
    console.log("Dynamic columns:", dynamicColumns);

    // Create regular columns from Google Sheet headers
    const regularColumns = headers.map((header) => ({
        accessorKey: header,
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
                className="whitespace-nowrap"
            >
                {header}
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const value = row.getValue(header);
            return <div>{String(value || "")}</div>;
        },
    }));

    // Create columns for dynamic columns
    const customColumns = dynamicColumns.map((column) => ({
        accessorKey: column.name,
        header: ({ column: tableColumn }) => (
            <div className="flex items-center">
                <Button
                    variant="ghost"
                    onClick={() =>
                        tableColumn.toggleSorting(
                            tableColumn.getIsSorted() === "asc"
                        )
                    }
                    className="whitespace-nowrap font-medium text-blue-600"
                >
                    {column.name}
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            </div>
        ),
        cell: ({ row }) => {
            // FIX: Directly use the row index without string manipulation
            const rowIndex = parseInt(row.id);
            const value = row.getValue(column.name) || "";

            if (column.dataType === "DATE") {
                return (
                    <DatePicker
                        value={value ? new Date(value) : undefined}
                        onChange={(date) =>
                            updateDynamicColumnValue(rowIndex, column.id, date)
                        }
                    />
                );
            } else {
                return (
                    <Input
                        value={value}
                        onChange={(e) =>
                            updateDynamicColumnValue(
                                rowIndex,
                                column.id,
                                e.target.value
                            )
                        }
                        className="h-8"
                    />
                );
            }
        },
    }));

    console.log("Regular columns:", regularColumns.length);
    console.log("Custom columns:", customColumns.length);

    return [...regularColumns, ...customColumns];
}

// Actions column
export const actionsColumn: ColumnDef<Record<string, any>> = {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
        const rowData = row.original;

        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem
                        onClick={() =>
                            navigator.clipboard.writeText(
                                JSON.stringify(rowData)
                            )
                        }
                    >
                        Copy row data
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>View details</DropdownMenuItem>
                    <DropdownMenuItem>Export data</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    },
};
