import { apiSlice } from "./apiSlice";

export const dashboardApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMonthlyOverview: builder.query({
      query: () => ({
        url: "/dashboard/monthlyOverview",
      }),
    }),
    getYearlyBudget: builder.query({
      query: ({ year }) => ({
        url: `/dashboard/expenseTrends?year=${year}`,
      }),
    }),
    getExpensesByCategory: builder.query({
      query: () => ({
        url: `/dashboard/expensesByCategory`,
      }),
    }),
  }),
});

export const {
  useGetMonthlyOverviewQuery,
  useGetYearlyBudgetQuery,
  useGetExpensesByCategoryQuery,
} = dashboardApiSlice;
