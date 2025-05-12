"use client"

import { createContext, useContext, useEffect, useState } from "react"

const ThemeProviderContext = createContext({
    theme: "system",
    setTheme: () => null,
})

export function ThemeProvider({ children, defaultTheme = "system", storageKey = "theme", ...props }) {
    const [theme, setTheme] = useState(defaultTheme)

    useEffect(() => {
        const root = window.document.documentElement
        const savedTheme = localStorage.getItem(storageKey)
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"

        const initialTheme = savedTheme || systemTheme
        setTheme(initialTheme)

        root.classList.toggle("dark", initialTheme === "dark")
    }, [storageKey])

    useEffect(() => {
        const root = window.document.documentElement

        if (theme === "system") {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
            root.classList.toggle("dark", systemTheme === "dark")
            return
        }

        root.classList.toggle("dark", theme === "dark")
        localStorage.setItem(storageKey, theme)
    }, [theme, storageKey])

    const value = {
        theme,
        setTheme: (newTheme) => {
            setTheme(newTheme)
        },
    }

    return (
        <ThemeProviderContext.Provider {...props} value={value}>
            {children}
        </ThemeProviderContext.Provider>
    )
}

export const useTheme = () => {
    const context = useContext(ThemeProviderContext)

    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider")
    }

    return context
}
