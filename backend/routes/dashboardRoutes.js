import express from "express";
import verifyJWT from "../middleware/verifyJWT.js";
import { getMonthlyOverview } from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/monthlyOverview", verifyJWT, getMonthlyOverview);

export default router;
