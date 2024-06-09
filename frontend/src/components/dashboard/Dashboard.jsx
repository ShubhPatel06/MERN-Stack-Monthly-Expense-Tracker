import ExpenseTrends from "./ExpenseTrends";
import MonthlyOverview from "./MonthlyOverview";
import Grid from "@mui/material/Unstable_Grid2";

const Dashboard = () => {
  return (
    <>
      <MonthlyOverview />
      <Grid container spacing={3} sx={{ mt: 3, p: 4 }}>
        <Grid xs={12}>
          <ExpenseTrends />
        </Grid>
      </Grid>
    </>
  );
};

export default Dashboard;
