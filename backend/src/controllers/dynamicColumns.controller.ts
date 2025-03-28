import { Request, Response } from "express";
import prisma from "../../lib/db.js";
import { getSession } from "../utils/session.js";

export async function getDynamicColumns(req: Request, res: Response) {
    try {
        const user = await getSession(req);
        if (!user) {
            return res
                .status(401)
                .json({ success: false, message: "Unauthorized" });
        }

        const { sheetId } = req.params;

        console.log(
            `Getting dynamic columns for sheet: ${sheetId}, user: ${user.id}`
        );

        // Find table for this sheet
        let table = await prisma.table.findFirst({
            where: {
                googleSheetId: sheetId,
                userId: user.id,
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

        if (!table) {
            console.log("No table found for this sheet/user");
            return res.json({
                success: true,
                columns: [],
            });
        }

        console.log(`Found ${table.columns.length} columns`);

        return res.json({
            success: true,
            columns: table.columns,
        });
    } catch (error) {
        console.error("Error fetching dynamic columns:", error);
        return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
    }
}

export async function addDynamicColumn(req: Request, res: Response) {
    try {
        const user = await getSession(req);
        if (!user) {
            return res
                .status(401)
                .json({ success: false, message: "Unauthorized" });
        }

        const { sheetId } = req.params;
        const { name, dataType } = req.body;

        console.log(`Adding column for sheet ${sheetId}:`, { name, dataType });

        if (!name || !dataType) {
            return res.status(400).json({
                success: false,
                message: "Column name and type are required",
            });
        }

        // Find or create table entry for this sheet
        let table = await prisma.table.findFirst({
            where: {
                googleSheetId: sheetId,
                userId: user.id,
            },
            include: {
                columns: {
                    orderBy: {
                        position: "asc",
                    },
                },
            },
        });

        if (!table) {
            // Create a new table entry
            console.log("Creating new table for sheet");
            table = await prisma.table.create({
                data: {
                    name: "Sheet " + sheetId,
                    googleSheetId: sheetId,
                    userId: user.id,
                },
                include: {
                    columns: true,
                },
            });
        }

        // Calculate next position
        const position =
            table.columns.length > 0
                ? Math.max(...table.columns.map((col) => col.position)) + 1
                : 0;

        console.log(`Adding column at position ${position}`);

        // Create the new column
        const newColumn = await prisma.column.create({
            data: {
                name,
                dataType,
                position,
                isDynamic: true,
                tableId: table.id,
            },
        });

        console.log("Column created:", newColumn);

        return res.json({
            success: true,
            column: newColumn,
        });
    } catch (error) {
        console.error("Error adding dynamic column:", error);
        return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
    }
}

export async function getDynamicColumnData(req: Request, res: Response) {
    try {
        const user = await getSession(req);
        if (!user) {
            return res
                .status(401)
                .json({ success: false, message: "Unauthorized" });
        }

        const { sheetId } = req.params;

        console.log(
            `Getting dynamic column data for sheet: ${sheetId}, user: ${user.id}`
        );

        // Get all dynamic data for this sheet
        const dynamicData = await prisma.dynamicColumnData.findMany({
            where: {
                sheetId,
                userId: user.id,
            },
        });

        console.log(`Found ${dynamicData.length} dynamic data entries`);

        // Transform into a more usable format for the frontend
        const formattedData: Record<number, Record<string, any>> = {};

        dynamicData.forEach((item) => {
            const rowData = item.rowData as any;
            const rowIndex = rowData.rowIndex;
            const columnId = rowData.columnId;
            const value = rowData.value;

            if (!formattedData[rowIndex]) {
                formattedData[rowIndex] = {};
            }
            formattedData[rowIndex][columnId] = value;
        });

        console.log("Formatted data:", formattedData);

        return res.json({
            success: true,
            data: formattedData,
        });
    } catch (error) {
        console.error("Error getting dynamic column data:", error);
        return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
    }
}

export async function saveDynamicColumnData(req: Request, res: Response) {
    try {
        const user = await getSession(req);
        if (!user) {
            return res
                .status(401)
                .json({ success: false, message: "Unauthorized" });
        }

        const { sheetId } = req.params;
        const { rowData } = req.body;

        console.log(
            `Saving dynamic column data for sheet: ${sheetId}`,
            rowData
        );

        if (!rowData) {
            return res
                .status(400)
                .json({ success: false, message: "Row data is required" });
        }

        // Store the dynamic data - overwrite any existing data for this cell
        await prisma.dynamicColumnData.create({
            data: {
                rowData,
                sheetId,
                userId: user.id,
            },
        });

        console.log("Dynamic data saved successfully");

        return res.json({
            success: true,
            message: "Data saved successfully",
        });
    } catch (error) {
        console.error("Error saving dynamic column data:", error);
        return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
    }
}

// Debug endpoint to help troubleshoot issues
export async function debugDynamicColumns(req: Request, res: Response) {
    try {
        const user = await getSession(req);
        if (!user) {
            return res
                .status(401)
                .json({ success: false, message: "Unauthorized" });
        }

        const { sheetId } = req.params;

        // Get all tables for this user
        const tables = await prisma.table.findMany({
            where: {
                userId: user.id,
            },
            include: {
                columns: true,
            },
        });

        // Get specific table for this sheet
        const table = await prisma.table.findFirst({
            where: {
                googleSheetId: sheetId,
                userId: user.id,
            },
            include: {
                columns: true,
            },
        });

        // Get dynamic data for this sheet
        const dynamicData = await prisma.dynamicColumnData.findMany({
            where: {
                sheetId,
                userId: user.id,
            },
        });

        return res.json({
            success: true,
            debug: {
                userId: user.id,
                sheetId,
                allTables: tables,
                thisTable: table,
                dynamicData,
            },
        });
    } catch (error) {
        console.error("Error in debug endpoint:", error);
        return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
    }
}
