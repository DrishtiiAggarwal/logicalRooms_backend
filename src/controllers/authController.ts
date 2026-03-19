import type { Request, Response } from "express";
import {
  AuthError,
  getCurrentUser,
  loginUser,
  registerUser,
} from "../services/authService";

export const authController = {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, username, password, organizationId, role } = req.body ?? {};

      if (!email || !username || !password || !organizationId) {
        res
          .status(400)
          .json({ error: "email, username, password and organizationId are required" });
        return;
      }

      const result = await registerUser({
        email,
        username,
        password,
        organizationId,
        role,
      });

      res.status(201).json(result);
    } catch (error) {
      if (error instanceof AuthError) {
        res.status(error.status).json({ error: error.message });
        return;
      }

      console.error(error);
      res.status(500).json({ error: "Failed to register user" });
    }
  },

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body ?? {};

      if (!email || !password) {
        res.status(400).json({ error: "email and password are required" });
        return;
      }

      const result = await loginUser({ email, password });
      res.json(result);
    } catch (error) {
      if (error instanceof AuthError) {
        res.status(error.status).json({ error: error.message });
        return;
      }

      console.error(error);
      res.status(500).json({ error: "Failed to login" });
    }
  },

  async currentUser(req: Request, res: Response): Promise<void> {
    try {
      const authUser = req.user;
      if (!authUser) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const result = await getCurrentUser(authUser.id);
      res.json(result);
    } catch (error) {
      if (error instanceof AuthError) {
        res.status(error.status).json({ error: error.message });
        return;
      }

      console.error(error);
      res.status(500).json({ error: "Failed to load current user" });
    }
  },
};

