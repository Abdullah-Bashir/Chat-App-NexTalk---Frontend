"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, Loader2, User, LogOut } from "lucide-react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { ThemeToggle } from "@/app/components/ThemeToggle"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FaRocketchat } from "react-icons/fa6";

export default function ChatHeader({ onMenuClick }) {
    const { data: session } = useSession()
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const handleLogout = async () => {
        setLoading(true)
        if (session) {
            await signOut({ callbackUrl: "/authentication" })
        } else {
            localStorage.removeItem("authToken")
            router.push("/authentication")
        }
    }

    return (
        <header className="w-full px-4 py-3 border-b border-white/10 bg-background/30 backdrop-blur-md flex justify-between items-center relative overflow-hidden shine-container">
            {/* Shine effect overlay */}
            <div className="shine-effect"></div>

            <div className="flex items-center gap-2 z-10">
                <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
                    <Menu className="h-5 w-5" />
                </Button>
                <div className="flex items-center gap-2">
                    <FaRocketchat className="h-6 w-6 text-blue-500" />
                    <h2 className="text-2xl font-bold">NexTalk</h2>
                </div>
            </div>

            <div className="flex items-center space-x-2 z-10">
                {/* Logout Button */}
                <Button
                    variant="ghost"
                    onClick={handleLogout}
                    disabled={loading}
                    className="flex items-center gap-2 hover:bg-background/40"
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin h-5 w-5" />
                            <span>Logout</span>
                        </>
                    ) : (
                        <>
                            <LogOut className="h-5 w-5" />
                            <span>Logout</span>
                        </>
                    )}
                </Button>

                {/* Profile Dropdown Menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="hover:bg-background/40">
                            <User className="h-5 w-5" />
                            <span className="sr-only">Profile Menu</span>
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        align="end"
                        className="w-56 bg-background/60 backdrop-blur-md border border-white/10 shadow-lg rounded-md p-2"
                    >
                        <DropdownMenuItem
                            onClick={() => router.push("/profile")}
                            className="cursor-pointer px-3 py-2 rounded-sm hover:bg-accent"
                        >
                            Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => router.push("/developer")}
                            className="cursor-pointer px-3 py-2 rounded-sm hover:bg-accent"
                        >
                            Developer's Page
                        </DropdownMenuItem>
                        {/* Theme Toggler inside dropdown */}
                        <div className="px-3 py-2 flex items-center justify-between rounded-sm hover:bg-accent">
                            <span className="text-sm">Theme</span>
                            <ThemeToggle />
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}