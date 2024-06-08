import { useGetMonthlyOverviewQuery } from "../../redux/api/dashboardApiSlice";

import {
  Container,
  Paper,
  Typography,
  Grid,
  Box,
  CircularProgress,
} from "@mui/material";

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
      <Container>
        <Typography variant="h6" color="error">
          {error?.data}
        </Typography>
      </Container>
    );
  }

  if (!overview) {
    return (
      <Container>
        <Typography variant="h6">No data available</Typography>
      </Container>
    );
  }

  return (
    isSuccess && (
      <Container>
        <Typography variant="h4" sx={{ my: 3 }}>
          Latest Budget Overview
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Paper elevation={3} sx={{ p: "16px" }}>
              <Typography variant="h6">Total Budget</Typography>
              <Typography variant="body1">{overview.totalBudget}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper elevation={3} sx={{ p: "16px" }}>
              <Typography variant="h6">Total Expenses</Typography>
              <Typography variant="body1">{overview.totalExpenses}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper elevation={3} sx={{ p: "16px" }}>
              <Typography variant="h6">Remaining Budget</Typography>
              <Typography variant="body1">
                {overview.remainingBudget}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    )
  );
};

export default MonthlyOverview;
