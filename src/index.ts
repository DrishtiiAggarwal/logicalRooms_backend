import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import type { Request, Response } from "express";
import { registerAuthRoutes } from "./routes/auth";
import { registerOrganizationRoutes } from "./routes/organizationsRoutes";

const app = express();
const port: number = 8080;

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

const api = express.Router();
registerAuthRoutes(api);
registerOrganizationRoutes(api);

app.use("/api", api);

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("working fine!");
});

app.listen(port, () => {
  console.log(`server is running at http://localhost:${port}`);
});