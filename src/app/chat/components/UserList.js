"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, X, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { useGetAllUsersQuery } from "@/app/redux/api/authApi"
import { useSyncNextAuthToken } from "@/app/hooks/useSyncNextAuthToken"

export default function UserList({ currentChat, onUserSelect, onCloseMobileSidebar }) {
    useSyncNextAuthToken()

    const [isMobile, setIsMobile] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")

    const { data: users = [], isLoading, error } = useGetAllUsersQuery(undefined, {
        refetchOnMountOrArgChange: true,
    })

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

    return (
        <div
            className={cn(
                "h-full flex flex-col overflow-hidden",
                isMobile ? "bg-background/95 backdrop-blur-md" : "bg-background/20 backdrop-blur-sm"
            )}
        >
            {/* Header */}
            <div className="p-4 border-b">
                <div className="group flex items-center justify-between w-full">
                    <div className="flex items-center gap-3 px-3 py-2 rounded-lg transition hover:shadow-lg hover:ring-1 hover:ring-white/20 hover:bg-gray-900 cursor-pointer w-full">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden shadow-lg ring-2 ring-purple-500/30">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20 animate-pulse"></div>
                            <img src="/ai-logo.avif" alt="AI Logo" className="absolute inset-0 w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-1.5">
                                <span className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
                                    Chat with AI
                                </span>
                                <Sparkles className="h-4 w-4 text-purple-400 opacity-70" />
                            </div>
                            <div className="h-0.5 w-full bg-gradient-to-r from-purple-400 to-blue-500 mt-0.5 rounded-full opacity-80" />
                        </div>
                    </div>
                    {onCloseMobileSidebar && (
                        <Button variant="ghost" size="icon" className="md:hidden" onClick={onCloseMobileSidebar}>
                            <X className="h-5 w-5" />
                        </Button>
                    )}
                </div>
            </div>

            {/* Search */}
            <div className="p-3 border-b border-white/10">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search chats..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 bg-background/20 backdrop-blur-sm border-white/10 focus:border-purple-500/50 focus:ring-purple-500/20"
                    />
                </div>
            </div>

            {/* User list */}
            <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                    <div className="space-y-1 p-2">
                        {isLoading ? (
                            // Skeleton placeholders
                            Array.from({ length: 6 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="flex items-center p-3 rounded-lg border border-white/10 backdrop-blur-sm bg-background/10 animate-pulse space-x-3"
                                >
                                    <div className="h-10 w-10 rounded-full bg-gray-700/40" />
                                    <div className="flex-1 space-y-1">
                                        <div className="h-3 w-3/5 bg-gray-600/30 rounded" />
                                        <div className="h-2 w-2/5 bg-gray-500/20 rounded" />
                                    </div>
                                </div>
                            ))
                        ) : error ? (
                            <p className="p-4 text-destructive">Failed to load users.</p>
                        ) : filteredUsers.length === 0 ? (
                            <p className="p-4 text-muted-foreground">No users found.</p>
                        ) : (
                            filteredUsers.map((user, index) => (
                                <div
                                    key={`${user._id}-${index}`}
                                    className={cn(
                                        "flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 m-1",
                                        "border border-white/10 backdrop-blur-sm",
                                        currentChat === user._id
                                            ? "bg-primary/20 border-primary/30 shadow-md"
                                            : "bg-background/20 hover:bg-background/30 hover:border-white/20 hover:shadow-sm"
                                    )}
                                    onClick={() => onUserSelect(user._id)}
                                >
                                    <div className="relative">
                                        <Avatar className="h-10 w-10 border border-white/10">
                                            <AvatarImage src={user?.avatar?.url} />
                                            <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div
                                            className={cn(
                                                "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background",
                                                user.isOnline ? "bg-green-500 animate-pulse" : "bg-gray-500"
                                            )}
                                        />
                                    </div>
                                    <div className="ml-3 flex-1 overflow-hidden">
                                        <div className="flex justify-between items-center">
                                            <h3 className="font-medium truncate">{user.name}</h3>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <p className="text-sm text-muted-foreground truncate">Start chatting...</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </ScrollArea>
            </div>
        </div>
    )
}
