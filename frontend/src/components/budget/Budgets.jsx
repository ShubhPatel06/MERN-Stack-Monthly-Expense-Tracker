import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import AddBudget from "./AddBudget";
import BudgetsList from "./BudgetsList";
import { useState } from "react";

const Budgets = () => {
  const [budget, setBudget] = useState({
    budget: "",
    year: new Date(),
    month: new Date(),
  });

  return (
    <Box sx={{ flexGrow: 1, m: 6 }}>
      <Grid container spacing={2}>
        <Grid xs={12} md={8}>
          <BudgetsList />
        </Grid>
        <Grid xs={12} md={4}>
          <AddBudget budget={budget} setBudget={setBudget} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Budgets;
