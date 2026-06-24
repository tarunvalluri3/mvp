import express from "express";

import { authenticateUser } from "../middleware/auth.middleware.js";
import {
  createService,
  getMyServices,
  updateService,
  deleteService,
} from "../controllers/service.controller.js";

const router = express.Router();

router.post("/", authenticateUser, createService);

router.get("/my-services", authenticateUser, getMyServices);

router.put("/:serviceId", authenticateUser, updateService);

router.delete("/:serviceId", authenticateUser, deleteService);

export default router;
