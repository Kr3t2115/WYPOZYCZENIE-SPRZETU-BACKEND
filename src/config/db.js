
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

import {config} from 'dotenv';
config()

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter:adapter, log: ['query', 'info', 'warn', 'error'], })

const connectDB = async () => {
    try {
        await prisma.$connect();
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
}

const disconnectDB = async () => {
    await prisma.$disconnect();
}


export { connectDB, disconnectDB, prisma};