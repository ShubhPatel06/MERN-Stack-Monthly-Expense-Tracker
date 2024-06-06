import PulseLoader from "react-spinners/PulseLoader";
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
import { Box, MenuItem, Select, Typography } from "@mui/material";
import Budget from "./Budget";
import { useEffect, useState } from "react";

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
    isSuccess,
    isError,
    error,
  } = useGetBudgetsQuery(
    { budgetsList: "budgetsList", year: selectedYear },
    {
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

  if (isError || yearsError) return <p>{error?.data || yearsErrorMsg?.data}</p>;

  if (isSuccess) {
    const { ids } = budgets;

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
          <Typography component="h1" variant="h5">
            {ids.length > 0 ? "Monthly Budgets" : "No budget added yet"}
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
        </Box>
        {isLoading || yearsLoading ? (
          <PulseLoader />
        ) : (
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
                {ids.map((budgetId) => (
                  <Budget
                    key={budgetId}
                    budgetId={budgetId}
                    setBudget={setBudget}
                    year={selectedYear}
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

export default BudgetsList;
