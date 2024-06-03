import MonthlyBudget from "../models/monthlyBudget.js";

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
export const getBudget = async (req, res) => {
  try {
    const budgets = await MonthlyBudget.find({
      userID: req.user.id,
    });
    if (!budgets || budgets.length === 0)
      return res.status(404).send("No budgets found");
    res.send(budgets);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const setBudget = async (req, res) => {
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
  const { id } = req.params;
  const { budget, year, month } = req.body;

  try {
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
