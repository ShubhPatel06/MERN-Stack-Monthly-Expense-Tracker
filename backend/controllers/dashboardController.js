import MonthlyBudget from "../models/monthlyBudget.js";
import Expense from "../models/expense.js";
import mongoose from "mongoose";

export const getMonthlyOverview = async (req, res) => {
  try {
    const latestBudget = await MonthlyBudget.findOne({
      userID: req.user.id,
    }).sort({
      year: -1,
      month: -1,
    });

    // if (!latestBudget) {
    //   return res.status(404).send("No budget found. Please add a budget.");
    // }

    // const remainingBudget = latestBudget.budget - latestBudget.expenses;

    // res.json({
    //   totalBudget: latestBudget.budget,
    //   totalExpenses: latestBudget.expenses,
    //   remainingBudget,
    //   budgetDetails: latestBudget,
    // });

    res.send(latestBudget);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const yearlyBudgets = async (req, res) => {
  const { year } = req.query;

  try {
    const budgets = await MonthlyBudget.find({
      userID: req.user.id,
      year: year,
    });
    res.status(200).send(budgets);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const expensesByCategory = async (req, res) => {
  try {
    const userID = req.user.id;

    const expenses = await Expense.aggregate([
      {
        $match: {
          userID: mongoose.Types.ObjectId.createFromHexString(userID),
        },
      },
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: "$category",
      },
      {
        $project: {
          _id: 0,
          category: "$category.name",
          totalAmount: 1,
        },
      },
    ]);

    res.send(expenses);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
