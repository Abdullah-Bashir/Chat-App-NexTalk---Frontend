// redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../redux/api/authApi"; // adjust the import path as needed

export const store = configureStore({
    reducer: {
        // Add the generated reducer as a specific top-level slice
        [authApi.reducerPath]: authApi.reducer,
    },
    // Adding the api middleware enables caching, invalidation, polling, etc.
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(authApi.middleware),
    devTools: process.env.NODE_ENV !== "production",
});

export default store;
