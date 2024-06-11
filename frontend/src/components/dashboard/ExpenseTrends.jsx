import {
  Box,
  CircularProgress,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useGetBudgetYearsQuery } from "../../redux/api/budgetApiSlice";
import { useGetYearlyBudgetQuery } from "../../redux/api/dashboardApiSlice";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { monthNames } from "../shared/months";

const ExpenseTrends = () => {
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
    trends?.map((item) => ({
      month: monthNames[item?.month - 1],
      expenses: item?.expenses,
    })) || [];

  return (
    <Box
      sx={{
        p: 3,
        mt: 2,
        mx: 1,
        border: "1px solid #e0e0e0",
        borderRadius: "0.2rem",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
          overflowX: "hidden",
        }}
      >
        <Typography variant="h6">Yearly Expense Trends</Typography>
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
        <Typography
          variant="h6"
          color="error"
          sx={{ textAlign: "center", mt: 3 }}
        >
          No data available
        </Typography>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              label={{
                value: "Month",
                position: "insideBottom",
                offset: -5,
              }}
            />
            <YAxis
              label={{
                value: "Expenses",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="expenses"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Box>
  );
};

export default ExpenseTrends;
