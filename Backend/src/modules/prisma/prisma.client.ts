import { PrismaClient } from "../../src/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { env } from "../../config/env";

export class PrismaClientSingleton {
    private static instance: PrismaClient;

    private constructor() {}

    public static getInstance(): PrismaClient {
        if (!PrismaClientSingleton.instance) {
            const pool = new Pool({
                connectionString: env.DB_URL_PRISMA
            });
            const adapter = new PrismaPg(pool as never);
            PrismaClientSingleton.instance = new PrismaClient({ adapter });
        }
        return PrismaClientSingleton.instance;
    }
}

// Exportar la instancia directamente para mayor comodidad
export const prismaClient = PrismaClientSingleton.getInstance();
