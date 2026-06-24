import express from "express";

import {
  createBooking,
  getMyBookings,
  getVendorBookings,
  acceptBooking,
  rejectBooking,
} from "../controllers/booking.controller.js";

import { authenticateUser } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authenticateUser, createBooking);

router.get("/my-bookings", authenticateUser, getMyBookings);

router.get("/vendor", authenticateUser, getVendorBookings);

router.patch("/:bookingId/accept", authenticateUser, acceptBooking);

router.patch("/:bookingId/reject", authenticateUser, rejectBooking);

export default router;
