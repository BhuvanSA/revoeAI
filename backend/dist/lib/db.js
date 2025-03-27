import { PrismaClient } from "@prisma/client";
const prismaClientSingleton = () => {
    return new PrismaClient({
        transactionOptions: {
            maxWait: 15000,
            timeout: 60000,
        },
    });
};
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();
export default prisma;
if (process.env.NODE_ENV !== "production")
    globalThis.prismaGlobal = prisma;
