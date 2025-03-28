"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Download } from "lucide-react";
import { DataTableViewOptions } from "./DataTableViewOptions";

interface DataTableToolbarProps<TData> {
    table: Table<TData>;
    searchKey?: string;
    searchPlaceholder?: string;
    onAddColumn?: () => void;
}

export function DataTableToolbar<TData>({
    table,
    searchKey,
    searchPlaceholder = "Filter...",
    onAddColumn,
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0;

    const exportToCSV = () => {
        const headers = table
            .getAllColumns()
            .filter((column) => column.getIsVisible())
            .map((column) => column.id)
            .filter((id) => id !== "actions");

        // Create CSV content
        const rows = table.getFilteredRowModel().rows;
        const content = [
            headers.join(","),
            ...rows.map((row) =>
                headers
                    .map((header) => {
                        const value = row.getValue(header);
                        // Handle commas and quotes in CSV
                        const formatted =
                            value !== null && value !== undefined
                                ? String(value).replace(/"/g, '""')
                                : "";
                        return `"${formatted}"`;
                    })
                    .join(",")
            ),
        ].join("\n");

        // Create and download file
        const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "sheet-data.csv");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                {searchKey && (
                    <Input
                        placeholder={searchPlaceholder}
                        value={
                            (table
                                .getColumn(searchKey)
                                ?.getFilterValue() as string) ?? ""
                        }
                        onChange={(event) =>
                            table
                                .getColumn(searchKey)
                                ?.setFilterValue(event.target.value)
                        }
                        className="h-8 w-[150px] lg:w-[250px]"
                    />
                )}
                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={() => table.resetColumnFilters()}
                        className="h-8 px-2 lg:px-3"
                    >
                        Reset
                        <Cross2Icon className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>
            <div className="flex items-center space-x-2">
                {onAddColumn && (
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-3"
                        onClick={onAddColumn}
                    >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Column
                    </Button>
                )}
                <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-3"
                    onClick={exportToCSV}
                >
                    <Download className="mr-2 h-4 w-4" />
                    Export
                </Button>
                <DataTableViewOptions table={table} />
            </div>
        </div>
    );
}
