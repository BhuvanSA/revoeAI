"use client";
import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthContext } from "@/contexts/auth-context";

interface SheetViewerProps {
    sheetId: string;
}

interface SheetData {
    title: string;
    sheetTitle: string;
    headers: string[];
    rows: Record<string, any>[];
}

const SheetViewer: React.FC<SheetViewerProps> = ({ sheetId }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [sheetData, setSheetData] = useState<SheetData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuthContext();

    useEffect(() => {
        // Initialize socket connection
        const socketInstance = io(
            process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000",
            {
                withCredentials: true,
            }
        );

        setSocket(socketInstance);

        // Handle connection events
        socketInstance.on("connect", () => {
            console.log("Connected to WebSocket server");

            // Subscribe to sheet updates
            socketInstance.emit("subscribe", {
                sheetId,
                userId: user?.id,
            });
        });

        // Handle sheet data updates
        socketInstance.on("sheetData", (data: SheetData) => {
            console.log("Received sheet data:", data);
            console.log("Headers:", data.headers);
            console.log("Rows count:", data.rows.length);
            console.log("First row sample:", data.rows[0]);

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
    }, [sheetId, user]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
            </div>
        );
    }

    if (!sheetData || !sheetData.headers.length) {
        return (
            <div className="text-center py-10">
                No data available or empty sheet
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <h2 className="text-xl font-semibold mb-4">
                {sheetData.title} - {sheetData.sheetTitle}
            </h2>

            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {sheetData.headers.map((header, index) => (
                            <th
                                key={index}
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {sheetData.rows.length === 0 ? (
                        <tr>
                            <td
                                colSpan={sheetData.headers.length}
                                className="px-6 py-4 text-center text-gray-500"
                            >
                                No data available in sheet
                            </td>
                        </tr>
                    ) : (
                        sheetData.rows.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {sheetData.headers.map((header, colIndex) => (
                                    <td
                                        key={`${rowIndex}-${colIndex}`}
                                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                                    >
                                        {/* Log this value to see what's happening */}
                                        {console.log(
                                            `Value for ${header}:`,
                                            row[header]
                                        )}
                                        {row[header]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default SheetViewer;
