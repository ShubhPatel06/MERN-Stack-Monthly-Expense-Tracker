import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
} from "../../redux/api/categoryApiSlice";
import { useEffect } from "react";
import { toast } from "react-toastify";

const Category = ({ categoryId, setCategory }) => {
  const { category } = useGetCategoriesQuery("categoriesList", {
    selectFromResult: ({ data }) => ({
      category: data?.entities[categoryId],
    }),
  });

  const [deleteCategory, { isSuccess, isError, error }] =
    useDeleteCategoryMutation();

  useEffect(() => {
    if (isSuccess) {
      toast.success("Category deleted!");
    }

    if (isError) {
      toast.error(error?.data);
    }
  }, [isSuccess, isError, error]);

  const handleEdit = () => {
    setCategory(category);

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    await deleteCategory(id);
  };

  if (!category) return null;

  return (
    <TableRow key={category._id}>
      <TableCell align="center">{category.name}</TableCell>
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
          onClick={() => handleDelete(category._id)}
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

export default Category;
