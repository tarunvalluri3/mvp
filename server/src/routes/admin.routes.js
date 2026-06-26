import express from "express";

import { authenticateUser } from "../middleware/auth.middleware.js";
import { authorizeAdmin } from "../middleware/admin.middleware.js";

import {
  getDashboardStats,
  getVendors,
  updateVendorStatus,
  getVendorDetails
} from "../controllers/admin.controller.js";

const router = express.Router();

/* Dashboard */

router.get("/dashboard", authenticateUser, authorizeAdmin, getDashboardStats);

/* Vendors */

router.get("/vendors", authenticateUser, authorizeAdmin, getVendors);

router.patch(
  "/vendors/:vendorId/status",
  authenticateUser,
  authorizeAdmin,
  updateVendorStatus,
); 

router.get(
  "/vendors/:vendorId",
  authenticateUser,
  authorizeAdmin,
  getVendorDetails
);

export default router;
