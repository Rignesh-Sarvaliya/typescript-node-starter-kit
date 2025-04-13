import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

const prisma = new PrismaClient();

const argv = yargs(hideBin(process.argv))
  .option("name", {
    type: "string",
    demandOption: true,
    describe: "User/Admin name",
  })
  .option("email", {
    type: "string",
    demandOption: true,
    describe: "Email address",
  })
  .option("password", {
    type: "string",
    default: "12345678",
    describe: "Password (default: 12345678)",
  })
  .option("admin", {
    type: "boolean",
    default: false,
    describe: "Create as admin (true) or user (false)",
  })
  .parseSync();

async function createUser() {
  const { name, email, password, admin } = argv;

  const hashed = await bcrypt.hash(password, 10);

  if (admin) {
    const existing = await prisma.admin.findUnique({ where: { email } });
    if (existing)
      return console.log("⚠️ Admin already exists with that email.");
    await prisma.admin.create({
      data: { name, email, password: hashed },
    });
    console.log(`✅ Admin created: ${email}`);
  } else {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return console.log("⚠️ User already exists with that email.");
    await prisma.user.create({
      data: { name, email, password: hashed },
    });
    console.log(`✅ User created: ${email}`);
  }

  await prisma.$disconnect();
}

createUser().catch((err) => {
  console.error("❌ Failed to create user:", err);
  prisma.$disconnect();
  process.exit(1);
});
