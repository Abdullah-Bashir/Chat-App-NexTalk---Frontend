"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, X, UserPlus } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSyncNextAuthToken } from "@/app/hooks/useSyncNextAuthToken"

import { useGetAllUsersQuery } from "@/app/redux/api/authApi"
import { useCreateChatMutation } from "@/app/redux/api/chatApi"
import { useGetOnlineUsersQuery } from "@/app/redux/api/socketApi"
import { useGetUserChatsQuery } from "@/app/redux/api/chatApi" // <-- import getUserChats

export default function UserList({ currentChat, onChatSelect, onCloseMobileSidebar }) {

    const [createChat] = useCreateChatMutation()
    const [searchTerm, setSearchTerm] = useState("")
    const [isMobile, setIsMobile] = useState(false)
    const [viewAllUsers, setViewAllUsers] = useState(true) // To toggle between all users and user chats

    useSyncNextAuthToken()

    // Fetch all users
    const { data: users = [], isLoading, error } = useGetAllUsersQuery()

    // Fetch online users
    const { data: onlineUserIds = [] } = useGetOnlineUsersQuery()

    // Fetch user's chats
    const { data: chats = [] } = useGetUserChatsQuery()

    const filteredUsers = users.filter((user) =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768)
        }
        checkIfMobile()
        window.addEventListener("resize", checkIfMobile)
        return () => window.removeEventListener("resize", checkIfMobile)
    }, [])

    const handleUserClick = async (user) => {
        try {
            const response = await createChat({
                users: [user._id],
                isGroupChat: false,
            }).unwrap()

            // Access _id inside response.chat
            onChatSelect({
                chatId: response.chat._id,  // <-- FIX HERE: access nested chat._id
                userId: user._id,
                userName: user.name,
                userAvatar: user?.avatar?.url,
                isOnline: onlineUserIds.includes(user._id),
            })

            if (isMobile) {
                onCloseMobileSidebar()
            }
        } catch (err) {
            console.error("Failed to start chat", err)
        }
    }


    // Render all users or chats based on the viewAllUsers state
    const renderUsersOrChats = () => {
        if (viewAllUsers) {
            return (
                <div className="space-y-1.5 py-2 px-3">
                    {isLoading ? (
                        Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="flex items-center p-2 rounded-md bg-muted/20 animate-pulse space-x-2.5">
                                <div className="h-8 w-8 rounded-full bg-muted" />
                                <div className="flex-1 space-y-1.5">
                                    <div className="h-2.5 w-3/5 bg-muted/40 rounded" />
                                    <div className="h-2 w-2/5 bg-muted/30 rounded" />
                                </div>
                            </div>
                        ))
                    ) : error ? (
                        <div className="p-4 text-center text-sm text-destructive">
                            Failed to load users
                            <Button variant="outline" className="mt-2 text-xs h-7 px-3">Retry</Button>
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="p-4 text-center text-muted-foreground text-sm">
                            <Search className="mx-auto h-6 w-6 mb-2" />
                            <p>No users found</p>
                        </div>
                    ) : (
                        filteredUsers.map((user) => {
                            const isOnline = onlineUserIds.includes(user._id)
                            return (
                                <div
                                    key={user._id}
                                    className={cn(
                                        "flex items-center p-2 rounded-md cursor-pointer transition-all",
                                        "border border-border backdrop-blur-sm",
                                        currentChat.userId === user._id
                                            ? "bg-accent border-accent shadow-md"
                                            : "hover:bg-muted/20"
                                    )}
                                    onClick={() => handleUserClick(user)}
                                >
                                    <div className="relative">
                                        <Avatar className="h-8 w-8 border border-border">
                                            <AvatarImage src={user?.avatar?.url} />
                                            <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className={cn(
                                            "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background",
                                            isOnline ? "bg-green-500 animate-pulse" : "bg-gray-400"
                                        )} />
                                    </div>
                                    <div className="ml-2 flex-1 overflow-hidden">
                                        <div className="flex justify-between items-center">
                                            <h3 className="font-medium text-sm truncate">{user.name}</h3>
                                            <span className="text-[11px] text-muted-foreground">
                                                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground truncate">
                                            {isOnline ? "Online" : "Last seen recently"}
                                        </p>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            )
        } else {
            return (
                <div className="space-y-1.5 py-2 px-3">
                    {chats.length === 0 ? (
                        <div className="p-4 text-center text-muted-foreground text-sm">
                            <Search className="mx-auto h-6 w-6 mb-2" />
                            <p>No chats available</p>
                        </div>
                    ) : (
                        chats.map((chat) => {
                            const otherUser = chat.users.find(user => user._id !== currentChat.userId)
                            const isOnline = onlineUserIds.includes(otherUser._id)

                            return (
                                <div
                                    key={chat._id}
                                    className={cn(
                                        "flex items-center p-2 rounded-md cursor-pointer transition-all",
                                        "border border-border backdrop-blur-sm",
                                        currentChat.chatId === chat._id
                                            ? "bg-accent border-accent shadow-md"
                                            : "hover:bg-muted/20"
                                    )}
                                    onClick={() => onChatSelect({
                                        chatId: chat._id,
                                        userId: otherUser._id,
                                        userName: otherUser.name,
                                        userAvatar: otherUser?.avatar?.url,
                                        isOnline,
                                    })}
                                >
                                    <div className="relative">
                                        <Avatar className="h-8 w-8 border border-border">
                                            <AvatarImage src={otherUser?.avatar?.url} />
                                            <AvatarFallback>{otherUser.name?.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className={cn(
                                            "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background",
                                            isOnline ? "bg-green-500 animate-pulse" : "bg-gray-400"
                                        )} />
                                    </div>
                                    <div className="ml-2 flex-1 overflow-hidden">
                                        <div className="flex justify-between items-center">
                                            <h3 className="font-medium text-sm truncate">{otherUser.name}</h3>
                                            <span className="text-[11px] text-muted-foreground">
                                                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground truncate">
                                            {isOnline ? "Online" : "Last seen recently"}
                                        </p>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            )
        }
    }

    return (
        <div className="h-full flex flex-col overflow-hidden bg-background/80 backdrop-blur-lg text-foreground text-sm">

            {/* Header */}
            <div className="p-2.5 border-b border-border">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-muted/30">
                            <div className="absolute inset-0 bg-muted/30 animate-pulse" />
                            <img src="/ai-logo.avif" alt="AI Logo" className="absolute inset-0 w-full h-full object-cover" />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold">Chats</h2>
                            <p className="text-[11px] text-muted-foreground">{viewAllUsers ? filteredUsers.length : chats.length} contacts</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Button variant="ghost" size="icon" className="rounded-full p-1.5" onClick={() => setViewAllUsers(true)}>
                            <Search className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button variant="ghost" size="icon" className="rounded-full p-1.5" onClick={() => setViewAllUsers(false)}>
                            <UserPlus className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        {onCloseMobileSidebar && (
                            <Button variant="ghost" size="icon" className="md:hidden rounded-full p-1.5" onClick={onCloseMobileSidebar}>
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="p-2 border-b border-border">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 h-8 text-sm bg-muted/20 border-border placeholder:text-muted-foreground"
                    />
                </div>
            </div>

            {/* User list or Chats based on state */}
            <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                    {renderUsersOrChats()}
                </ScrollArea>
            </div>
        </div>
    )
}
