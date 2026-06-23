import prisma from "./config/db.js";

try {
  console.log("Testing Prisma...");

  await prisma.$connect();

  console.log("Database Connected Successfully");

  await prisma.$disconnect();
} catch (error) {
  console.error("ERROR:");
  console.error(error);
}