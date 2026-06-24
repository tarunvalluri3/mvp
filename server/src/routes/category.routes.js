import express from "express";

import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";

import { authenticateUser } from "../middleware/auth.middleware.js";
import { authorizeAdmin } from "../middleware/admin.middleware.js";

const router = express.Router();

router.post("/", authenticateUser, authorizeAdmin, createCategory);

router.get("/", getCategories);

router.put("/:categoryId", authenticateUser, authorizeAdmin, updateCategory);

router.delete("/:categoryId", authenticateUser, authorizeAdmin, deleteCategory);

export default router;
