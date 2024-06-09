import MonthlyBudget from "../models/monthlyBudget.js";

export const getMonthlyOverview = async (req, res) => {
  try {
    const latestBudget = await MonthlyBudget.findOne({
      userID: req.user.id,
    }).sort({
      year: -1,
      month: -1,
    });

    if (!latestBudget) {
      return res.status(404).json({ message: "No budget found." });
    }

    const remainingBudget = latestBudget.budget - latestBudget.expenses;

    res.json({
      totalBudget: latestBudget.budget,
      totalExpenses: latestBudget.expenses,
      remainingBudget,
      budgetDetails: latestBudget,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const yearlyExpenseTrends = async (req, res) => {
  const { year } = req.query;

  try {
    const budgets = await MonthlyBudget.find({ year });
    res.status(200).json(budgets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
