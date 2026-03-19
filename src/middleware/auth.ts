import type { Request, Response, NextFunction } from "express";
import { extractTokenFromHeader, verifyToken } from "../utils/jwt";

export type AuthRole = "STUDENT" | "PROBLEM_SETTER" | "ADMIN";

export interface AuthUser {
  id: string;
  email: string;
  role: AuthRole;
  organizationId: string;
}

declare module "express-serve-static-core" {
  interface Request {
    user?: AuthUser;
  }
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    if (!token) {
      res
        .status(401)
        .json({ error: "Missing or invalid Authorization header" });
      return;
    }

    const user = verifyToken(token);
    req.user = user;

    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

export function requireRole(...allowedRoles: AuthRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user;

    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    next();
  };
}


