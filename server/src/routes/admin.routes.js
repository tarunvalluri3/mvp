import express from "express";

import { authenticateUser } from "../middleware/auth.middleware.js";
import { authorizeAdmin } from "../middleware/admin.middleware.js";

import {
  getPendingVendors,
  approveVendor,
  rejectVendor,
} from "../controllers/admin.controller.js";

const router = express.Router();

router.get(
  "/vendors/pending",
  authenticateUser,
  authorizeAdmin,
  getPendingVendors,
);

router.patch(
  "/vendors/:vendorId/approve",
  authenticateUser,
  authorizeAdmin,
  approveVendor,
);

router.patch(
  "/vendors/:vendorId/reject",
  authenticateUser,
  authorizeAdmin,
  rejectVendor,
);

export default router;
