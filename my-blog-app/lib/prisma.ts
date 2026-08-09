import "dotenv/config"
import {PrismaClient} from "@prisma/client"
import {PrismaPg} from "@prisma/adapter-pg"
import pg from "pg"

// Setup connection pool
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
})
// Create adapter
const adapter = new PrismaPg(pool)

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}
export const prisma = globalForPrisma.prisma ?? new PrismaClient({adapter})