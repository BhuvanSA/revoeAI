import app from "./src/app.js";
import dotenv from "dotenv";
import { setupWebsocket } from "./src/websocket.js";
import { createServer } from "http";
dotenv.config();
const server = createServer(app);
setupWebsocket(server);
const port = process.env.PORT || 4000;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
