import BudgetExpenseTrends from "./BudgetExpenseTrends";
import ExpenseTrends from "./ExpenseTrends";
import ExpensesByCategory from "./ExpensesByCategory";
import MonthlyOverview from "./MonthlyOverview";
import Grid from "@mui/material/Unstable_Grid2";

const Dashboard = () => {
  return (
    <>
      <MonthlyOverview />

      <Grid container spacing={2} sx={{ mt: 3 }}>
        <Grid xs={12} md={4}>
          <ExpensesByCategory />
        </Grid>
        <Grid xs={12} md={8}>
          <BudgetExpenseTrends />
        </Grid>
      </Grid>

      <ExpenseTrends />
    </>
  );
};

export default Dashboard;
