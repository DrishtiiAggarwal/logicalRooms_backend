import prisma from "../config/prisma";

export async function findOrganizationById(id: string) {
  return prisma.organization.findUnique({ where: { id } });
}

