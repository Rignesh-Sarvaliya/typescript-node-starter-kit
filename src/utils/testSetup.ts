import request from "supertest";
import express from "express";
import session from "express-session";
import { PrismaClient } from "@prisma/client";
import RedisStore from "connect-redis";
import { createClient } from "redis";
import { isProduction } from "../config/env";
import { logger } from "./logger";
// Use user routes for testing APIs
import router from "../api/user.routes";

const prisma = new PrismaClient();

let redisClient: any = null;
let RedisSession: any = null;

if (isProduction) {
  redisClient = createClient();
  RedisSession = (RedisStore as any)(session);
} else {
  logger.info("ℹ️ Redis disabled for test setup in development");
}

export const app = express();

app.use(express.json());
app.use(
  session({
    store: RedisSession ? new RedisSession({ client: redisClient }) : undefined,
    secret: "test-secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use("/", router);
