import { Request, Response, NextFunction } from "express";
import { getSession, SessionPayload } from "../utils/session.js";

interface TokenPayload {
    id: string;
    email: string;
    exp: number;
}

declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}

export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: "No token provided" });
        }

        const [bearer, token] = authHeader.split(" ");

        if (bearer !== "Bearer" || !token) {
            return res.status(401).json({ message: "Invalid token format" });
        }

        const user: SessionPayload = await getSession(req);

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        req.userId = user.id;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};
