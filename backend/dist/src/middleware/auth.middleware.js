// import { Request, Response, NextFunction } from "express";
// // import prisma from "../../lib/db";
export {};
// interface TokenPayload {
//     id: string;
// }
// declare global {
//     namespace Express {
//         interface Request {
//             userId?: string;
//         }
//     }
// }
// export const authenticate = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
// ) => {
//     try {
//         const authHeader = req.headers.authorization;
//         if (!authHeader) {
//             return res.status(401).json({ message: "No token provided" });
//         }
//         const [bearer, token] = authHeader.split(" ");
//         if (bearer !== "Bearer" || !token) {
//             return res.status(401).json({ message: "Invalid token format" });
//         }
//         const decoded = jwt.verify(
//             token,
//             process.env.JWT_SECRET || "your-secret-key"
//         ) as TokenPayload;
//         const user = await prisma.user.findUnique({
//             where: { id: decoded.id },
//         });
//         if (!user) {
//             return res.status(401).json({ message: "User not found" });
//         }
//         req.userId = user.id;
//         next();
//     } catch (error) {
//         return res.status(401).json({ message: "Invalid token" });
//     }
// };
