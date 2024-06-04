import PulseLoader from "react-spinners/PulseLoader";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Typography } from "@mui/material";
import { useGetCategoriesQuery } from "../../redux/api/categoryApiSlice";
import Category from "./Category";

const CategoriesList = ({ setCategory }) => {
  const {
    data: categories,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetCategoriesQuery("categoriesList");

  if (isLoading) return <PulseLoader />;

  if (isError) return <p>{error?.data}</p>;

  if (isSuccess) {
    const { ids } = categories;

    return (
      <>
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          {ids.length > 0 ? "Monthly Categories" : "No categories added yet"}
        </Typography>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Category
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ids.map((categoryId) => (
                <Category
                  key={categoryId}
                  categoryId={categoryId}
                  setCategory={setCategory}
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

export default CategoriesList;
