import express from "express";
import { createVendorProfile } from "../controllers/vendor.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post(
  "/profile",
  authenticateUser,
  createVendorProfile
);

export default router;