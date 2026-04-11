import { PrismaClient } from "@prisma/client";

// this is the object we will use to talk to PostgreSQL

const prisma = new PrismaClient();

export default prisma;