import express from "express";
import {
  createVendorProfile,
  getVendorProfile,
  updateVendorProfile,
} from "../controllers/vendor.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/profile", authenticateUser, createVendorProfile);
router.get("/profile", authenticateUser, getVendorProfile);

router.put("/profile", authenticateUser, updateVendorProfile);

export default router;
