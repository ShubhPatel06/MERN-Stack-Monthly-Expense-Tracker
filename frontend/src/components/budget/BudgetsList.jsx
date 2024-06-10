import {
  useGetBudgetYearsQuery,
  useGetBudgetsQuery,
} from "../../redux/api/budgetApiSlice";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  Box,
  CircularProgress,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import Budget from "./Budget";
import { useEffect, useState } from "react";
import PulseLoader from "react-spinners/PulseLoader";

const BudgetsList = ({ setBudget }) => {
  const [selectedYear, setSelectedYear] = useState("");

  const {
    data: years,
    isLoading: yearsLoading,
    isSuccess: yearsSuccess,
    isError: yearsError,
    error: yearsErrorMsg,
  } = useGetBudgetYearsQuery();

  const {
    data: budgets,
    isLoading,
    isError,
    error,
  } = useGetBudgetsQuery(
    { budgetsList: "budgetsList", year: selectedYear },
    {
      skip: !selectedYear,
      refetchOnMountOrArgChange: true,
    }
  );

  useEffect(() => {
    if (yearsSuccess && years) {
      const latestYearIndex = years.length - 1;
      const latestYear = years[latestYearIndex];
      setSelectedYear(latestYear);
    }
  }, [yearsSuccess, years]);

  if (yearsLoading) {
    return <PulseLoader />;
  }

  if (isLoading) {
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

  if (isError || yearsError) {
    return (
      <Typography
        variant="h6"
        color="error"
        sx={{ textAlign: "center", mt: 3 }}
      >
        {error?.data || yearsErrorMsg?.data}
      </Typography>
    );
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography component="h1" variant="h5" sx={{ mb: 1 }}>
          Monthly Budgets
        </Typography>
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

      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Year
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Month
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Budget
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Expenses
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Balance
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {budgets?.ids?.length > 0 ? (
              budgets?.ids?.map((budgetId) => (
                <Budget
                  key={budgetId}
                  budgetId={budgetId}
                  setBudget={setBudget}
                  year={selectedYear}
                />
              ))
            ) : (
              <TableRow>
                <TableCell align="center" colSpan={6}>
                  No budgets available. Please add a budget.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default BudgetsList;
