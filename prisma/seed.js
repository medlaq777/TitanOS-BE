import prisma from "../src/config/db.js";

async function seed() {
  await prisma.$connect();
  await prisma.$disconnect();
}

seed();
