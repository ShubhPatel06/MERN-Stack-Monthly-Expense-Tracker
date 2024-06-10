import express from "express";
import verifyJWT from "../middleware/verifyJWT.js";
import {
  expensesByCategory,
  getMonthlyOverview,
  yearlyBudgets,
} from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/monthlyOverview", verifyJWT, getMonthlyOverview);
router.get("/expenseTrends", verifyJWT, yearlyBudgets);
router.get("/expensesByCategory", verifyJWT, expensesByCategory);

export default router;
