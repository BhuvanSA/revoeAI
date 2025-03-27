import { copyFileSync, mkdirSync } from "fs";
import { join } from "path";

try {
    // Create dist directory if it doesn't exist
    mkdirSync("./dist", { recursive: true });

    // Copy secrets.json
    copyFileSync("./secrets.json", "./dist/secrets.json");

    console.log("Successfully copied files to dist folder");
} catch (error) {
    console.error("Error copying files:", error);
    process.exit(1);
}
