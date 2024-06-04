import { Box } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import CategoriesList from "./CategoriesList";
import AddCategory from "./AddCategory";
import { useState } from "react";

const Categories = () => {
  const [category, setCategory] = useState({
    name: "",
  });
  return (
    <Box sx={{ flexGrow: 1, m: 6 }}>
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <CategoriesList setCategory={setCategory} />
        </Grid>
        <Grid xs={12} md={4}>
          <AddCategory category={category} setCategory={setCategory} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Categories;
