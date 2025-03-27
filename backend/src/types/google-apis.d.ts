declare module "google-spreadsheet" {
    import { GoogleAuth, JWT } from "google-auth-library";

    // Add Headers interface to avoid the import error
    interface Headers {
        [key: string]: string;
    }

    export class GoogleSpreadsheet {
        constructor(sheetId: string, auth: JWT);
        loadInfo(): Promise<void>;
        title: string;
        sheetsByIndex: GoogleSpreadsheetWorksheet[];
    }

    export class GoogleSpreadsheetWorksheet {
        title: string;
        headerValues: string[];
        rowCount: number;
        columnCount: number;

        loadHeaderRow(): Promise<void>;
        getRows<T = any>(): Promise<GoogleSpreadsheetRow<T>[]>;
    }

    export class GoogleSpreadsheetRow<T = any> {
        _rawData: any[];
        toObject(): T;
    }
}
