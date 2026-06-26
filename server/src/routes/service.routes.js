import express from "express";

import { authenticateUser } from "../middleware/auth.middleware.js";
import {
  createService,
  getMyServices,
  getMyServiceById,
  updateService,
  deactivateService,
  activateService,
  getAllServices,
  getServiceDetails,
} from "../controllers/service.controller.js";

const router = express.Router();

router.post("/", authenticateUser, createService);

router.get("/my-services", authenticateUser, getMyServices);

router.get("/my-services/:serviceId", authenticateUser, getMyServiceById);

router.get("/", getAllServices);

router.get("/details/:serviceId", getServiceDetails);

router.put("/:serviceId", authenticateUser, updateService);

router.patch("/:serviceId/deactivate", authenticateUser, deactivateService);

router.patch("/:serviceId/activate", authenticateUser, activateService);

export default router;
