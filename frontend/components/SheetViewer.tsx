"use client";
import React, { useEffect, useCallback, useState, useMemo } from "react";
import io, { Socket } from "socket.io-client";
import { useAuthContext } from "@/contexts/auth-context";
import { DataTable } from "./DataTable";
import {
    createColumns,
    actionsColumn,
    DynamicColumn,
} from "./ColumnDefinition";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { AddColumnDialog } from "./AddColumnDialog";
import apiClient from "@/lib/api-client";

interface SheetViewerProps {
    sheetId: string;
}

interface SheetData {
    title: string;
    sheetTitle: string;
    headers: string[];
    originalHeaders?: string[];
    rows: Record<string, any>[];
    dynamicColumns?: DynamicColumn[];
}

const SheetViewer: React.FC<SheetViewerProps> = ({ sheetId }) => {
    const [socket, setSocket] = useState<typeof Socket | null>(null);
    const [sheetData, setSheetData] = useState<SheetData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAddColumnOpen, setIsAddColumnOpen] = useState(false);
    const [dynamicData, setDynamicData] = useState<
        Record<number, Record<string, any>>
    >({});
    const { userId } = useAuthContext();

    // Load dynamic column data
    const loadDynamicData = useCallback(async () => {
        try {
            const response = await apiClient.get(
                `/api/dynamic-columns/${sheetId}/data`
            );
            if (response.data.success) {
                console.log("Loaded dynamic data:", response.data.data);
                setDynamicData(response.data.data || {});
            }
        } catch (error) {
            console.error("Failed to load dynamic column data:", error);
        }
    }, [sheetId]);

    // Update dynamic column value
    const updateDynamicColumnValue = useCallback(
        (rowIndex: number, columnId: string, value: any) => {
            console.log("Updating dynamic value:", {
                rowIndex,
                columnId,
                value,
            });

            setDynamicData((prev) => {
                const updatedData = { ...prev };
                if (!updatedData[rowIndex]) {
                    updatedData[rowIndex] = {};
                }
                updatedData[rowIndex][columnId] = value;

                // Save to backend
                apiClient
                    .post(`/api/dynamic-columns/${sheetId}/data`, {
                        rowData: { rowIndex, columnId, value },
                    })
                    .catch((error) => {
                        console.error(
                            "Failed to save dynamic column data:",
                            error
                        );
                    });

                return updatedData;
            });
        },
        [sheetId]
    );

    // Create columns based on headers and dynamic columns
    const columns = useMemo(() => {
        if (!sheetData?.headers?.length) return [];

        // Only use original headers if available to avoid duplicating dynamic columns
        const baseHeaders = sheetData.originalHeaders || sheetData.headers;
        console.log("Creating columns with base headers:", baseHeaders);
        console.log("Dynamic columns:", sheetData.dynamicColumns || []);

        // Create columns from headers
        const allColumns = createColumns(
            baseHeaders,
            sheetData.dynamicColumns || [],
            updateDynamicColumnValue
        );

        // Add actions column
        return [...allColumns, actionsColumn];
    }, [
        sheetData?.headers,
        sheetData?.originalHeaders,
        sheetData?.dynamicColumns,
        updateDynamicColumnValue,
    ]);

    // Combine Google Sheet data with dynamic column data
    const combinedData = useMemo(() => {
        if (!sheetData?.rows?.length) return [];

        return sheetData.rows.map((row, index) => {
            // Get dynamic data for this row
            const rowDynamicData = dynamicData[index] || {};

            // Create enhanced row with all data
            const enhancedRow = { ...row };

            // Add dynamic column data to row
            if (
                sheetData.dynamicColumns &&
                sheetData.dynamicColumns.length > 0
            ) {
                sheetData.dynamicColumns.forEach((col) => {
                    enhancedRow[col.name] = rowDynamicData[col.id] || "";
                });
            }

            return enhancedRow;
        });
    }, [sheetData?.rows, sheetData?.dynamicColumns, dynamicData]);

    // Handle when a new column is added
    const handleColumnAdded = () => {
        if (socket) {
            console.log("Column added, re-subscribing to get updated data");

            // Add a small delay to ensure database updates are complete
            setTimeout(() => {
                socket.emit("subscribe", {
                    sheetId,
                    userId,
                });
            }, 500);
        }
    };

    useEffect(() => {
        // Load dynamic data on mount
        console.log("Current user ID", userId);
        if (userId) {
            loadDynamicData();
        }

        // Initialize socket connection
        const socketInstance = io(
            process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000"
        );

        setSocket(socketInstance);

        // Handle connection events
        socketInstance.on("connect", () => {
            console.log("Connected to WebSocket server", sheetId, userId);

            // Subscribe to sheet updates
            socketInstance.emit("subscribe", {
                sheetId,
                userId,
            });
        });

        // Handle sheet data updates
        socketInstance.on("sheetData", (data: SheetData) => {
            console.log("Received sheet data:", data);

            if (data.dynamicColumns && data.dynamicColumns.length > 0) {
                console.log(
                    `Found ${data.dynamicColumns.length} dynamic columns:`,
                    data.dynamicColumns
                );
            } else {
                console.log("No dynamic columns in response");
                // Try to fetch them directly if they're missing
                if (userId) {
                    apiClient
                        .get(`/api/dynamic-columns/${sheetId}`)
                        .then((response) => {
                            if (
                                response.data.success &&
                                response.data.columns.length > 0
                            ) {
                                console.log(
                                    "Retrieved missing columns:",
                                    response.data.columns
                                );
                                // Manually add them to the data
                                setSheetData({
                                    ...data,
                                    dynamicColumns: response.data.columns,
                                    headers: [
                                        ...(data.originalHeaders ||
                                            data.headers),
                                        ...response.data.columns.map(
                                            (c) => c.name
                                        ),
                                    ],
                                });
                                return;
                            }
                        })
                        .catch((err) =>
                            console.error("Failed to fetch columns:", err)
                        );
                }
            }

            setSheetData(data);
            setLoading(false);
        });

        // Handle errors
        socketInstance.on("error", (err) => {
            setError(err.message);
            setLoading(false);
        });

        // Cleanup on unmount
        return () => {
            console.log("Unsubscribing and disconnecting");
            socketInstance.emit("unsubscribe", { sheetId });
            socketInstance.disconnect();
        };
    }, [sheetId, userId, loadDynamicData]);

    if (loading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-8 w-[250px]" />
                <Skeleton className="h-[400px] w-full rounded-md" />
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    }

    if (!sheetData || !sheetData.headers.length) {
        return (
            <div className="text-center py-10 border rounded-md">
                No data available or empty sheet
            </div>
        );
    }

    return (
        <>
            <DataTable
                columns={columns}
                data={combinedData}
                title={`${sheetData.title} - ${sheetData.sheetTitle}`}
                searchKey={
                    sheetData.originalHeaders?.[0] || sheetData.headers[0]
                }
                onAddColumn={() => setIsAddColumnOpen(true)}
            />

            <AddColumnDialog
                open={isAddColumnOpen}
                setOpen={setIsAddColumnOpen}
                sheetId={sheetId}
                onColumnAdded={handleColumnAdded}
            />
        </>
    );
};

export default SheetViewer;
