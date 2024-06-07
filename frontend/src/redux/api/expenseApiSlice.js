import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";

const expenseAdapter = createEntityAdapter({});

const initialState = expenseAdapter.getInitialState();

export const expenseApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getExpenseYears: builder.query({
      query: () => ({
        url: "/expense/years",
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        return responseData; // Assuming responseData is an array of years
      },
      providesTags: ["ExpenseYears"],
    }),
    getExpenseMonths: builder.query({
      query: ({ year }) => ({
        url: `/expense/months?year=${year}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        return responseData; // Assuming responseData is an array of months
      },
      providesTags: ["ExpenseMonths"],
    }),
    getExpenses: builder.query({
      query: ({ year, month }) => ({
        url: `/expense?year=${year}&month=${month}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedExpenses = responseData.map((expense) => {
          expense.id = expense._id;
          return expense;
        });
        return expenseAdapter.setAll(initialState, loadedExpenses);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Expense", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Expense", id })),
          ];
        } else return [{ type: "Expense", id: "LIST" }];
      },
    }),
    addNewExpense: builder.mutation({
      query: (newExpense) => ({
        url: "/expense",
        method: "POST",
        body: {
          ...newExpense,
        },
      }),
      invalidatesTags: [
        { type: "Expense", id: "LIST" },
        { type: "ExpenseYears" },
        { type: "ExpenseMonths" },
        { type: "Budget", id: "LIST" },
      ],
    }),
    updateExpense: builder.mutation({
      query(data) {
        const { updatedExpense, id } = data;
        return {
          url: `/expense/${id}`,
          method: "PUT",
          body: {
            ...updatedExpense,
          },
        };
      },
      invalidatesTags: (result, error, arg) => [
        { type: "Expense", id: arg.id },
        { type: "ExpenseYears" },
        { type: "ExpenseMonths" },
        { type: "Budget", id: "LIST" },
      ],
    }),
    deleteExpense: builder.mutation({
      query: (id) => ({
        url: `/expense/${id}`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Expense", id: arg.id },
        { type: "ExpenseYears" },
        { type: "ExpenseMonths" },
        { type: "Budget", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetExpenseYearsQuery,
  useGetExpenseMonthsQuery,
  useGetExpensesQuery,
  useAddNewExpenseMutation,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
} = expenseApiSlice;

// returns the query result object
export const selectExpenseResult =
  expenseApiSlice.endpoints.getExpenses.select();

// creates memoized selector
const selectExpenseData = createSelector(
  selectExpenseResult,
  (expenseResult) => expenseResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllExpenses,
  selectById: selectExpenseById,
  selectIds: selectExpenseIds,
  // Pass in a selector that returns the expense slice of state
} = expenseAdapter.getSelectors(
  (state) => selectExpenseData(state) ?? initialState
);
