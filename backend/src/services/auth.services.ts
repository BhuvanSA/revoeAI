import prisma from "../../lib/db.js";
import bcrypt from "bcrypt";
import { createSession } from "../utils/session.js";
import { Response } from "express";

export const createUser = async ({
    email,
    password,
    name,
}: {
    email: string;
    password: string;
    name?: string;
}) => {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
        throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name,
        },
    });
};

export const authenticateUser = async (
    res: Response,
    email: string,
    password: string
) => {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        throw new Error("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new Error("Invalid credentials");
    }

    const payload = {
        id: user.id,
        email: user.email,
        name: user.name,
    };

    await createSession(res, payload);

    return { user };
};
