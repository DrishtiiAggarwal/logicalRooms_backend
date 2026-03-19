import jwt from "jsonwebtoken";
import type { AuthUser } from "../middleware/auth";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

export function extractTokenFromHeader(
  authHeader: string | undefined
): string | null {
  if (!authHeader) return null;
  if (!authHeader.startsWith("Bearer ")) return null;
  return authHeader.substring("Bearer ".length);
}

export function signToken(user: AuthUser): string {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export function verifyToken(token: string): AuthUser {
  const payload = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;

  if (
    typeof payload.sub !== "string" ||
    typeof payload.email !== "string" ||
    typeof payload.role !== "string" ||
    typeof payload.organizationId !== "string"
  ) {
    throw new Error("Invalid token payload");
  }

  return {
    id: payload.sub,
    email: payload.email,
    role: payload.role as AuthUser["role"],
    organizationId: payload.organizationId,
  };
}

