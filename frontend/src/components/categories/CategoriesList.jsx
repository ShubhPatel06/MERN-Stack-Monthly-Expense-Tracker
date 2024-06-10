import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useGetCategoriesQuery } from "../../redux/api/categoryApiSlice";
import Category from "./Category";

const CategoriesList = ({ setCategory }) => {
  const {
    data: categories,
    isLoading,
    isError,
    error,
  } = useGetCategoriesQuery("categoriesList", {
    refetchOnMountOrArgChange: true,
  });

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Typography
        variant="h6"
        color="error"
        sx={{ textAlign: "center", mt: 3 }}
      >
        {error?.data}
      </Typography>
    );
  }

  return (
    <>
      <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
        Categories
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
            {categories?.ids?.length > 0 ? (
              categories?.ids?.map((categoryId) => (
                <Category
                  key={categoryId}
                  categoryId={categoryId}
                  setCategory={setCategory}
                />
              ))
            ) : (
              <TableRow>
                <TableCell align="center" colSpan={2}>
                  No categories available. Please add a category.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default CategoriesList;
