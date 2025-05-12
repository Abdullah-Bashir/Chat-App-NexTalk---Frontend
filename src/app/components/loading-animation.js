"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { CircuitBackground } from "@/app/components/circuit-background"
import { MessageSquare, Send } from 'lucide-react'
import { useTheme } from "next-themes"

export default function LoadingAnimation() {
    const [mounted, setMounted] = useState(false)
    const { resolvedTheme } = useTheme()
    const isDarkMode = resolvedTheme === "dark"

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    // Color definitions with blue-500 for text
    const colors = {
        primary: isDarkMode ? "hsl(210, 80%, 60%)" : "hsl(210, 80%, 50%)",
        primaryForeground: "hsl(0, 0%, 100%)",
        bubble: isDarkMode ? "hsla(210, 80%, 60%, 0.3)" : "hsla(210, 80%, 50%, 0.3)",
        bubbleBorder: isDarkMode ? "hsla(210, 80%, 70%, 0.5)" : "hsla(210, 80%, 40%, 0.5)",
        icon: "hsl(0, 0%, 100%)",
        text: "hsl(217, 91%, 60%)", // blue-500 equivalent
        subtext: "hsl(217, 91%, 60%)", // Same blue for consistency
        message: isDarkMode ? "hsl(210, 80%, 70%)" : "hsl(210, 80%, 50%)",
        glow: isDarkMode ? "hsla(210, 80%, 60%, 0.5)" : "hsla(210, 80%, 50%, 0.3)"
    }

    const letterVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.1,
            },
        }),
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-background">
            <div className="absolute inset-0 z-0 overflow-hidden">
                <CircuitBackground isDarkMode={isDarkMode} />
            </div>

            <div className="relative z-10 flex flex-col items-center">
                {/* Animation elements (unchanged) */}
                <div className="relative w-72 h-72 flex items-center justify-center">
                    {/* Central Hub */}
                    <motion.div
                        className="absolute rounded-full flex items-center justify-center"
                        style={{
                            width: "100px",
                            height: "100px",
                            backgroundColor: colors.primary
                        }}
                        animate={{
                            scale: [1, 1.1, 1],
                            rotate: [0, 5, -5, 0],
                            boxShadow: [
                                `0 0 10px ${colors.glow}`,
                                `0 0 30px ${colors.glow}`,
                                `0 0 10px ${colors.glow}`
                            ],
                        }}
                        transition={{
                            duration: 2,
                            ease: "easeInOut",
                            repeat: Number.POSITIVE_INFINITY,
                        }}
                    >
                        <MessageSquare
                            size={50}
                            style={{ color: colors.primaryForeground }}
                        />
                    </motion.div>

                    {/* Orbiting Bubbles */}
                    {[...Array(5)].map((_, i) => {
                        const angle = (i * Math.PI * 2) / 5
                        const radius = 120
                        const x = Math.cos(angle) * radius
                        const y = Math.sin(angle) * radius

                        return (
                            <motion.div
                                key={i}
                                className="absolute rounded-full flex items-center justify-center border backdrop-blur-sm"
                                style={{
                                    width: "60px",
                                    height: "60px",
                                    backgroundColor: colors.bubble,
                                    borderColor: colors.bubbleBorder,
                                    backdropFilter: "blur(4px)"
                                }}
                                initial={{ x, y, opacity: 0 }}
                                animate={{
                                    x,
                                    y,
                                    opacity: [0.6, 1, 0.6],
                                    scale: [0.9, 1.1, 0.9],
                                    rotate: [0, 180, 360]
                                }}
                                transition={{
                                    duration: 3,
                                    ease: "easeInOut",
                                    repeat: Number.POSITIVE_INFINITY,
                                    delay: i * 0.2,
                                }}
                            >
                                <MessageSquare
                                    size={30}
                                    style={{ color: colors.icon }}
                                />
                            </motion.div>
                        )
                    })}

                    {/* Flying Messages */}
                    {[...Array(8)].map((_, i) => {
                        const startAngle = Math.random() * Math.PI * 2
                        const startRadius = 30
                        const startX = Math.cos(startAngle) * startRadius
                        const startY = Math.sin(startAngle) * startRadius

                        const endAngle = Math.random() * Math.PI * 2
                        const endRadius = 150
                        const endX = Math.cos(endAngle) * endRadius
                        const endY = Math.sin(endAngle) * endRadius

                        return (
                            <motion.div
                                key={`message-${i}`}
                                className="absolute rounded-full flex items-center justify-center shadow-lg"
                                style={{
                                    width: "24px",
                                    height: "24px",
                                    backgroundColor: colors.message,
                                    boxShadow: `0 0 8px ${colors.glow}`
                                }}
                                initial={{
                                    x: startX,
                                    y: startY,
                                    opacity: 0,
                                    scale: 0.5,
                                }}
                                animate={{
                                    x: [startX, endX],
                                    y: [startY, endY],
                                    opacity: [0, 0.8, 0],
                                    scale: [0.5, 1, 0.5],
                                    rotate: [0, 180]
                                }}
                                transition={{
                                    duration: 2 + Math.random(),
                                    ease: "easeInOut",
                                    repeat: Number.POSITIVE_INFINITY,
                                    delay: i * 0.5,
                                    repeatDelay: Math.random() * 2,
                                }}
                            >
                                <Send
                                    size={12}
                                    style={{ color: colors.primaryForeground }}
                                />
                            </motion.div>
                        )
                    })}
                </div>

                {/* Text Elements - Now with blue-500 text and no background */}
                <div className="text-center mt-4">
                    <motion.div
                        className="flex justify-center overflow-hidden"
                        initial="hidden"
                        animate="visible"
                        variants={{
                            visible: {
                                transition: {
                                    staggerChildren: 0.1,
                                }
                            }
                        }}
                    >
                        {["N", "e", "x", "t", "T", "a", "l", "k"].map((letter, index) => (
                            <motion.span
                                key={index}
                                custom={index}
                                variants={letterVariants}
                                className="text-4xl font-bold"
                                style={{ color: colors.text }}
                            >
                                {letter}
                            </motion.span>
                        ))}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2, duration: 0.8 }}
                    >
                        <motion.p
                            className="mt-2 text-lg"
                            style={{ color: colors.text }} // Using same blue for both
                            animate={{
                                y: [0, -3, 0],
                            }}
                            transition={{
                                duration: 4,
                                repeat: Number.POSITIVE_INFINITY,
                                repeatType: "reverse",
                                ease: "easeInOut",
                            }}
                        >
                            Making chat easier, one message at a time
                        </motion.p>
                    </motion.div>

                    <motion.div className="flex justify-center mt-4 space-x-2">
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: colors.text }} // Blue dots
                                animate={{
                                    scale: [1, 1.5, 1],
                                    opacity: [0.5, 1, 0.5],
                                }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Number.POSITIVE_INFINITY,
                                    delay: i * 0.3,
                                }}
                            />
                        ))}
                    </motion.div>
                </div>
            </div>
        </div>
    )
}