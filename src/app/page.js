"use client"

import { useEffect, useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { CircuitBackground } from "@/app/components/circuit-background"
import { ThemeToggle } from "@/app/components/ThemeToggle"
import { Button } from "@/components/ui/button"
import { LogOut, LogIn, MessageSquare, Settings, User } from "lucide-react"
import { motion } from "framer-motion"

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [hasToken, setHasToken] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("authToken")
      setHasToken(!!token)
    }
  }, [])

  useEffect(() => {
    // Wait for session status to resolve
    if (status !== "loading") {
      setLoading(false)
    }
  }, [status])

  const isAuthenticated = !!session || hasToken

  const handleLogout = () => {
    if (session) {
      signOut({ callbackUrl: "/authentication" })
    } else {
      localStorage.removeItem("authToken")
      router.push("/authentication")
    }
  }

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.15
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <CircuitBackground />

      {/* Header */}
      <header className="relative z-10 w-full px-4 py-3 sm:px-6 flex justify-between items-center">
        <h2 className="text-xl sm:text-2xl font-bold font-geist-sans">NexTalk</h2>
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <Button
            variant="outline"
            size="icon"
            onClick={handleLogout}
            className="rounded-full bg-background/80 backdrop-blur-sm cursor-pointer"
          >
            {isAuthenticated ? <LogOut className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
            <span className="sr-only">{isAuthenticated ? "Logout" : "Login"}</span>
          </Button>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-background/80 backdrop-blur-md rounded-xl border border-border shadow-lg p-6 sm:p-8 w-full max-w-3xl space-y-6"
        >
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl sm:text-4xl font-bold font-geist-sans"
            >
              Welcome to NexTalk
            </motion.h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-2 max-w-md mx-auto">
              Your modern chat application with real-time messaging and a beautiful interface.
            </p>
          </div>

          {/* Features Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 cursor-pointer"
          >
            {[{
              icon: MessageSquare,
              title: "Real-time Chat",
              desc: "Connect instantly with real-time messages."
            }, {
              icon: User,
              title: "Custom Profiles",
              desc: "Personalize your experience easily."
            }, {
              icon: Settings,
              title: "Customization",
              desc: "Dark mode, themes, and more settings."
            }].map((feature, i) => (
              <motion.div
                key={i}
                variants={cardVariants}
                whileHover={{
                  y: -6,
                  scale: 1.04,
                  transition: { type: "spring", stiffness: 250, damping: 15 }
                }}
                className="bg-background border border-border rounded-lg p-5 text-center shadow-sm hover:shadow-xl transition-all"
              >
                <div className="h-10 w-10 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-sm font-medium">{feature.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Call to Action Button */}
          <div className="text-center cursor-pointer">
            <Button
              size="sm"
              disabled={loading}
              onClick={() => router.push(isAuthenticated ? "/chat" : "/authentication")}
              className="px-6 mt-4 cursor-pointer"
            >
              {loading ? "Loading..." : isAuthenticated ? "Start Chatting" : "Login to Start"}
            </Button>
          </div>

        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full px-4 py-3 text-center text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} NexTalk. All rights reserved.</p>
      </footer>
    </div>
  )
}
