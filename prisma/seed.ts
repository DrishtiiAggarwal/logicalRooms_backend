import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required for seed");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Create default organization if not exists
  const org =
    (await prisma.organization.findFirst({
      where: { name: "Default Organization" },
    })) ??
    (await prisma.organization.create({
      data: { name: "Default Organization" },
    }));

  // Seed languages (common for code judge)
  const languages = [
    { name: "JavaScript", version: "20" },
    { name: "Python", version: "3.11" },
    { name: "Python", version: "3.12" },
    { name: "TypeScript", version: "5" },
    { name: "Java", version: "17" },
    { name: "C++", version: "17" },
  ];

  for (const lang of languages) {
    await prisma.language.upsert({
      where: {
        name_version: { name: lang.name, version: lang.version },
      },
      update: {},
      create: lang,
    });
  }

  console.log("Seeded organization:", org.name);
  console.log("Seeded", languages.length, "languages");
  console.log(
    "\nTo create an admin user, run: npm run dev and use POST /api/auth/register with role: ADMIN"
  );
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
