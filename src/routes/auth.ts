import type { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { authController } from "../controllers/authController";

export function registerAuthRoutes(router: Router): void {
  router.post("/auth/register", authController.register);
  router.post("/auth/login", authController.login);
  router.get("/auth/currentUser", authMiddleware, authController.currentUser);
}

