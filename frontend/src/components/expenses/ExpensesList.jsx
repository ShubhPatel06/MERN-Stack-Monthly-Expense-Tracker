import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  Box,
  MenuItem,
  Select,
  Typography,
  CircularProgress,
} from "@mui/material";
import {
  useGetExpenseMonthsQuery,
  useGetExpenseYearsQuery,
  useGetExpensesQuery,
} from "../../redux/api/expenseApiSlice";
import Expense from "./Expense";
import { useEffect, useState } from "react";
import PulseLoader from "react-spinners/PulseLoader";
import { monthNames } from "../shared/months";

const ExpensesList = ({ setExpense }) => {
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [monthsLoaded, setMonthsLoaded] = useState(false);

  const {
    data: years,
    isLoading: yearsLoading,
    isSuccess: yearsSuccess,
    isError: yearsError,
    error: yearsErrorMsg,
  } = useGetExpenseYearsQuery();

  const {
    data: months,
    isLoading: monthsLoading,
    isSuccess: monthsSuccess,
    isError: monthsError,
    error: monthsErrorMsg,
  } = useGetExpenseMonthsQuery({ year: selectedYear }, { skip: !selectedYear });

  const {
    data: expenses,
    isLoading,
    isError,
    error,
  } = useGetExpensesQuery(
    { expensesList: "expensesList", year: selectedYear, month: selectedMonth },
    {
      skip: !monthsLoaded && !selectedMonth,
      refetchOnMountOrArgChange: true,
    }
  );

  useEffect(() => {
    if (yearsSuccess && years.length > 0) {
      const latestYearIndex = years.length - 1;
      const latestYear = years[latestYearIndex];
      setSelectedYear(latestYear);
    }
  }, [yearsSuccess, years]);

  useEffect(() => {
    if (monthsSuccess && months.length > 0) {
      const latestMonthIndex = months.length - 1;
      const latestMonth = months[latestMonthIndex];
      setSelectedMonth(latestMonth);

      setTimeout(() => {
        setMonthsLoaded(true);
      }, 500);
    } else {
      setTimeout(() => {
        setMonthsLoaded(true);
      }, 500);
    }
  }, [monthsSuccess, months]);

  if (yearsLoading || monthsLoading || !monthsLoaded) {
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

  if (isError || yearsError || monthsError) {
    return (
      <Typography
        variant="h6"
        color="error"
        sx={{ textAlign: "center", mt: 3 }}
      >
        {error?.data || yearsErrorMsg?.data || monthsErrorMsg?.data}
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
          Monthly Expenses
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          {years && years.length > 0 ? (
            <Select
              value={selectedYear}
              onChange={(e) => {
                setSelectedMonth("");
                setMonthsLoaded(false);
                setSelectedYear(e.target.value);
              }}
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

          {years.length > 0 && months && months.length > 0 ? (
            <Select
              value={selectedMonth}
              onChange={(e) => {
                setSelectedMonth(e.target.value);
              }}
            >
              {months.map((month) => (
                <MenuItem key={month} value={month}>
                  {monthNames[month - 1]}
                </MenuItem>
              ))}
            </Select>
          ) : (
            <Typography variant="body1" color="textSecondary">
              No months available.
            </Typography>
          )}
        </Box>
      </Box>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Expense Amount
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Description
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Category
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Date Added
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expenses?.ids?.length > 0 ? (
              expenses?.ids?.map((expenseId) => (
                <Expense
                  key={expenseId}
                  expenseId={expenseId}
                  setExpense={setExpense}
                  year={selectedYear}
                  month={selectedMonth}
                />
              ))
            ) : (
              <TableRow>
                <TableCell align="center" colSpan={5}>
                  No expenses available. Please add an expense.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default ExpensesList;
