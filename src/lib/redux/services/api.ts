import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    // baseUrl: "http://localhost:5000",
    baseUrl: "https://backend-delta-eight-70.vercel.app",
    credentials: "include",
  }),
  tagTypes: ["Product", "Auth"],
  endpoints: () => ({}),
});
