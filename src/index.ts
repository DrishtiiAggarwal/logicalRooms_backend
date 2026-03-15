import "dotenv/config";
import express from "express";
import type { Request, Response } from "express";
import { prisma } from "./config/prisma";

const app = express()
const port: number = 8080

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("working fine!")
})

app.get("/db-test", async (req: Request, res: Response) => {
  try {
    const result = await prisma.$queryRaw`SELECT NOW()`
    res.json(result)
  } catch (error) {
    console.error(error)
    res.status(500).send("Database connection failed")
  }
})

app.listen(port, () => {
  console.log(`server is running at http://localhost:${port}`)
})