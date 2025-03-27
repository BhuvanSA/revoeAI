import { Server } from "socket.io";
import { getGoogleSheetData } from "./services/sheets.services.js";
// Track active connections per sheet
const activeSheets = new Map();
export function setupWebsocket(server) {
    const io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL || "http://localhost:3000",
            methods: ["GET", "POST"],
            credentials: true,
        },
    });
    io.on("connection", (socket) => {
        console.log("New client connected:", socket.id);
        let currentSheetId = null;
        // Client subscribes to a sheet
        socket.on("subscribe", async ({ sheetId, userId }) => {
            if (!sheetId)
                return;
            currentSheetId = sheetId;
            // Authorize user (optional)
            // const authorized = await checkUserAccess(userId, sheetId);
            // if (!authorized) {
            //   socket.emit('error', { message: 'Unauthorized access' });
            //   return;
            // }
            // Join room for this sheet
            socket.join(sheetId);
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
                    const data = await getGoogleSheetData(sheetId);
                    sheetInfo.lastData = data;
                    socket.emit("sheetData", data);
                }
                catch (error) {
                    console.error("Error fetching sheet data:", error);
                    socket.emit("error", {
                        message: "Failed to fetch sheet data",
                    });
                }
                // Set up polling (every 5 seconds, not every 1 second)
                sheetInfo.timer = setInterval(async () => {
                    try {
                        const newData = await getGoogleSheetData(sheetId);
                        // Only emit if data has changed
                        if (JSON.stringify(newData) !==
                            JSON.stringify(sheetInfo.lastData)) {
                            sheetInfo.lastData = newData;
                            io.to(sheetId).emit("sheetData", newData);
                        }
                    }
                    catch (error) {
                        console.error("Error in sheet polling:", error);
                    }
                }, 5000); // 5 second polling interval
                activeSheets.set(sheetId, sheetInfo);
            }
            else {
                // Add this client to existing sheet tracking
                const sheetInfo = activeSheets.get(sheetId);
                sheetInfo.clients.add(socket.id);
                // Send latest data to newly connected client
                if (sheetInfo.lastData) {
                    socket.emit("sheetData", sheetInfo.lastData);
                }
            }
        });
        // Handle client disconnect
        socket.on("disconnect", () => {
            console.log("Client disconnected:", socket.id);
            if (currentSheetId && activeSheets.has(currentSheetId)) {
                const sheetInfo = activeSheets.get(currentSheetId);
                // Remove this client
                sheetInfo.clients.delete(socket.id);
                // If no clients left, stop polling and clean up
                if (sheetInfo.clients.size === 0) {
                    clearInterval(sheetInfo.timer);
                    activeSheets.delete(currentSheetId);
                    console.log(`Stopped polling sheet ${currentSheetId} - no active viewers`);
                }
            }
        });
        // Explicit unsubscribe
        socket.on("unsubscribe", ({ sheetId }) => {
            if (sheetId && activeSheets.has(sheetId)) {
                const sheetInfo = activeSheets.get(sheetId);
                sheetInfo.clients.delete(socket.id);
                socket.leave(sheetId);
                if (sheetInfo.clients.size === 0) {
                    clearInterval(sheetInfo.timer);
                    activeSheets.delete(sheetId);
                }
            }
        });
    });
    return io;
}
