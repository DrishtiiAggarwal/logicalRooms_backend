import type { Request, Response } from "express";
import {
  OrganizationError,
  getMyOrganization,
} from "../services/organizationsService";

export const organizationsController = {
  async me(req: Request, res: Response): Promise<void> {
    try {
      const authUser = req.user;
      if (!authUser) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const organization = await getMyOrganization(authUser.organizationId);
      res.json({ organization });
    } catch (error) {
      if (error instanceof OrganizationError) {
        res.status(error.status).json({ error: error.message });
        return;
      }

      console.error(error);
      res.status(500).json({ error: "Failed to load organization" });
    }
  },
};

