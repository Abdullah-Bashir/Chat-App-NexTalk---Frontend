"use client"

import { useState } from "react"
import ProtectedRoute from "@/app/hoc/protectedRoute"
import { cn } from "@/lib/utils"
import { CircuitBackground } from "@/app/components/circuit-background"
import UserList from "./components/UserList"
import ChatArea from "./components/ChatArea"
import ChatHeader from "./components/ChatHeader"

function ChatPage() {
    const [currentChat, setCurrentChat] = useState(null)
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

    return (
        <div className="h-screen flex flex-col relative overflow-hidden bg-background/30">
            {/* Circuit background with higher z-index to ensure visibility */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <CircuitBackground />
            </div>

            {/* Main layout with reduced opacity and rounded corners */}
            <div className="flex-1 flex flex-col relative z-10 p-3 h-screen">
                <div className="rounded-xl overflow-hidden border border-white/10 shadow-lg bg-black/10 backdrop-blur-md h-full flex flex-col">
                    <ChatHeader onMenuClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} />

                    <div className="flex flex-1 overflow-hidden h-[calc(100%-60px)]">
                        {/* User list sidebar with glass effect */}
                        <div
                            className={cn(
                                "w-full md:w-80 lg:w-96 border-r border-white/10 bg-background/30 backdrop-blur-md",
                                "fixed md:relative inset-0 z-20 md:z-auto transform",
                                "transition-all duration-300 ease-in-out",
                                isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
                            )}
                        >
                            <UserList
                                currentChat={currentChat}
                                onUserSelect={setCurrentChat}
                                onCloseMobileSidebar={() => setIsMobileSidebarOpen(false)}
                            />
                        </div>

                        {/* Chat area with glass effect */}
                        <div className="flex-1 flex flex-col bg-background/20 backdrop-blur-sm">
                            <ChatArea currentChat={currentChat} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProtectedRoute(ChatPage)
