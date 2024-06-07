import express from "express";
import {
  addExpense,
  deleteExpense,
  getExpenseYears,
  getExpenses,
  getUniqueMonths,
  updateExpense,
} from "../controllers/expenseController.js";
import verifyJWT from "../middleware/verifyJWT.js";

const router = express.Router();

router.post("/", verifyJWT, addExpense);

router.get("/", verifyJWT, getExpenses);

router.put("/:id", verifyJWT, updateExpense);

router.delete("/:id", verifyJWT, deleteExpense);

router.get("/years", verifyJWT, getExpenseYears);

router.get("/months", verifyJWT, getUniqueMonths);

export default router;
