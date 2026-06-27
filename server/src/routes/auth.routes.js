import express from "express";
import { register, login } from "../controllers/auth.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";
import { getProfile } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/profile", authenticateUser, getProfile);

router.get("/profile", authenticateUser, (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

export default router;
