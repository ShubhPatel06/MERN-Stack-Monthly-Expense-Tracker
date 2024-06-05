import { Box } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { useState } from "react";
import ExpensesList from "./ExpensesList";
import AddExpense from "./AddExpense";

const Expenses = () => {
  const [expense, setExpense] = useState({
    amount: "",
    description: "",
    category: "",
    date: new Date(),
  });

  return (
    <Box sx={{ flexGrow: 1, m: 6 }}>
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <ExpensesList setExpense={setExpense} />
        </Grid>
        <Grid xs={12} md={4}>
          <AddExpense expense={expense} setExpense={setExpense} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Expenses;
