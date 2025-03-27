declare namespace NodeJS {
    interface ProcessEnv {
        NODE_ENV: "development" | "production" | "test";
        PORT: string;
        DATABASE_URL: string;
        JWT_SECRET: string;
        GOOGLE_SERVICE_ACCOUNT_EMAIL: string;
        GOOGLE_PRIVATE_KEY: string;
        CLIENT_URL: string;
    }
}

declare module "google-spreadsheet" {
    import { JWT } from "google-auth-library";

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

declare global {
    var prisma: import("@prisma/client").PrismaClient | undefined;
}

export {};
