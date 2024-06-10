import { PieChart, Pie, Tooltip, Cell } from "recharts";
import { useGetExpensesByCategoryQuery } from "../../redux/api/dashboardApiSlice";
import { Box, CircularProgress, Typography } from "@mui/material";

const ExpensesByCategory = () => {
  const { data, isLoading, isError, error } = useGetExpensesByCategoryQuery();

  // Function to generate a random color in hexadecimal format
  const getRandomColor = () => {
    const letters = "0123456789ABCDEFabcdef";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // Generate random colors based on the number of categories
  const generateColors = (count) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      colors.push(getRandomColor());
    }
    return colors;
  };

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

  return data && data.length > 0 ? (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Expenses By Category
      </Typography>
      <PieChart width={400} height={400}>
        <Pie
          dataKey="totalAmount"
          isAnimationActive={false}
          data={data}
          cx={200}
          cy={200}
          outerRadius={80}
          fill="#8884d8"
          label={({ category }) => category}
        >
          {data?.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={generateColors(data.length)[index]}
            />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name, props) => {
            const category = props.payload.category;
            return [`${value}`, `${category}`];
          }}
        />
      </PieChart>
    </Box>
  ) : (
    <Typography variant="h6" color="error" sx={{ textAlign: "center", mt: 3 }}>
      No data available
    </Typography>
  );
};

export default ExpensesByCategory;
