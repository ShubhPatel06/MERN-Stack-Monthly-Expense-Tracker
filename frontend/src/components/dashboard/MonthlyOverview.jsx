import { blue, green, red } from "@mui/material/colors";
import { useGetMonthlyOverviewQuery } from "../../redux/api/dashboardApiSlice";

import {
  Container,
  Paper,
  Typography,
  Grid,
  Box,
  CircularProgress,
} from "@mui/material";
import { monthNames } from "../shared/months";

const MonthlyOverview = () => {
  const {
    data: overview,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetMonthlyOverviewQuery();

  if (isLoading) {
    return (
      <Container>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container sx={{ mt: 3 }}>
        <Typography variant="h6" color="error" sx={{ textAlign: "center" }}>
          {error?.data}
        </Typography>
      </Container>
    );
  }

  if (!overview) {
    return (
      <Container>
        <Typography variant="h6" sx={{ textAlign: "center" }}>
          No data available
        </Typography>
      </Container>
    );
  }

  const monthName = monthNames[overview?.budgetDetails?.month - 1];

  return (
    isSuccess && (
      <Container>
        <Typography variant="h5" sx={{ my: 3 }}>
          {`Budget Overview for ${monthName} ${overview?.budgetDetails.year}`}
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Paper elevation={3} sx={{ p: "16px" }}>
              <Typography
                variant="h5"
                sx={{ textAlign: "center", mb: 1, color: blue[500] }}
              >
                {overview.totalBudget}
              </Typography>
              <Typography variant="body1" sx={{ textAlign: "center" }}>
                Total Budget
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper elevation={3} sx={{ p: "16px" }}>
              <Typography
                variant="h5"
                sx={{ textAlign: "center", mb: 1, color: red[500] }}
              >
                {overview.totalExpenses}
              </Typography>
              <Typography variant="body1" sx={{ textAlign: "center" }}>
                Total Expenses
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper elevation={3} sx={{ p: "16px" }}>
              <Typography
                variant="h5"
                sx={{ textAlign: "center", mb: 1, color: green[500] }}
              >
                {overview.remainingBudget}
              </Typography>
              <Typography variant="body1" sx={{ textAlign: "center" }}>
                Remaining Budget
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    )
  );
};

export default MonthlyOverview;
