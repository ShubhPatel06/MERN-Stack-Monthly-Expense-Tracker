import Expense from "../models/expense.js";
import MonthlyBudget from "../models/monthlyBudget.js";
import Category from "../models/category.js";
import Joi from "joi";

export const getExpenseYears = async (req, res) => {
  try {
    const expenseYears = await Expense.distinct("date", {
      userID: req.user.id,
    }).then((dates) => {
      const years = dates.map((date) => new Date(date).getFullYear());
      return Array.from(new Set(years)); // Remove duplicate years
    });

    res.send(expenseYears);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const getUniqueMonths = async (req, res) => {
  const { year } = req.query;

  try {
    const startDate = new Date(year, 0, 1); // Start of the year
    const endDate = new Date(year, 11, 31); // End of the year

    const dates = await Expense.distinct("date", {
      userID: req.user.id,
      date: { $gte: startDate, $lte: endDate },
    });

    // Extract months and ensure uniqueness using a Set
    const uniqueMonthsSet = new Set(
      dates.map((date) => new Date(date).getMonth() + 1)
    );

    // Convert the Set back to an array
    const uniqueMonths = Array.from(uniqueMonthsSet);

    res.send(uniqueMonths);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const getExpenses = async (req, res) => {
  const { year, month } = req.query;

  try {
    let startDate, endDate;
    if (year && month) {
      // Subtract 1 from month because JS dates are zero-indexed (0 = January, 11 = December)
      startDate = new Date(year, month - 1, 1); // First day of the month at 00:00:00.000
      endDate = new Date(year, month - 1 + 1, 0, 23, 59, 59, 999); // Last moment of the month
    }

    const expenses = await Expense.find({
      userID: req.user.id,
      date: { $gte: startDate, $lte: endDate },
    })
      .sort({ date: -1 })
      .populate("category", "name");

    // if (!expenses.length) {
    //   return res.status(400).send("No expenses found");
    // }
    res.send(expenses);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const addExpense = async (req, res) => {
  const schema = Joi.object({
    amount: Joi.number().min(1).required(),
    description: Joi.string().required().min(1).max(255),
    category: Joi.string().required(),
    date: Joi.date(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let { amount, category, description, date } = req.body;

  amount = Number(amount);

  const expenseDate = new Date(date);
  const year = Number(expenseDate.getFullYear());
  const month = Number(expenseDate.getMonth() + 1);

  try {
    const budget = await MonthlyBudget.findOne({
      userID: req.user.id,
      year,
      month,
    });

    if (!budget)
      return res
        .status(404)
        .send(
          "Budget for the month in the selected date is not set! Please add budget for that month first."
        );

    if (budget.expenses + amount > budget.budget) {
      return res.status(400).send("Exceeds remaining budget balance");
    }

    const categoryExists = await Category.findOne({
      _id: category,
      userID: req.user.id,
    });

    if (!categoryExists) return res.status(404).send("Category not found");

    const newExpense = new Expense({
      userID: req.user.id,
      amount,
      category,
      description,
      date,
    });

    // Update budget.expenses
    budget.expenses += amount;

    await newExpense.save();
    await budget.save();

    res.status(201).send(newExpense);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const updateExpense = async (req, res) => {
  const schema = Joi.object({
    amount: Joi.number().min(1).required(),
    description: Joi.string().required().min(1).max(255),
    category: Joi.string().required(),
    date: Joi.date(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const { id } = req.params;
  let { amount, category, description, date } = req.body;
  amount = Number(amount);

  try {
    const expense = await Expense.findById(id).exec();

    if (!expense) return res.status(404).send("Expense not found");

    const oldAmount = expense.amount;
    const newAmount = amount;
    const oldDate = expense.date;
    const newDate = new Date(date);

    // Extract year and month from old and new dates
    const oldYear = oldDate.getFullYear();
    const oldMonth = oldDate.getMonth() + 1;
    const newYear = newDate.getFullYear();
    const newMonth = newDate.getMonth() + 1;

    const oldBudget = await MonthlyBudget.findOne({
      userID: req.user.id,
      year: oldYear,
      month: oldMonth,
    });

    const newBudget = await MonthlyBudget.findOne({
      userID: req.user.id,
      year: newYear,
      month: newMonth,
    });

    if (!newBudget) {
      return res
        .status(404)
        .send(
          "Budget for the month in the selected date is not set! Please add budget for that month first."
        );
    }

    // Check if the expense was moved to a different month
    if (oldYear !== newYear || oldMonth !== newMonth) {
      // Subtract old expense from old month's budget
      oldBudget.expenses -= oldAmount;
      await oldBudget.save();

      // Add new expense to new month's budget
      newBudget.expenses += newAmount;
      await newBudget.save();
    } else {
      // If the expense remains in the same month, update the budget accordingly
      oldBudget.expenses = oldBudget.expenses - oldAmount + newAmount;
      await oldBudget.save();
    }

    const categoryExists = await Category.findOne({
      _id: category,
      userID: req.user.id,
    });

    if (!categoryExists) return res.status(404).send("Category not found");

    // Update the expense details
    expense.amount = newAmount;
    expense.category = category;
    expense.description = description;
    expense.date = date;

    // Save the updated expense
    await expense.save();

    res.send(expense);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const deleteExpense = async (req, res) => {
  const { id } = req.params;

  try {
    const expense = await Expense.findById(id).exec();

    if (!expense) return res.status(404).send("Expense not found");

    const expenseDate = new Date(expense.date);
    const year = expenseDate.getFullYear();
    const month = expenseDate.getMonth() + 1;

    const budget = await MonthlyBudget.findOne({
      userID: req.user.id,
      year,
      month,
    });

    if (!budget)
      return res
        .status(404)
        .send(
          "Budget for the month in the selected date is not set! Please add budget for that month first."
        );

    budget.expenses -= expense.amount;

    await expense.deleteOne();
    await budget.save();

    res.send("Expense deleted");
  } catch (error) {
    res.status(500).send(error.message);
  }
};
