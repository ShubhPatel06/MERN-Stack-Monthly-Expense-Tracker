import {
  Box,
  CircularProgress,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useGetBudgetYearsQuery } from "../../redux/api/budgetApiSlice";
import { useGetYearlyExpenseTrendsQuery } from "../../redux/api/dashboardApiSlice";
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
  } = useGetYearlyExpenseTrendsQuery(
    { year: selectedYear },
    { skip: !selectedYear }
  );

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

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];

  const chartData =
    trends?.map((item) => ({
      month: monthNames[item?.month - 1],
      expenses: item?.expenses,
    })) || [];

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 3,
          justifyContent: "space-between",
          mb: 2,
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
        <Typography variant="h6" color="textSecondary">
          No data available for the selected year.
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
    </>
  );
};

export default ExpenseTrends;
