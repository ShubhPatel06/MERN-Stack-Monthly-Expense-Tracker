import mongoose from "mongoose";

const monthlyBudgetSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  month: {
    type: Number,
    required: true,
  },
  budget: {
    type: Number,
    required: true,
  },
  expenses: {
    type: Number,
    default: 0,
  },
});

const MonthlyBudget = mongoose.model("MonthlyBudget", monthlyBudgetSchema);

export default MonthlyBudget;
