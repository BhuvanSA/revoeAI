import { SignJWT, jwtVerify } from "jose";
import { CookieOptions, Request, Response } from "express";

export type SessionPayload = {
    id: string;
    email: string;
    role?: string;
};

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";
const EXPIRES_IN = process.env.JWT_EXPIRE || "1d";

// Parse time strings like "2h", "1d" into milliseconds
function parseTimeString(timeStr: string): number {
    const units: Record<string, number> = {
        s: 1000,
        m: 60 * 1000,
        h: 60 * 60 * 1000,
        d: 24 * 60 * 60 * 1000,
    };

    const match = timeStr.match(/^(\d+)([smhd])$/);
    if (!match) {
        return 24 * 60 * 60 * 1000; // Default to 1 day if format is invalid
    }

    const [, value, unit] = match;
    return parseInt(value) * units[unit];
}

export const encrypt = async (payload: SessionPayload): Promise<string> => {
    const encodedKey = new TextEncoder().encode(SECRET_KEY);
    return new SignJWT(payload as any)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(EXPIRES_IN)
        .sign(encodedKey);
};

export const decrypt = async (
    token: string
): Promise<SessionPayload | null> => {
    try {
        const encodedKey = new TextEncoder().encode(SECRET_KEY);
        const { payload } = await jwtVerify(token, encodedKey, {
            algorithms: ["HS256"],
        });
        return payload as unknown as SessionPayload;
    } catch (error) {
        console.error("Failed to verify token", error);
        return null;
    }
};

export const createSession = async (
    res: Response,
    payload: SessionPayload
): Promise<void> => {
    const token = await encrypt(payload);
    const expiresInMs = parseTimeString(EXPIRES_IN as string);

    const cookieOptions: CookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        expires: new Date(Date.now() + expiresInMs),
    };

    res.cookie("session", token, cookieOptions);
};

export const getSession = async (
    req: Request
): Promise<SessionPayload | null> => {
    const token = await req.cookies.session;
    if (!token) return null;

    return await decrypt(token);
};

export const clearSession = (res: Response): void => {
    res.clearCookie("session", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
    });
};
