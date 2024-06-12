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

  return (
    <Box
      sx={{
        padding: 3,
        mx: 1,
        border: "1px solid #e0e0e0",
        borderRadius: "0.2rem",
      }}
    >
      <Typography variant="h6" sx={{ mb: 3 }}>
        Expenses By Category
      </Typography>
      {data && data.length > 0 ? (
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
      ) : (
        <Typography
          variant="h6"
          color="error"
          sx={{ textAlign: "center", mt: 3 }}
        >
          No data available.Please add some expenses.
        </Typography>
      )}
    </Box>
  );
};

export default ExpensesByCategory;
