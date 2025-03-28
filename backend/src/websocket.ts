import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import { getGoogleSheetData } from "./services/sheets.services.js";
import prisma from "../lib/db.js";

// Active sheets tracking
const activeSheets = new Map();

// Function to get dynamic columns
// Function to get dynamic columns for a sheet/user
async function getDynamicColumnsForSheet(sheetId, userId) {
    try {
        // Find table for this sheet
        const table = await prisma.table.findFirst({
            where: {
                googleSheetId: sheetId,
                userId,
            },
            include: {
                columns: {
                    where: {
                        isDynamic: true,
                    },
                    orderBy: {
                        position: "asc",
                    },
                },
            },
        });

        if (!table || !table.columns.length) {
            return [];
        }

        return table.columns;
    } catch (error) {
        console.error("Error fetching dynamic columns:", error);
        return [];
    }
}

export function setupWebsocket(server) {
    const io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL || "http://localhost:3000",
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        console.log(`New client connected: ${socket.id}`);

        let currentSheetId = null;
        let currentUserId = null;

        // Handle subscription to sheet updates
        socket.on("subscribe", async ({ sheetId, userId }) => {
            if (!sheetId) return;

            currentSheetId = sheetId;
            currentUserId = userId;

            // Join room for this sheet
            socket.join(sheetId);

            console.log(sheetId, userId);

            // Get dynamic columns first (if user is authenticated)
            let dynamicColumns = [];
            if (userId) {
                console.log("Getting dynamic columns for user:", userId);
                dynamicColumns = await getDynamicColumnsForSheet(
                    sheetId,
                    userId
                );
                console.log("Dynamic columns for this user:", dynamicColumns);
            }

            // Add client to tracked sheet
            if (!activeSheets.has(sheetId)) {
                // First client for this sheet
                const sheetInfo = {
                    timer: null,
                    clients: new Set([socket.id]),
                    lastData: null,
                };

                // Initial data fetch
                try {
                    // Get Google Sheet data
                    const data = await getGoogleSheetData(sheetId);

                    // Enhance data with dynamic columns
                    const enhancedData = {
                        ...data,
                        dynamicColumns,
                        originalHeaders: [...data.headers],
                        headers: [
                            ...data.headers,
                            ...dynamicColumns.map((col) => col.name),
                        ],
                    };

                    console.log(
                        "Sending enhanced data with headers:",
                        enhancedData.headers
                    );
                    console.log(
                        `Sending data with ${dynamicColumns.length} dynamic columns:`,
                        dynamicColumns.map((c) => c.name)
                    );
                    console.log(
                        "Dynamic columns included:",
                        dynamicColumns.length
                    );

                    sheetInfo.lastData = enhancedData;
                    socket.emit("sheetData", enhancedData);
                } catch (error) {
                    console.error("Error fetching sheet data:", error);
                    socket.emit("error", {
                        message: "Failed to fetch sheet data",
                    });
                }

                // Set up polling
                sheetInfo.timer = setInterval(async () => {
                    try {
                        // Get updated Google Sheet data
                        const newData = await getGoogleSheetData(sheetId);

                        // Get latest dynamic columns (they might have changed)
                        let latestDynamicColumns = [];
                        if (currentUserId) {
                            latestDynamicColumns =
                                await getDynamicColumnsForSheet(
                                    sheetId,
                                    currentUserId
                                );
                        }

                        // Create enhanced data
                        const enhancedData = {
                            ...newData,
                            dynamicColumns: latestDynamicColumns,
                            originalHeaders: [...newData.headers],
                            headers: [
                                ...newData.headers,
                                ...latestDynamicColumns.map((col) => col.name),
                            ],
                        };

                        // Only emit if data has changed
                        if (
                            JSON.stringify(enhancedData) !==
                            JSON.stringify(sheetInfo.lastData)
                        ) {
                            console.log(
                                "Data changed, sending update with dynamic columns:",
                                latestDynamicColumns.length
                            );
                            sheetInfo.lastData = enhancedData;
                            io.to(sheetId).emit("sheetData", enhancedData);
                        }
                    } catch (error) {
                        console.error("Error in sheet polling:", error);
                    }
                }, 5000);

                activeSheets.set(sheetId, sheetInfo);
            } else {
                // Add this client to existing sheet tracking
                const sheetInfo = activeSheets.get(sheetId);
                sheetInfo.clients.add(socket.id);

                // Send latest data to newly connected client
                if (sheetInfo.lastData) {
                    // If user is authenticated, ensure dynamic columns are included
                    if (userId) {
                        const updatedData = { ...sheetInfo.lastData };

                        // Make sure we include the dynamic columns for this user
                        if (
                            !updatedData.dynamicColumns ||
                            !updatedData.dynamicColumns.length
                        ) {
                            updatedData.dynamicColumns = dynamicColumns;
                            updatedData.headers = [
                                ...(updatedData.originalHeaders ||
                                    updatedData.headers),
                                ...dynamicColumns.map((col) => col.name),
                            ];
                        }

                        socket.emit("sheetData", updatedData);
                    } else {
                        socket.emit("sheetData", sheetInfo.lastData);
                    }
                }
            }
        });

        // Handle unsubscription
        socket.on("unsubscribe", ({ sheetId }) => {
            console.log(
                `Client ${socket.id} unsubscribed from sheet ${sheetId}`
            );

            if (activeSheets.has(sheetId)) {
                const sheetInfo = activeSheets.get(sheetId);

                // Remove this client
                sheetInfo.clients.delete(socket.id);

                // If no more clients, stop polling
                if (sheetInfo.clients.size === 0) {
                    console.log(
                        `Stopped polling sheet ${sheetId} - no active viewers`
                    );
                    clearInterval(sheetInfo.timer);
                    activeSheets.delete(sheetId);
                }
            }

            // Leave room
            socket.leave(sheetId);
        });

        // Handle disconnection
        socket.on("disconnect", () => {
            console.log(`Client disconnected: ${socket.id}`);

            // Clean up any sheet subscriptions
            for (const [sheetId, sheetInfo] of activeSheets.entries()) {
                if (sheetInfo.clients.has(socket.id)) {
                    // Remove this client
                    sheetInfo.clients.delete(socket.id);

                    // If no more clients, stop polling
                    if (sheetInfo.clients.size === 0) {
                        console.log(
                            `Stopped polling sheet ${sheetId} - no active viewers`
                        );
                        clearInterval(sheetInfo.timer);
                        activeSheets.delete(sheetId);
                    }
                }
            }
        });
    });

    return io;
}
