import { logOut } from "../features/auth/authSlice";
import { apiSlice } from "./apiSlice";
import { setCredentials } from "../features/auth/authSlice.js";
import { toast } from "react-toastify";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (signupData) => ({
        url: "/auth/signup",
        method: "POST",
        body: { ...signupData },
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/signin",
        method: "POST",
        body: { ...credentials },
      }),
    }),
    sendLogout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log(data);
          dispatch(logOut());
          setTimeout(() => {
            dispatch(apiSlice.util.resetApiState());
          }, 1000);
        } catch (err) {
          console.log(err);
          toast.error(err?.data?.message);
        }
      },
    }),
    refresh: builder.mutation({
      query: () => ({
        url: "/auth/refresh",
        method: "GET",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const { accessToken } = data;
          dispatch(setCredentials({ accessToken }));
        } catch (err) {
          console.log(err);
          toast.error(err?.data?.message);
        }
      },
    }),
  }),
});

export const {
  useSignupMutation,
  useLoginMutation,
  useSendLogoutMutation,
  useRefreshMutation,
} = authApiSlice;
