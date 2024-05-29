import Expense from "../models/expense.js";
import MonthlyBudget from "../models/monthlyBudget.js";
import Category from "../models/category.js";

export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ userID: req.user.id }).sort({
      date: -1,
    });

    if (!expenses?.length) {
      return res.status(400).send("No expenses found");
    }

    res.send(expenses);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const addExpense = async (req, res) => {
  const { amount, category, description, date } = req.body;

  const expenseDate = new Date(date);
  const year = expenseDate.getFullYear();
  const month = expenseDate.getMonth() + 1;

  try {
    const budget = await MonthlyBudget.findOne({
      userID: req.user.id,
      year,
      month,
    });

    if (!budget) return res.status(404).send("Monthly budget not set");

    if (budget.expenses + amount > budget.budget) {
      return res.status(400).send("Exceeds monthly budget");
    }

    const categoryExists = await Category.findOne({
      _id: category,
      userID: req.user.id,
    });

    if (!categoryExists) return res.status(404).send("Category not found");

    const newExpense = new Expense({
      user: req.user.id,
      amount,
      category,
      description,
      date,
    });
    budget.expenses += amount;

    await newExpense.save();
    await budget.save();

    res.status(201).send(newExpense);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const updateExpense = async (req, res) => {
  const { id } = req.params;
  const { amount, category, description, date } = req.body;

  try {
    const expense = await Expense.findById(id).exec();

    if (!expense) return res.status(404).send("Expense not found");

    const oldAmount = expense.amount;
    const newAmount = amount;
    const expenseDate = new Date(date);
    const year = expenseDate.getFullYear();
    const month = expenseDate.getMonth() + 1;

    const budget = await MonthlyBudget.findOne({
      userID: req.user.id,
      year,
      month,
    });

    if (!budget) return res.status(404).send("Monthly budget not set");

    if (budget.expenses - oldAmount + newAmount > budget.budget) {
      return res.status(400).send("Exceeds monthly budget");
    }

    const categoryExists = await Category.findOne({
      _id: category,
      userID: req.user.id,
    });

    if (!categoryExists) return res.status(404).send("Category not found");

    expense.amount = newAmount;
    expense.category = category;
    expense.description = description;
    expense.date = date;
    budget.expenses = budget.expenses - oldAmount + newAmount;

    await expense.save();
    await budget.save();

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

    if (!budget) return res.status(404).send("Monthly budget not set");

    budget.expenses -= expense.amount;

    await expense.deleteOne();
    await budget.save();

    res.send("Expense deleted");
  } catch (error) {
    res.status(500).send(error.message);
  }
};
