import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
// import tableRoutes from "./routes/table.routes";
// import { errorHandler } from "./middleware/error.middleware";

const app = express();

app.use(cookieParser());

// Middleware
app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    })
);
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
// app.use("/api/tables", tableRoutes);

// Basic route
app.get("/", (_req, res) => {
    res.send("RevoeAI API is running");
});

// Error handling middleware
// app.use(errorHandler);

export default app;
