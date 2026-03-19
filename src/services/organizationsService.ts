import { findOrganizationById } from "../repositories/organizationRepository";

export class OrganizationError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function getMyOrganization(organizationId: string) {
  const organization = await findOrganizationById(organizationId);

  if (!organization) {
    throw new OrganizationError("Organization not found", 404);
  }

  return {
    id: organization.id,
    name: organization.name,
    createdAt: organization.createdAt,
  };
}

