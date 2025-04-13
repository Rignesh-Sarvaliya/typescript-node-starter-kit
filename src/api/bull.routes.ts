import { Router } from "express";
import { ExpressAdapter } from "@bull-board/express";
import { createBullBoard } from "@bull-board/api";
import { BullAdapter } from "@bull-board/api/bullAdapter";

import { emailQueue } from "../jobs/queues/email.queue";
import { notificationQueue } from "../jobs/queues/notification.queue";

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

createBullBoard({
  queues: [new BullAdapter(emailQueue), new BullAdapter(notificationQueue)],
  serverAdapter,
});

const router = Router();
router.use("/admin/queues", serverAdapter.getRouter());

export default router;
