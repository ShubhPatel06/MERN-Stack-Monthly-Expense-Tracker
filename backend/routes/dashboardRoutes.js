import express from "express";
import verifyJWT from "../middleware/verifyJWT.js";
import {
  getMonthlyOverview,
  yearlyExpenseTrends,
} from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/monthlyOverview", verifyJWT, getMonthlyOverview);
router.get("/expenseTrends", verifyJWT, yearlyExpenseTrends);

export default router;
