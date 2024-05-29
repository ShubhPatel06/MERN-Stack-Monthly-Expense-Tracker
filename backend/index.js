import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/dbConnection.js";
import mongoose from "mongoose";
import { corsOptions } from "./config/corsOption.js";
import authRoutes from "./routes/authRoutes.js";
import budgetRoutes from "./routes/budgetRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import rootRoutes from "./routes/root.js";
import path from "path";
import { fileURLToPath } from "url";
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

connectDB();
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Welcome to Expense Tracker API");
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/", express.static(path.join(__dirname, "public")));

app.use("/", rootRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/expense", expenseRoutes);

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

mongoose.connection.once("open", () => {
  console.log("Connected to Database!");
  app.listen(port, () => console.log(`Server running on port ${port}`));
});
