import request from "supertest";
import express from "express";
import session from "express-session";
import { PrismaClient } from "@prisma/client";
import RedisStore from "connect-redis";
import { createClient } from "redis";
import router from "../api/admin.routes"; // or user.routes
import { responseHandler } from "../middlewares/responseHandler";

const prisma = new PrismaClient();
const redisClient = createClient();
const RedisSession = RedisStore(session);

export const app = express();

app.use(express.json());
app.use(responseHandler);
app.use(
  session({
    store: new RedisSession({ client: redisClient }),
    secret: "test-secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use("/", router);
