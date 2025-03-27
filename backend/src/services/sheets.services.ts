import { JWT } from "google-auth-library";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { cache } from "./cache.services.js";

// Get current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read and parse secrets.json
const creds = JSON.parse(
    readFileSync(join(__dirname, "../../secrets.json"), "utf-8")
);

const SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive.file",
];

const jwt = new JWT({
    email: creds.client_email,
    key: creds.private_key,
    scopes: SCOPES,
});

// Cache sheet instances to avoid recreating them
const sheetInstances = new Map();

export async function getGoogleSheetData(sheetId: string) {
    try {
        // Check cache first (5 second TTL)
        const cacheKey = `sheet_data_${sheetId}`;
        const cachedData = cache.get(cacheKey);
        if (cachedData) {
            return cachedData;
        }

        // Get or create spreadsheet instance
        let doc;
        if (sheetInstances.has(sheetId)) {
            doc = sheetInstances.get(sheetId);
        } else {
            doc = new GoogleSpreadsheet(sheetId, jwt);
            await doc.loadInfo();
            sheetInstances.set(sheetId, doc);
        }

        // Get the first sheet
        const sheet = doc.sheetsByIndex[0];

        // Load headers and rows
        await sheet.loadHeaderRow();
        const headers = sheet.headerValues;
        console.log("Headers loaded:", headers);

        // Get all rows
        const rows = await sheet.getRows();
        console.log(`Fetched ${rows.length} rows from sheet`);

        // Debug first row
        if (rows.length > 0) {
            console.log("First row raw data:", rows[0]._rawData);
            console.log("First row object:", rows[0].toObject());
        }

        // Format data - THIS IS THE CRITICAL FIX
        const formattedData = {
            title: doc.title,
            sheetTitle: sheet.title,
            headers,
            rows: rows.map((row) => {
                // Use toObject() instead of manually building the object
                return row.toObject();

                // If toObject() doesn't work, try this alternative:
                // const obj = {};
                // headers.forEach((header, index) => {
                //   obj[header] = row._rawData[index];
                // });
                // return obj;
            }),
        };

        // Log the first formatted row to verify
        if (formattedData.rows.length > 0) {
            console.log("First formatted row:", formattedData.rows[0]);
        }

        // Cache the result
        cache.set(cacheKey, formattedData, 5);

        return formattedData;
    } catch (error) {
        console.error("Error fetching Google Sheet data:", error);
        throw error;
    }
}
