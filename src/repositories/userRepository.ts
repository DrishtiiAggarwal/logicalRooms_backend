import prisma from "../config/prisma";
import type { AuthRole } from "../middleware/auth";

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function createUser(data: {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
  role: AuthRole;
  organizationId: string;
}) {
  return prisma.user.create({
    data: {
      id: data.id,
      email: data.email,
      username: data.username,
      passwordHash: data.passwordHash,
      role: data.role,
      organization: { connect: { id: data.organizationId } },
    },
  });
}

export async function findUserByIdWithOrganization(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: { organization: true },
  });
}

