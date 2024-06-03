import PulseLoader from "react-spinners/PulseLoader";
import { useGetBudgetsQuery } from "../../redux/api/budgetApiSlice";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Typography } from "@mui/material";
import Budget from "./Budget";

const BudgetsList = ({ setBudget }) => {
  const {
    data: budgets,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetBudgetsQuery("budgetsList");

  if (isLoading) return <PulseLoader />;

  if (isError) return <p>{error?.data}</p>;

  if (isSuccess) {
    const { ids } = budgets;

    return (
      <>
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          {ids.length > 0 ? "Monthly Budgets" : "No budget added yet"}
        </Typography>
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
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ids.map((budgetId) => (
                <Budget
                  key={budgetId}
                  budgetId={budgetId}
                  setBudget={setBudget}
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

export default BudgetsList;
