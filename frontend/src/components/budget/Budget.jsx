import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { useGetBudgetsQuery } from "../../redux/api/budgetApiSlice";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { monthNames } from "../shared/months";

const Budget = ({ budgetId, setBudget, year }) => {
  const { budget } = useGetBudgetsQuery(
    { budgetsList: "budgetsList", year: year },
    {
      selectFromResult: ({ data }) => ({
        budget: data?.entities[budgetId],
      }),
    }
  );

  const handleEdit = () => {
    setBudget({
      ...budget,
      year: new Date(new Date().setFullYear(budget?.year)),
      month: new Date(new Date().setMonth(budget?.month - 1)), // Subtract 1 to match JavaScript's month indexing
    });

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  const monthName = monthNames[budget?.month - 1];

  if (!budget) return null;

  return (
    <TableRow key={budget._id}>
      <TableCell align="center">{budget.year}</TableCell>
      <TableCell align="center">{monthName}</TableCell>
      <TableCell align="center">{budget.budget}</TableCell>
      <TableCell align="center">{budget.expenses}</TableCell>
      <TableCell align="center">{budget.budget - budget.expenses}</TableCell>
      <TableCell component="th" scope="row" align="center">
        <IconButton
          onClick={() => handleEdit()}
          sx={{
            backgroundColor: "green",
            "&:hover": {
              backgroundColor: "darkgreen",
            },
            color: "white",
            borderRadius: "0.2rem",
            width: "30px",
            height: "30px",
          }}
        >
          <EditIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default Budget;
