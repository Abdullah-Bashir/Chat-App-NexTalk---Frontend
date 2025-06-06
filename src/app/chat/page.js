
"use client"

import { useState } from "react"
import ProtectedRoute from "@/app/hoc/protectedRoute"
import { cn } from "@/lib/utils"
import { CircuitBackground } from "@/app/components/circuit-background"
import UserList from "./components/UserList"
import ChatArea from "./components/ChatArea"
import ChatHeader from "./components/ChatHeader"

function ChatPage() {

    const [currentChat, setCurrentChat] = useState({
        chatId: null,
        userId: null,
        userName: null,
        userAvatar: null,
        isOnline: false
    })
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
    console.log("Current chatId:", currentChat.chatId)
    console.log("Current userId:", currentChat.userId)


    return (
        <div className="h-screen flex flex-col relative overflow-hidden bg-background text-foreground">

            {/* Background circuit grid */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <CircuitBackground />
            </div>

            {/* Main container */}
            <div className="flex-1 flex flex-col relative z-10 p-2 md:p-10 h-screen">
                <div className="rounded-xl overflow-hidden border border-border shadow-xl bg-muted/30 backdrop-blur-lg h-full flex flex-col">
                    <ChatHeader
                        userName={currentChat.userName}
                        userAvatar={currentChat.userAvatar}
                        onMenuClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                    />

                    <div className="flex flex-1 overflow-hidden h-[calc(100%-64px)]">

                        {/* Sidebar */}
                        <div
                            className={cn(
                                "w-full md:w-80 lg:w-96 border-r border-border bg-background/50",
                                "fixed md:relative inset-0 z-20 md:z-auto transform",
                                "transition-all duration-300 ease-in-out",
                                isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                            )}
                        >
                            <UserList
                                currentChat={currentChat}
                                onChatSelect={setCurrentChat}
                                onCloseMobileSidebar={() => setIsMobileSidebarOpen(false)}
                            />
                        </div>

                        {/* Chat Area */}
                        <div className="flex-1 flex flex-col bg-background/60 backdrop-blur-xl">
                            <ChatArea
                                chatId={currentChat.chatId}
                                userId={currentChat.userId}
                                userName={currentChat.userName}
                                isOnline={currentChat.isOnline}
                                userAvatar={currentChat.userAvatar}
                            />
                        </div>
                    </div>

                </div>
            </div>

        </div>
    )
}

export default ProtectedRoute(ChatPage)
