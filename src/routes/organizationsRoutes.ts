import type { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { organizationsController } from "../controllers/organizationsController";

export function registerOrganizationRoutes(router: Router): void {
  router.get("/organizations/me", authMiddleware, organizationsController.me);
}

