import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useEffect } from "react";
import {
  useAddNewBudgetMutation,
  useUpdateBudgetMutation,
} from "../../redux/api/budgetApiSlice";
import { toast } from "react-toastify";
import PulseLoader from "react-spinners/PulseLoader";

const AddBudget = ({ budget, setBudget }) => {
  const [addNewBudget, { isLoading, isSuccess: addSuccess, isError, error }] =
    useAddNewBudgetMutation();

  const [
    updateBudget,
    {
      isLoading: updateIsLoading,
      isSuccess: updateIsSuccess,
      isError: updateHasError,
      error: updateError,
    },
  ] = useUpdateBudgetMutation();

  useEffect(() => {
    if (addSuccess) {
      toast.success("Budget Added!");
      setBudget({
        budget: "",
        year: "",
        month: "",
      });
    }
  }, [addSuccess, setBudget]);

  useEffect(() => {
    if (updateIsSuccess) {
      toast.success("Budget updated!");
      setBudget({
        budget: "",
        year: "",
        month: "",
      });
    }
  }, [updateIsSuccess, setBudget]);

  useEffect(() => {
    if (isError || updateHasError) {
      const errorMessage = error?.data || updateError?.data;

      if (errorMessage) {
        toast.error(errorMessage);
      }
    }
  }, [isError, updateHasError, error, updateError]);

  const handleChange = (date, field) => {
    setBudget({
      ...budget,
      [field]: date,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const year = budget.year.getFullYear(); // Extract only the year
    const month = budget.month.getMonth() + 1; // Extract only the month (getMonth() returns 0-11)

    if (budget._id) {
      const id = budget._id;

      const updatedBudget = {
        budget: budget.budget,
        year: year,
        month: month,
      };

      await updateBudget({ updatedBudget, id });
    } else {
      const data = {
        budget: budget.budget,
        year: year,
        month: month,
      };

      await addNewBudget(data);
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
        Add/Update Budget
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="budget"
          label="Budget Amount"
          name="budget"
          value={budget.budget}
          onChange={(e) => setBudget({ ...budget, budget: e.target.value })}
        />
        <Box sx={{ mt: 2, width: "100%" }}>
          <DatePicker
            dateFormat="yyyy"
            showYearPicker
            wrapperClassName="datePicker"
            selected={budget.year !== "" ? budget.year : null}
            onChange={(date) => handleChange(date, "year")}
            customInput={
              <TextField
                required
                fullWidth
                label="Select Year"
                variant="outlined"
                value={budget.year}
              />
            }
          />
        </Box>
        <Box sx={{ mt: 3, mb: 2, width: "100%" }}>
          <DatePicker
            dateFormat="MM"
            showMonthYearPicker
            wrapperClassName="datePicker"
            selected={budget.month !== "" ? budget.month : null}
            onChange={(date) => handleChange(date, "month")}
            customInput={
              <TextField
                required
                fullWidth
                label="Select Month"
                variant="outlined"
                value={budget.month}
              />
            }
          />
        </Box>
        <Button
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

export default AddBudget;
