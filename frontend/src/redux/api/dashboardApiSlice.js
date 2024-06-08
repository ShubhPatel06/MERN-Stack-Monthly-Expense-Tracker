import { apiSlice } from "./apiSlice";

export const dashboardApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMonthlyOverview: builder.query({
      query: () => ({
        url: "/dashboard/monthlyOverview",
      }),
    }),
  }),
});

export const { useGetMonthlyOverviewQuery } = dashboardApiSlice;
