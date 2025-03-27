import { JWT } from 'google-auth-library';
import { google } from 'googleapis';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read credentials
const creds = JSON.parse(
    readFileSync(join(__dirname, './secrets.json'), 'utf-8')
);

// Initialize authentication
const jwt = new JWT({
    email: creds.client_email,
    key: creds.private_key,
    scopes: [
        'https://www.googleapis.com/auth/drive.metadata.readonly',
    ],
});

// Initialize the Drive API
const drive = google.drive({ version: 'v3', auth: jwt });

/**
 * Format a date to Indian Standard Time (IST)
 * @param {string} isoDateString - ISO date string
 * @returns {string} - Formatted date string in IST
 */
function formatToIST(isoDateString) {
    const date = new Date(isoDateString);

    // Format to IST using Intl.DateTimeFormat
    const istFormatter = new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });

    return istFormatter.format(date);
}

/**
 * Get the last modified time of a Google Sheet
 * @param {string} fileId - The ID of the Google Sheet
 * @returns {Promise<{iso: string, ist: string, name: string}>} - Last modified time in ISO and IST formats
 */
async function getSheetLastModified(fileId) {
    try {
        const response = await drive.files.get({
            fileId: fileId,
            fields: 'name,modifiedTime'
        });

        const isoTime = response.data.modifiedTime;
        const istTime = formatToIST(isoTime);

        return {
            iso: isoTime,
            ist: istTime,
            name: response.data.name
        };
    } catch (error) {
        console.error('Error getting last modified time:', error.message);
        throw error;
    }
}

/**
 * Poll a sheet for changes at regular intervals
 * @param {string} sheetId - The ID of the Google Sheet to monitor
 * @param {number} intervalSeconds - Polling interval in seconds
 */
function pollSheetForChanges(sheetId, intervalSeconds = 5) {
    console.log(`Starting to poll sheet ${sheetId} every ${intervalSeconds} seconds...`);
    console.log('Press Ctrl+C to stop polling.');

    let lastModifiedIso = '';
    let sheetName = '';

    // First check
    getSheetLastModified(sheetId).then(data => {
        lastModifiedIso = data.iso;
        sheetName = data.name;
        console.log(`\n[${new Date().toLocaleTimeString()}] Initial check:`);
        console.log(`Sheet: ${data.name}`);
        console.log(`Last modified: ${data.ist}`);
    }).catch(err => {
        console.error('Error on initial check:', err.message);
    });

    // Set up polling interval
    const intervalId = setInterval(async () => {
        try {
            const data = await getSheetLastModified(sheetId);
            const currentTime = new Date().toLocaleTimeString();

            // Only log when there's a change
            if (data.iso !== lastModifiedIso) {
                console.log(`\n[${currentTime}] Sheet modified!`);
                console.log(`Sheet: ${data.name}`);
                console.log(`Last modified: ${data.ist}`);
                console.log(`Previous modified: ${formatToIST(lastModifiedIso)}`);

                // Update the last known modification time
                lastModifiedIso = data.iso;
            } else {
                // Simple dot to show polling is still active
                process.stdout.write('.');
            }
        } catch (error) {
            console.error(`\n[${new Date().toLocaleTimeString()}] Error polling sheet:`, error.message);
        }
    }, intervalSeconds * 1000);

    // Handle clean shutdown
    process.on('SIGINT', () => {
        clearInterval(intervalId);
        console.log('\nStopped polling. Goodbye!');
        process.exit(0);
    });

    return intervalId;
}

// Start polling for the specified sheet
const sheetId = '1K0ciGZXkw8TXiZbMhLd5bkPVJ5fzCYWrxmbHa0mTFg8'; // Replace with your sheet ID
pollSheetForChanges(sheetId, 5);