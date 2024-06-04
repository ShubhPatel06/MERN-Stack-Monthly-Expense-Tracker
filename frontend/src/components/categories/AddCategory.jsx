import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import PulseLoader from "react-spinners/PulseLoader";
import {
  useAddNewCategoryMutation,
  useUpdateCategoryMutation,
} from "../../redux/api/categoryApiSlice";
import { useEffect } from "react";
import { toast } from "react-toastify";

const AddCategory = ({ category, setCategory }) => {
  const [addNewCategory, { isLoading, isSuccess: addSuccess, isError, error }] =
    useAddNewCategoryMutation();

  const [
    updateCategory,
    {
      isLoading: updateIsLoading,
      isSuccess: updateIsSuccess,
      isError: updateHasError,
      error: updateError,
    },
  ] = useUpdateCategoryMutation();

  useEffect(() => {
    if (addSuccess) {
      toast.success("Category Added!");
      setCategory({
        name: "",
      });
    }
  }, [addSuccess, setCategory]);

  useEffect(() => {
    if (updateIsSuccess) {
      toast.success("Category updated!");
      setCategory({
        name: "",
      });
    }
  }, [updateIsSuccess, setCategory]);

  useEffect(() => {
    if (isError || updateHasError) {
      const errorMessage = error?.data || updateError?.data;

      if (errorMessage) {
        toast.error(errorMessage);
      }
    }
  }, [isError, updateHasError, error, updateError]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (category._id) {
      const id = category._id;

      const updatedCategory = {
        name: category.name,
      };

      await updateCategory({ updatedCategory, id });
    } else {
      await addNewCategory(category);
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
        Add/Update Categories
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="category"
          label="Category Name"
          name="category"
          value={category.name}
          onChange={(e) => setCategory({ ...category, name: e.target.value })}
        />

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

export default AddCategory;
