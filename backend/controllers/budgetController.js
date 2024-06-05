import MonthlyBudget from "../models/monthlyBudget.js";
import Joi from "joi";

export const getBudgetYears = async (req, res) => {
  try {
    const distinctYears = await MonthlyBudget.distinct("year", {
      userID: req.user.id,
    });
    if (!distinctYears || distinctYears.length === 0)
      return res.status(404).send("No budgets found");

    res.send(distinctYears);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// export const getBudget = async (req, res) => {
//   const { year, month } = req.query;
//   try {
//     const budget = await MonthlyBudget.findOne({
//       userID: req.user.id,
//       year,
//       month,
//     });
//     if (!budget) return res.status(404).send("Budget not found");
//     res.send(budget);
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// };

// export const getBudget = async (req, res) => {
//   try {
//     const budgets = await MonthlyBudget.find({
//       userID: req.user.id,
//     });
//     if (!budgets || budgets.length === 0)
//       return res.status(404).send("No budgets found");
//     res.send(budgets);
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// };

export const getBudget = async (req, res) => {
  try {
    const { year } = req.query;
    const query = {
      userID: req.user.id,
      ...(year && { year: Number(year) }),
    };
    const budgets = await MonthlyBudget.find(query);
    if (!budgets || budgets.length === 0)
      return res.status(404).send("No budgets found");
    res.send(budgets);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const setBudget = async (req, res) => {
  const schema = Joi.object({
    year: Joi.number().required(),
    month: Joi.number().required().min(1).max(12),
    budget: Joi.number().min(1).required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const { year, month, budget } = req.body;

  try {
    const existingBudget = await MonthlyBudget.findOne({
      userID: req.user.id,
      year,
      month,
    });

    if (existingBudget) {
      return res.status(400).send("Budget already set for this month");
    }

    const newBudget = new MonthlyBudget({
      userID: req.user.id,
      year,
      month,
      budget,
    });

    await newBudget.save();
    res.status(201).send(newBudget);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const updateBudget = async (req, res) => {
  const schema = Joi.object({
    year: Joi.number().required(),
    month: Joi.number().required().min(1).max(12),
    budget: Joi.number().min(1).required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const { id } = req.params;
  const { budget, year, month } = req.body;

  try {
    const existingBudget = await MonthlyBudget.findOne({
      userID: req.user.id,
      year,
      month,
    });

    if (existingBudget) {
      return res.status(400).send("Budget already set for this month");
    }

    const foundBudget = await MonthlyBudget.findById(id).exec();

    if (!foundBudget) {
      return res.status(404).send("Budget not found!");
    }

    if (foundBudget.userID.toString() !== req.user.id.toString()) {
      return res
        .status(401)
        .send("You are not authorized to update this budget!");
    }

    if (foundBudget.expenses > budget) {
      return res
        .status(400)
        .send("Budget is less than expenses! Please add a greater budget");
    }

    foundBudget.budget = budget;
    foundBudget.year = year;
    foundBudget.month = month;
    const updatedBudget = await foundBudget.save();

    res.send(updatedBudget);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
