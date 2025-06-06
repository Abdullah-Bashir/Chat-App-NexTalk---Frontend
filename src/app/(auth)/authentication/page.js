"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoginForm } from "./components/login-form"
import { SignupForm } from "./components/signup-form"
import { ThemeToggle } from "@/app/components/ThemeToggle"
import { CircuitBackground } from "@/app/components/circuit-background"
import { AnimatePresence, motion } from "framer-motion"

export default function AuthPage() {
    const [activeTab, setActiveTab] = useState("login")

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
            <CircuitBackground />

            {/* Back Button */}
            <div className="absolute top-4 left-4 z-10">
                <Link
                    href="/"
                    className="inline-flex items-center gap-1 text-sm font-medium text-foreground hover:underline"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </Link>
            </div>

            {/* Theme Toggle */}
            <div className="absolute top-4 right-4 z-10">
                <ThemeToggle />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative z-10 w-full max-w-md mx-auto px-4 sm:px-6"
            >
                <div className="bg-background/60 backdrop-blur-xl rounded-2xl shadow-lg border border-border p-6 sm:p-8 space-y-4">

                    <motion.h1
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="text-2xl sm:text-3xl font-bold text-center font-geist-sans"
                    >
                        {activeTab === "login" ? "Welcome Back" : "Join NexTalk"}
                    </motion.h1>

                    <p className="text-sm text-muted-foreground text-center">
                        {activeTab === "login"
                            ? "Sign in to continue to your conversations"
                            : "Create an account to start chatting"}
                    </p>

                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid grid-cols-2  mb-4 w-full mx-auto ">
                            <TabsTrigger value="login">Login</TabsTrigger>
                            <TabsTrigger value="signup">Sign Up</TabsTrigger>
                        </TabsList>

                        <AnimatePresence mode="wait">
                            {activeTab === "login" ? (
                                <motion.div
                                    key="login"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <TabsContent value="login">
                                        <LoginForm />
                                    </TabsContent>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="signup"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <TabsContent value="signup">
                                        <SignupForm />
                                    </TabsContent>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Tabs>
                </div>

            </motion.div>
        </div>
    )
}
