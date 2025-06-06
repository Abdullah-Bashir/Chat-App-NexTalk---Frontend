import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./api/authApi";
import { chatApi } from "./api/chatApi";
import { socketApi } from './api/socketApi' // <-- IMPORT HERE


export const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [chatApi.reducerPath]: chatApi.reducer,
        [socketApi.reducerPath]: socketApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(authApi.middleware)
            .concat(chatApi.middleware)
            .concat(socketApi.middleware),
    devTools: process.env.NODE_ENV !== "production",
});

export default store;
