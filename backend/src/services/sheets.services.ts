import { JWT } from "google-auth-library";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { cache } from "./cache.services.js";

// Get current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive.file",
];

const jwt = new JWT({
    email: process.env.CLIENT_EMAIL, // Use environment variable for security
    key: process.env.PRIVATE_KEY, // Use environment variable for security
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

        // Get all rows
        const rows = await sheet.getRows();

        // Format data - THIS IS THE CRITICAL FIX
        const formattedData = {
            title: doc.title,
            sheetTitle: sheet.title,
            headers,
            rows: rows.map((row: { toObject: () => any }) => {
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

        // Cache the result
        cache.set(cacheKey, formattedData, 5);

        return formattedData;
    } catch (error) {
        console.error("Error fetching Google Sheet data:", error);
        throw error;
    }
}
