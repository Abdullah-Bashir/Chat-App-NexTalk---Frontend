// src/app/redux/api/socketApi.js
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import socket from '@/lib/socket';

export const socketApi = createApi({
    reducerPath: 'socketApi',
    baseQuery: fakeBaseQuery(),
    endpoints: (builder) => ({

        getOnlineUsers: builder.query({
            queryFn() {
                return { data: [] };
            },
            async onCacheEntryAdded(arg, { updateCachedData, cacheEntryRemoved }) {
                if (!socket.connected) {
                    socket.connect();
                }

                const handleOnlineUsers = (onlineUserIds) => {
                    updateCachedData(() => onlineUserIds);
                };

                socket.on('online-users', handleOnlineUsers);

                const userId = localStorage.getItem('userId');
                if (userId) {
                    socket.emit('add-user', userId);
                }

                await cacheEntryRemoved;
                socket.off('online-users', handleOnlineUsers);
            },
        }),

        // Add new endpoint for real-time messages
        getMessages: builder.query({
            queryFn() {
                return { data: [] };
            },
            async onCacheEntryAdded(chatId, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
                if (!socket.connected) {
                    socket.connect();
                }

                await cacheDataLoaded;

                const messageListener = (message) => {
                    updateCachedData((draft) => {
                        draft.push(message);
                    });
                };

                socket.on(`chat-${chatId}`, messageListener);

                await cacheEntryRemoved;
                socket.off(`chat-${chatId}`, messageListener);
            },
        }),

    }),
});

export const {
    useGetOnlineUsersQuery,
    useGetMessagesQuery, // Export the new hook
} = socketApi;