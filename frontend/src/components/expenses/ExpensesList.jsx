import PulseLoader from "react-spinners/PulseLoader";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box, MenuItem, Select, Typography } from "@mui/material";
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
  } = useGetExpenseMonthsQuery({ year: selectedYear });

  console.log(months);

  const {
    data: expenses,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetExpensesQuery("expensesList", {
    refetchOnMountOrArgChange: true,
  });

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

  if (isError || yearsError || monthsError)
    return <p>{error?.data || yearsErrorMsg?.data || monthsErrorMsg?.data}</p>;

  if (isSuccess) {
    const { ids } = expenses;

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
          {years && (
            <Select
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(e.target.value);
              }}
            >
              {years.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          )}
          {months && (
            <Select
              value={selectedYear}
              onChange={(e) => {
                setSelectedMonth(e.target.value);
              }}
            >
              {months.map((month) => (
                <MenuItem key={month} value={month}>
                  {month}
                </MenuItem>
              ))}
            </Select>
          )}
        </Box>
        {isLoading || yearsLoading || monthsLoading ? (
          <PulseLoader />
        ) : (
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
                {ids.map((expenseId) => (
                  <Expense
                    key={expenseId}
                    expenseId={expenseId}
                    setExpense={setExpense}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </>
    );
  }

  return null;
};

export default ExpensesList;
