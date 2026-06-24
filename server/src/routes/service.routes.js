import express from "express";

import { authenticateUser } from "../middleware/auth.middleware.js";
import { createService } from "../controllers/service.controller.js";

const router = express.Router();

router.post(
  "/",
  authenticateUser,
  createService
);

export default router;