import PulseLoader from "react-spinners/PulseLoader";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Typography } from "@mui/material";
import { useGetExpensesQuery } from "../../redux/api/expenseApiSlice";
import Expense from "./Expense";

const ExpensesList = ({ setExpense }) => {
  const {
    data: expenses,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetExpensesQuery("expensesList");

  if (isLoading) return <PulseLoader />;

  if (isError) return <p>{error?.data}</p>;

  if (isSuccess) {
    const { ids } = expenses;

    return (
      <>
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          {ids.length > 0 ? "Monthly Expenses" : "No expenses added yet"}
        </Typography>
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
      </>
    );
  }

  return null;
};

export default ExpensesList;
