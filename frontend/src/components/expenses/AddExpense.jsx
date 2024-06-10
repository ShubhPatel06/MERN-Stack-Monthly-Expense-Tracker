import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import PulseLoader from "react-spinners/PulseLoader";
import DatePicker from "react-datepicker";
import {
  useAddNewExpenseMutation,
  useUpdateExpenseMutation,
} from "../../redux/api/expenseApiSlice";
import { useGetCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import { useEffect } from "react";

const AddExpense = ({ expense, setExpense }) => {
  const [addNewExpense, { isLoading, isSuccess: addSuccess, isError, error }] =
    useAddNewExpenseMutation();

  const {
    data: categories,
    isLoading: categoriesLoading,
    isError: categoriesIsError,
    error: categoriesError,
  } = useGetCategoriesQuery("categoriesList");

  const [
    updateExpense,
    {
      isLoading: updateIsLoading,
      isSuccess: updateIsSuccess,
      isError: updateHasError,
      error: updateError,
    },
  ] = useUpdateExpenseMutation();

  useEffect(() => {
    if (addSuccess) {
      toast.success("Expense Added!");
      setExpense({
        amount: "",
        description: "",
        category: "",
        date: new Date(),
      });
    }
  }, [addSuccess, setExpense]);

  useEffect(() => {
    if (updateIsSuccess) {
      toast.success("Expense updated!");
      setExpense({
        amount: "",
        description: "",
        category: "",
        date: new Date(),
      });
    }
  }, [updateIsSuccess, setExpense]);

  useEffect(() => {
    if (isError || categoriesIsError || updateHasError) {
      const errorMessage =
        error?.data || categoriesError?.data || updateError?.data;

      if (errorMessage) {
        toast.error(errorMessage);
      }
    }
  }, [
    isError,
    categoriesIsError,
    error,
    categoriesError,
    updateHasError,
    updateError,
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (expense._id) {
      const id = expense._id;

      const updatedExpense = {
        amount: expense.amount,
        description: expense.description,
        category: expense.category,
        date: expense.date,
      };

      await updateExpense({ updatedExpense, id });
    } else {
      await addNewExpense(expense);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography component="h1" variant="h5">
        Add/Update Expenses
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="amount"
          label="Amount"
          name="amount"
          type="number"
          value={expense.amount}
          onChange={(e) => setExpense({ ...expense, amount: e.target.value })}
        />
        <TextField
          margin="normal"
          fullWidth
          id="description"
          label="Description"
          name="description"
          value={expense.description}
          onChange={(e) =>
            setExpense({ ...expense, description: e.target.value })
          }
        />
        <Box sx={{ mt: 2, width: "100%" }}>
          <DatePicker
            dateFormat="dd-MM-yyy"
            wrapperClassName="datePicker"
            selected={expense.date}
            onChange={(date) => setExpense({ ...expense, date })}
            customInput={
              <TextField
                required
                fullWidth
                label="Select Date"
                variant="outlined"
                value={expense.date}
              />
            }
          />
        </Box>
        {categoriesLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <PulseLoader />
          </Box>
        ) : (
          <FormControl fullWidth margin="normal" required>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              id="category"
              value={expense.category || ""}
              label="Category"
              onChange={(e) =>
                setExpense({ ...expense, category: e.target.value })
              }
            >
              {categories?.ids?.length > 0 ? (
                categories?.ids?.map((id) => (
                  <MenuItem key={id} value={id}>
                    {categories.entities[id].name}
                  </MenuItem>
                ))
              ) : (
                <Typography variant="body1" color="textSecondary">
                  No categories available. Please add a category
                </Typography>
              )}
            </Select>
          </FormControl>
        )}

        <Button
          sx={{ mt: 2 }}
          type="submit"
          fullWidth
          variant="contained"
          disabled={isLoading || updateIsLoading}
        >
          {isLoading || updateIsLoading ? <PulseLoader color="#fff" /> : "Save"}
        </Button>
      </Box>
    </Box>
  );
};

export default AddExpense;
