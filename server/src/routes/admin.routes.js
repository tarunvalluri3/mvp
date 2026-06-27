import express from "express";

import { authenticateUser } from "../middleware/auth.middleware.js";
import { authorizeAdmin } from "../middleware/admin.middleware.js";

import {
  getDashboard,
  getVendors,
  updateVendorStatus,
  getVendorDetails,
  getCustomers,
  getCustomerDetails,
  getDashboardStats
} from "../controllers/admin.controller.js";

const router = express.Router();

/* Dashboard */

router.get("/dashboard", authenticateUser, authorizeAdmin, getDashboard);
router.get("/dashboard-stats", authenticateUser, authorizeAdmin, getDashboardStats);

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
  getVendorDetails,
);

/* Customers */

router.get("/customers", authenticateUser, authorizeAdmin, getCustomers);

router.get(
  "/customers/:customerId",
  authenticateUser,
  authorizeAdmin,
  getCustomerDetails,
);

export default router;
