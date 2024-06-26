import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";

const budgetAdapter = createEntityAdapter({});

const initialState = budgetAdapter.getInitialState();

export const budgetApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBudgetYears: builder.query({
      query: () => ({
        url: "/budget/years",
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        return responseData; // Assuming responseData is an array of years
      },
      providesTags: ["BudgetYears"],
    }),
    getBudgets: builder.query({
      query: ({ year }) => {
        return {
          url: `/budget?year=${year}`,
          validateStatus: (response, result) => {
            return response.status === 200 && !result.isError;
          },
        };
      },
      transformResponse: (responseData) => {
        const loadedBudgets = responseData.map((budget) => {
          budget.id = budget._id;
          return budget;
        });
        return budgetAdapter.setAll(initialState, loadedBudgets);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Budget", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Budget", id })),
          ];
        } else return [{ type: "Budget", id: "LIST" }];
      },
    }),
    addNewBudget: builder.mutation({
      query: (newBudget) => ({
        url: "/budget",
        method: "POST",
        body: {
          ...newBudget,
        },
      }),
      invalidatesTags: [
        { type: "Budget", id: "LIST" },
        { type: "BudgetYears" },
      ],
    }),
    updateBudget: builder.mutation({
      query(data) {
        const { updatedBudget, id } = data;
        return {
          url: `/budget/${id}`,
          method: "PUT",
          body: {
            ...updatedBudget,
          },
        };
      },
      invalidatesTags: (result, error, arg) => [
        { type: "Budget", id: arg.id },
        { type: "BudgetYears" },
      ],
    }),
  }),
});

export const {
  useGetBudgetYearsQuery,
  useGetBudgetsQuery,
  useAddNewBudgetMutation,
  useUpdateBudgetMutation,
} = budgetApiSlice;

// returns the query result object
export const selectBudgetResult = budgetApiSlice.endpoints.getBudgets.select();

// creates memoized selector
const selectBudgetData = createSelector(
  selectBudgetResult,
  (budgetResult) => budgetResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllBudgets,
  selectById: selectBudgetById,
  selectIds: selectBudgetIds,
  // Pass in a selector that returns the budget slice of state
} = budgetAdapter.getSelectors(
  (state) => selectBudgetData(state) ?? initialState
);
