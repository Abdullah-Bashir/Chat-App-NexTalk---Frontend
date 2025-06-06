
"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Paperclip, Image, Mic } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

import { useGetMessagesQuery as useGetApiMessages } from "@/app/redux/api/chatApi"
import { useSendMessageMutation } from "@/app/redux/api/chatApi"
import { useGetMessagesQuery } from "@/app/redux/api/socketApi"

import socket from "@/lib/socket"

export default function ChatArea({ chatId, userId, userName, userAvatar, isOnline }) {
    const lastMessageRef = useRef(null)
    const [inputValue, setInputValue] = useState("")
    const [optimisticMessages, setOptimisticMessages] = useState([])

    const [isTyping, setIsTyping] = useState(false)
    const [typingTimeout, setTypingTimeout] = useState(null)
    const [otherUserTyping, setOtherUserTyping] = useState(false)

    // Fetch initial messages from API
    const { data: apiMessages, isFetching, refetch } = useGetApiMessages(chatId, {
        skip: !chatId,
    })

    // Subscribe to real-time messages via socket
    const { data: socketMessages = [] } = useGetMessagesQuery(chatId, {
        skip: !chatId,
    })

    // Combine API messages, optimistic updates, and socket messages
    const allMessages = [
        ...(Array.isArray(apiMessages) ? apiMessages : (apiMessages?.messages || [])),
        ...socketMessages,
        ...optimisticMessages
    ].sort((a, b) => new Date(a.sentAt) - new Date(b.sentAt))

    const [sendMessage] = useSendMessageMutation()

    // Scroll to last message whenever messages update
    useEffect(() => {
        if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [allMessages, otherUserTyping])

    // Socket effects for typing indicators
    useEffect(() => {
        if (!chatId) return

        const handleTypingStart = () => {
            setOtherUserTyping(true)
        }

        const handleTypingStop = () => {
            setOtherUserTyping(false)
        }

        socket.on(`user-typing-start-${chatId}`, handleTypingStart)
        socket.on(`user-typing-stop-${chatId}`, handleTypingStop)

        return () => {
            socket.off(`user-typing-start-${chatId}`, handleTypingStart)
            socket.off(`user-typing-stop-${chatId}`, handleTypingStop)
        }
    }, [chatId])


    const handleInputChange = (e) => {
        setInputValue(e.target.value)

        // Typing indicators logic
        if (!isTyping) {
            setIsTyping(true)
            socket.emit('typing-start', { chatId, userId })
        }

        // Clear existing timeout
        if (typingTimeout) {
            clearTimeout(typingTimeout)
        }

        // Set new timeout
        const timeout = setTimeout(() => {
            setIsTyping(false)
            socket.emit('typing-stop', { chatId, userId })
        }, 2000)

        setTypingTimeout(timeout)
    }


    const handleSend = async () => {
        if (!inputValue.trim() || !chatId) return;

        // Clear typing indicators
        if (typingTimeout) {
            clearTimeout(typingTimeout)
        }

        setIsTyping(false)
        socket.emit('typing-stop', { chatId, userId })

        const tempId = Date.now().toString();
        const newMessage = {
            _id: tempId,
            text: inputValue.trim(),
            sender: { _id: userId },
            sentAt: new Date().toISOString()
        };

        // Optimistic update
        setOptimisticMessages(prev => [...prev, newMessage]);
        setInputValue("");

        try {
            // (1) Save to DB via HTTP
            await sendMessage({ chatId, text: inputValue.trim() }).unwrap();

            // (2) Emit via Socket.IO for real-time
            socket.emit("send-message", {
                chatId,
                message: newMessage
            });

            // (3) Remove optimistic update (socket will send the real message)
            setOptimisticMessages(prev => prev.filter(msg => msg._id !== tempId));

        } catch (err) {
            console.error("Error sending message:", err);
            setOptimisticMessages(prev => prev.filter(msg => msg._id !== tempId));
        }
    };

    return (
        <div className="flex flex-col h-full bg-background/10 backdrop-blur-xl text-foreground">
            {chatId ? (
                <>
                    {/* Chat Header */}
                    <div className="p-3 border-b border-border flex items-center bg-background/50 backdrop-blur-xl h-16">
                        <div className="relative">
                            <Avatar className="h-9 w-9 border border-border">
                                <AvatarImage src={userAvatar} />
                                <AvatarFallback>{userName?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className={cn(
                                "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background",
                                isOnline ? "bg-green-500 animate-pulse" : "bg-gray-400"
                            )} />
                        </div>
                        <div className="ml-3">
                            <h3 className="font-medium text-sm md:text-base">{userName}</h3>
                            <p className="text-xs text-muted-foreground">
                                {isFetching ? "Loading..." :
                                    otherUserTyping ? "typing..." :
                                        isOnline ? "Online" : "Offline"}
                            </p>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 flex flex-col overflow-hidden bg-background/10 backdrop-blur-xl">
                        <ScrollArea className="flex-1 px-4 py-3 bg-background/10 backdrop-blur-xl">
                            <div className="space-y-3 max-h-[50vh]">
                                {isFetching ? (
                                    <div className="flex justify-center items-center h-full bg-background/10 backdrop-blur-xl">
                                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent" />
                                    </div>
                                ) : allMessages.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground py-8">
                                        <div className="bg-muted/40 p-4 rounded-full mb-4 backdrop-blur-md">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="32"
                                                height="32"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-semibold mb-1">No messages yet</h3>
                                        <p className="max-w-md">Start the conversation with {userName}. Say hello or send your first message!</p>
                                    </div>
                                ) : (
                                    <>
                                        {allMessages.map((message, idx) => {
                                            const isLast = idx === allMessages.length - 1
                                            const isOwnMessage = message.sender?._id === userId || message.sender === userId
                                            return (
                                                <div
                                                    key={message._id || idx}
                                                    ref={isLast ? lastMessageRef : null}
                                                    className={cn("flex", isOwnMessage ? "justify-end" : "justify-start")}
                                                >
                                                    <div
                                                        className={cn(
                                                            "max-w-[80%] rounded-xl p-3 shadow-md border backdrop-blur-sm text-sm",
                                                            isOwnMessage ? "bg-accent/80 text-accent-foreground border-accent" : "bg-background/40 border-border"
                                                        )}
                                                    >
                                                        <p>{message.text}</p>
                                                        <div className="flex justify-end items-center mt-1">
                                                            <p className="text-xs text-muted-foreground">
                                                                {new Date(message.sentAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                        {otherUserTyping && (
                                            <div className="flex justify-start">
                                                <div className="max-w-[80%] rounded-xl p-3 shadow-md border bg-background/40 border-border">
                                                    <div className="flex space-x-1">
                                                        <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0ms' }} />
                                                        <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '150ms' }} />
                                                        <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '300ms' }} />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </ScrollArea>

                        {/* Message Input */}
                        <div className="p-3 border-t border-border bg-background/50 backdrop-blur-md">
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:bg-muted/20">
                                    <Paperclip className="h-5 w-5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:bg-muted/20">
                                    <Image className="h-5 w-5" />
                                </Button>
                                <Input
                                    value={inputValue}
                                    onChange={handleInputChange}
                                    placeholder="Type a message..."
                                    className="flex-1 bg-background/30 backdrop-blur-sm border-border text-foreground placeholder:text-muted-foreground"
                                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                />
                                <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:bg-muted/20">
                                    <Mic className="h-5 w-5" />
                                </Button>
                                <Button
                                    onClick={handleSend}
                                    size="icon"
                                    className="rounded-full bg-accent text-accent-foreground hover:opacity-90 shadow-md"
                                >
                                    <Send className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center h-full p-6 text-center text-muted-foreground backdrop-blur-md">
                    <div className="max-w-md">
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-muted/40 mb-4">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Select a chat</h3>
                        <p className="mb-6">Choose a conversation from the sidebar to start messaging or create a new chat</p>
                        <Button className="bg-accent text-accent-foreground hover:opacity-90 shadow-lg">Start New Chat</Button>
                    </div>
                </div>
            )}
        </div>
    )
}