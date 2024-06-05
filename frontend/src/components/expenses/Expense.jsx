import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  useDeleteExpenseMutation,
  useGetExpensesQuery,
} from "../../redux/api/expenseApiSlice";
import { useEffect } from "react";
import { toast } from "react-toastify";

const Expense = ({ expenseId, setExpense }) => {
  const { expense } = useGetExpensesQuery("expensesList", {
    selectFromResult: ({ data }) => ({
      expense: data?.entities[expenseId],
    }),
  });

  const [deleteExpense, { isSuccess, isError, error }] =
    useDeleteExpenseMutation();

  useEffect(() => {
    if (isSuccess) {
      toast.success("Expense deleted!");
    }

    if (isError) {
      toast.error(error?.data);
    }
  }, [isSuccess, isError, error]);

  const handleEdit = () => {
    setExpense({ ...expense, category: expense.category._id });

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    await deleteExpense(id);
  };

  if (!expense) return null;

  return (
    <TableRow key={expense._id}>
      <TableCell align="center">{expense.amount}</TableCell>
      <TableCell align="center">{expense.description}</TableCell>
      <TableCell align="center">{expense.category.name}</TableCell>
      <TableCell align="center">
        {new Date(expense.date).toLocaleDateString()}
      </TableCell>
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
            marginRight: "0.8rem",
          }}
        >
          <EditIcon />
        </IconButton>
        <IconButton
          onClick={() => handleDelete(expense._id)}
          sx={{
            backgroundColor: "red",
            "&:hover": {
              backgroundColor: "darkred",
            },
            color: "white",
            borderRadius: "0.2rem",
            width: "30px",
            height: "30px",
          }}
        >
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default Expense;
