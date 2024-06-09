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

const ExpensesList = ({ setExpense }) => {
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

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
    isSuccess,
    isError,
    error,
  } = useGetExpensesQuery(
    { expensesList: "expensesList", year: selectedYear, month: selectedMonth },
    {
      skip: !selectedMonth,
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

  useEffect(() => {
    if (monthsSuccess && months) {
      const latestMonthIndex = months.length - 1;
      const latestMonth = months[latestMonthIndex];
      setSelectedMonth(latestMonth);
    }
  }, [monthsSuccess, months]);

  if (isLoading || yearsLoading || monthsLoading) {
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

  if (isError || yearsError || monthsError)
    return <p>{error?.data || yearsErrorMsg?.data || monthsErrorMsg?.data}</p>;

  if (isSuccess) {
    const { ids } = expenses;

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

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
          <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
            {ids.length > 0 ? "Monthly Expenses" : "No expenses added yet"}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            {years && years.length > 0 ? (
              <Select
                value={selectedYear}
                onChange={(e) => {
                  setSelectedMonth("");
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
              {ids.length > 0 ? (
                ids.map((expenseId) => (
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
                    No expenses available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    );
  }

  return null;
};

export default ExpensesList;
