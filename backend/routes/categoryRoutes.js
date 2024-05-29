import express, { Router } from "express";
import verifyJWT from "../middleware/verifyJWT.js";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

router.post("/", verifyJWT, createCategory);

router.get("/", verifyJWT, getCategories);

router.put("/:id", verifyJWT, updateCategory);

router.delete("/:id", verifyJWT, deleteCategory);

export default router;
