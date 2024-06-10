import { useEffect, useState } from "react";
import { useGetBudgetYearsQuery } from "../../redux/api/budgetApiSlice";
import { useGetYearlyBudgetQuery } from "../../redux/api/dashboardApiSlice";
import {
  Box,
  CircularProgress,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { monthNames } from "../shared/months";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const BudgetExpenseTrends = () => {
  const [selectedYear, setSelectedYear] = useState("");

  const {
    data: years,
    isLoading: yearsLoading,
    isSuccess: yearsSuccess,
    isError: yearsError,
    error: yearsErrorMsg,
  } = useGetBudgetYearsQuery();

  const {
    data: trends,
    isLoading: trendsLoading,
    isError: trendsError,
    error: trendsErrorMsg,
  } = useGetYearlyBudgetQuery({ year: selectedYear }, { skip: !selectedYear });

  useEffect(() => {
    if (yearsSuccess && years.length > 0) {
      const latestYear = years[years.length - 1];
      setSelectedYear(latestYear);
    }
  }, [yearsSuccess, years]);

  if (trendsLoading || yearsLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (yearsError || trendsError) {
    return (
      <Typography variant="h6" color="error">
        {yearsErrorMsg?.data || trendsErrorMsg?.data || "Error fetching data"}
      </Typography>
    );
  }

  const chartData =
    trends?.map((budget) => ({
      month: monthNames[budget?.month - 1],
      amount: budget.budget,
      expense: budget.expenses,
    })) || [];

  return (
    <Box sx={{ px: 4 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography variant="h6">Budget and Expense Trends</Typography>
        {years && years.length > 0 ? (
          <Select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            {years.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        ) : (
          <Typography variant="body1" color="textSecondary">
            No years available.
          </Typography>
        )}
      </Box>
      {chartData.length === 0 ? (
        <Typography variant="h6" color="textSecondary">
          No data available.
        </Typography>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="amount" fill="#8884d8" name="Budget" />
            <Bar dataKey="expense" fill="#82ca9d" name="Expense" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Box>
  );
};

export default BudgetExpenseTrends;
