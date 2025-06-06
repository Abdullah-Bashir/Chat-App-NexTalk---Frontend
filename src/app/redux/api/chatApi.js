import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Set up the base URL to the backend API (replace with your own backend URL if different)
const API_URL = "http://localhost:5000/api/chats";

export const chatApi = createApi({
    reducerPath: 'chatApi',  // A unique name for the reducer slice in the store
    baseQuery: fetchBaseQuery({
        baseUrl: API_URL,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("authToken");  // Retrieve token from local storage
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);  // Add token to headers for authentication
            }
            return headers;
        },
    }),

    endpoints: (builder) => ({

        // 1️⃣ Create or get existing chat
        createChat: builder.mutation({
            query: ({ users, isGroupChat, groupName }) => ({
                url: '/',
                method: 'POST',
                body: { users, isGroupChat, groupName }, // Send the required data in the body
            }),
        }),

        // 2️⃣ Send a message in a chat
        sendMessage: builder.mutation({
            query: ({ chatId, text }) => ({
                url: `/${chatId}/message`,  // Endpoint to send a message to a specific chat
                method: 'POST',
                body: { text },
            }),
        }),

        // 3️⃣ Get messages from a specific chat
        getMessages: builder.query({
            query: (chatId) => ({
                url: `/${chatId}/messages`,  // Endpoint to fetch all messages in a specific chat
                method: 'GET',
            }),
        }),

        // 4️⃣ Get all chats for a user
        getUserChats: builder.query({
            query: () => ({
                url: '/',  // Endpoint to fetch all chats for the logged-in user
                method: 'GET',
            }),
        }),


    }),
});

// Export auto-generated hooks for the API
export const {
    useCreateChatMutation,
    useSendMessageMutation,
    useGetMessagesQuery,
    useGetUserChatsQuery,
} = chatApi;

