import express from "express";
import {
  getBudget,
  getBudgetYears,
  setBudget,
  updateBudget,
} from "../controllers/budgetController.js";
import verifyJWT from "../middleware/verifyJWT.js";

const router = express.Router();

router.get("/", verifyJWT, getBudget);

router.post("/", verifyJWT, setBudget);

router.put("/:id", verifyJWT, updateBudget);

router.get("/years", verifyJWT, getBudgetYears);

export default router;
