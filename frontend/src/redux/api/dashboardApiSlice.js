import { apiSlice } from "./apiSlice";

export const dashboardApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMonthlyOverview: builder.query({
      query: () => ({
        url: "/dashboard/monthlyOverview",
      }),
    }),
    getYearlyExpenseTrends: builder.query({
      query: ({ year }) => ({
        url: `/dashboard/expenseTrends?year=${year}`,
      }),
    }),
  }),
});

export const { useGetMonthlyOverviewQuery, useGetYearlyExpenseTrendsQuery } =
  dashboardApiSlice;
