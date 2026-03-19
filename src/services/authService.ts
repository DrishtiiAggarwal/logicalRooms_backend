import { randomUUID } from "crypto";
import bcrypt from "bcrypt";
import type { AuthUser } from "../middleware/auth";
import { signToken } from "../utils/jwt";
import {
  createUser,
  findUserByEmail,
  findUserByIdWithOrganization,
} from "../repositories/userRepository";

export class AuthError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export interface RegisterInput {
  email: string;
  username: string;
  password: string;
  organizationId: string;
  role?: AuthUser["role"];
}

export interface LoginInput {
  email: string;
  password: string;
}

export async function registerUser(input: RegisterInput) {
  const { email, username, password, organizationId, role } = input;

  const existing = await findUserByEmail(email);
  if (existing) {
    throw new AuthError("User with this email already exists", 409);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await createUser({
    id: randomUUID(),
    email,
    username,
    passwordHash,
    role: role ?? "STUDENT",
    organizationId,
  });

  const token = signToken({
    id: user.id,
    email: user.email,
    role: user.role,
    organizationId: user.organizationId,
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      organizationId: user.organizationId,
    },
    token,
  };
}

export async function loginUser(input: LoginInput) {
  const { email, password } = input;

  const user = await findUserByEmail(email);
  if (!user) {
    throw new AuthError("Invalid credentials", 401);
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    throw new AuthError("Invalid credentials", 401);
  }

  const token = signToken({
    id: user.id,
    email: user.email,
    role: user.role,
    organizationId: user.organizationId,
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      organizationId: user.organizationId,
    },
    token,
  };
}

export async function getCurrentUser(userId: string) {
  const user = await findUserByIdWithOrganization(userId);

  if (!user) {
    throw new AuthError("User not found", 404);
  }

  return {
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      organizationId: user.organizationId,
    },
    organization: user.organization
      ? {
          id: user.organization.id,
          name: user.organization.name,
        }
      : null,
  };
}

