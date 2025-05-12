"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Smile, Paperclip } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

export default function ChatArea({ currentChat }) {
    const scrollRef = useRef(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [currentChat])

    const messages = currentChat
        ? [
            { id: "1", sender: "other", content: "Hey there! How are you doing?", time: "10:30 AM" },
            { id: "2", sender: "me", content: "I'm good, thanks! How about you?", time: "10:32 AM" },
            {
                id: "3",
                sender: "other",
                content: "Pretty good! Just working on that project we discussed.",
                time: "10:33 AM",
            },
            { id: "4", sender: "other", content: "Do you have any updates on your end?", time: "10:34 AM" },
            {
                id: "5",
                sender: "me",
                content: "Yes, I've made some progress. I'll share the details with you tomorrow during our meeting.",
                time: "10:36 AM",
            },
            { id: "6", sender: "other", content: "Sounds great! Looking forward to it.", time: "10:37 AM" },
        ]
        : []

    return (
        <div className="flex flex-col h-full">
            {currentChat ? (
                <>

                    {/* Header */}
                    <div className="p-2 border-b border-white/10 flex items-center bg-background/20 backdrop-blur">
                        <Avatar className="h-8 w-8 mr-3">
                            <AvatarImage src="/placeholder.svg" />
                            <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="font-medium">User Name</h3>
                            <p className="text-xs text-muted-foreground">Online</p>
                        </div>
                    </div>

                    {/* Message list */}
                    <ScrollArea className="flex-1 px-3 py-2 h-[calc(100vh-2000px)]">
                        <div className="space-y-3">
                            {messages.map((message) => (
                                <div key={message.id} className={cn("flex", message.sender === "me" ? "justify-end" : "justify-start")}>
                                    <div
                                        className={cn(
                                            "max-w-[200px] md:max-w-sm lg:max-w-md rounded-xl p-2 shadow-sm",
                                            message.sender === "me"
                                                ? "bg-primary/80 backdrop-blur-sm text-primary-foreground border border-primary/20"
                                                : "bg-secondary/60 backdrop-blur-sm border border-white/10",
                                        )}
                                    >
                                        <p className="text-sm">{message.content}</p>
                                        <p
                                            className={cn(
                                                "text-xs mt-1",
                                                message.sender === "me" ? "text-primary-foreground/70" : "text-muted-foreground",
                                            )}
                                        >
                                            {message.time}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>

                    {/* Input */}
                    <div className="p-4 border-t border-white/10 bg-background/30 backdrop-blur">
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="bg-background/20 hover:bg-background/30">
                                <Paperclip className="h-5 w-5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="bg-background/20 hover:bg-background/30">
                                <Smile className="h-5 w-5" />
                            </Button>
                            <Input
                                placeholder="Type a message..."
                                className="flex-1 bg-background/20 backdrop-blur-sm border-white/10"
                            />
                            <Button size="icon" className="bg-primary/80 hover:bg-primary/90">
                                <Send className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>

                </>
            ) : (
                <div className="flex-1 flex items-center justify-center h-[calc(100vh-120px)]">
                    <div className="text-center p-6 max-w-md bg-background/20 backdrop-blur-md rounded-xl border border-white/10 shadow-lg">
                        <h3 className="text-xl font-medium mb-2">Select a chat</h3>
                        <p className="text-muted-foreground">Choose a conversation from the sidebar to start messaging</p>
                    </div>
                </div>
            )}
        </div>
    )
}
