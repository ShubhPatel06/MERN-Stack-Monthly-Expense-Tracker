import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";

const categoryAdapter = createEntityAdapter({});

const initialState = categoryAdapter.getInitialState();

export const categoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => ({
        url: "/category",
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedCategories = responseData.map((category) => {
          category.id = category._id;
          return category;
        });
        return categoryAdapter.setAll(initialState, loadedCategories);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Category", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Category", id })),
          ];
        } else return [{ type: "Category", id: "LIST" }];
      },
    }),
    addNewCategory: builder.mutation({
      query: (newCategory) => ({
        url: "/category",
        method: "POST",
        body: {
          ...newCategory,
        },
      }),
      invalidatesTags: [{ type: "Category", id: "LIST" }],
    }),
    updateCategory: builder.mutation({
      query(data) {
        const { updatedCategory, id } = data;
        return {
          url: `/category/${id}`,
          method: "PUT",
          body: {
            ...updatedCategory,
          },
        };
      },
      invalidatesTags: (result, error, arg) => [
        { type: "Category", id: arg.id },
      ],
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/category/${id}`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Category", id: arg.id },
      ],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useAddNewCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApiSlice;

// returns the query result object
export const selectCategoryResult =
  categoryApiSlice.endpoints.getCategories.select();

// creates memoized selector
const selectCategoryData = createSelector(
  selectCategoryResult,
  (categoryResult) => categoryResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllCategories,
  selectById: selectCategoryById,
  selectIds: selectCategoryIds,
  // Pass in a selector that returns the category slice of state
} = categoryAdapter.getSelectors(
  (state) => selectCategoryData(state) ?? initialState
);
