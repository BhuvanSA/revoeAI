import { Request, Response } from "express";
import { createUser, authenticateUser } from "../services/auth.services.js";
import { clearSession, getSession } from "../utils/session.js";

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, name } = req.body;
        await createUser({ email, password, name });
        res.status(201).json({
            success: true,
            message: "User registered successfully",
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message:
                error instanceof Error ? error.message : "Registration failed",
        });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const { user } = await authenticateUser(res, email, password);
        res.status(200).json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Authentication failed",
        });
    }
};

export const checkAuth = async (req: Request, res: Response) => {
    try {
        console.log("verifying session");
        const session = await getSession(req);
        console.log("verifed session");
        if (!session) {
            res.status(401).json({
                success: false,
            });
        } else {
            res.status(200).json({
                success: true,
                user: session.id,
            });
        }
    } catch (error) {
        res.status(401).json({
            success: false,
        });
    }
};

export const logout = async (req: Request, res: Response) => {
    try {
        clearSession(res);
        res.status(200).json({
            success: true,
        });
    } catch (error) {
        res.status(401).json({
            success: false,
        });
    }
};
