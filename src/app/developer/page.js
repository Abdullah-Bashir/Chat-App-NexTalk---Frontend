"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { CircuitBackground } from "@/app/components/circuit-background"
import { ThemeToggle } from "@/app/components/ThemeToggle"
import { Button } from "@/components/ui/button"
import { LogOut, ArrowLeft, Github, Linkedin, Twitter, Mail, Globe } from "lucide-react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function DeveloperPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [hasToken, setHasToken] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("authToken")
      setHasToken(!!token)
    }
  }, [])

  const isAuthenticated = !!session || hasToken

  const handleLogout = () => {
    if (session) {
      signOut({ callbackUrl: "/authentication" })
    } else {
      localStorage.removeItem("authToken")
      localStorage.removeItem("userId")
      router.push("/authentication")
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  const socialLinks = [
    {
      name: "GitHub",
      icon: Github,
      url: "https://github.com/Abdullah-Bashir",
      color: "hover:text-gray-700 dark:hover:text-gray-300"
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: "https://linkedin.com/in/yourusername",
      color: "hover:text-blue-600"
    },
    {
      name: "Twitter",
      icon: Twitter,
      url: "https://twitter.com/yourusername",
      color: "hover:text-blue-400"
    },
    {
      name: "Email",
      icon: Mail,
      url: "mailto:ch.ma.bashir@gmail.com",
      color: "hover:text-red-500"
    },
    {
      name: "Portfolio",
      icon: Globe,
      url: "https://snapofolio.vercel.app/vortex/Abdullah",
      color: "hover:text-purple-500"
    }
  ]

  const skills = [
    { name: "Next.js", level: 90 },
    { name: "React", level: 95 },
    { name: "TypeScript", level: 85 },
    { name: "Tailwind CSS", level: 92 },
    { name: "Node.js", level: 80 },
    { name: "PostgreSQL", level: 75 }
  ]

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <CircuitBackground />

      {/* Header */}
      <header className="relative z-10 w-full px-4 py-3 sm:px-6 flex justify-between items-center">
        <Link href="/">
          <Button variant="ghost" size="sm" className="flex items-center gap-2 cursor-pointer">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />com
          <Button
            variant="outline"
            size="icon"
            onClick={handleLogout}
            className="rounded-full bg-background/80 backdrop-blur-sm cursor-pointer"
          >
            {isAuthenticated ? <LogOut className="h-4 w-4" /> : <LogOut className="h-4 w-4" />}
            <span className="sr-only">{isAuthenticated ? "Logout" : "Login"}</span>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 relative z-10 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-background/80 backdrop-blur-md rounded-xl border border-border shadow-lg p-6 sm:p-8 w-full max-w-4xl"
        >
          <div className="flex flex-col md:flex-row gap-8">
            {/* Profile Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex-shrink-0 mx-auto md:mx-0"
            >
              <div className="relative">
                <div className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-primary/20 shadow-lg">
                  {/* Replace with your actual image path */}
                  <img
                    src="/image.png" // Update this path to your image
                    alt="Developer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <motion.div
                  className="absolute -inset-2 rounded-full border-2 border-primary/30"
                  animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.5, 0.8, 0.5]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity
                  }}
                />
              </div>
            </motion.div>

            {/* Profile Details */}
            <div className="flex-1">
              <motion.h1
                variants={itemVariants}
                className="text-3xl sm:text-4xl font-bold font-geist-sans"
              >
               Abdullah Bashir
              </motion.h1>
              <motion.p
                variants={itemVariants}
                className="text-lg text-primary mt-2"
              >
                Full Stack Developer & UI/UX Enthusiast
              </motion.p>
              <motion.p
                variants={itemVariants}
                className="text-muted-foreground mt-4"
              >
                Passionate about creating elegant, responsive web applications with cutting-edge
                technologies. I specialize in Next.js, React, and modern CSS frameworks like
                Tailwind. When I&apos;m not coding, you can find me exploring new design patterns or
                contributing to open source projects.
              </motion.p>

              {/* Social Links */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="flex gap-4 mt-6"
              >
                {socialLinks.map((social, index) => {
                  const Icon = social.icon
                  return (
                    <motion.a
                      key={index}
                      variants={itemVariants}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-2 rounded-full bg-background border border-border shadow-sm transition-all duration-300 ${social.color} hover:scale-110`}
                      whileHover={{ y: -5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="sr-only">{social.name}</span>
                    </motion.a>
                  )
                })}
              </motion.div>
            </div>
          </div>

          {/* Skills Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12"
          >
            <h2 className="text-2xl font-bold font-geist-sans mb-6 text-center">Skills & Expertise</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {skills.map((skill, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="bg-background border border-border rounded-lg p-4"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{skill.name}</span>
                    <span className="text-sm text-muted-foreground">{skill.level}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2.5">
                    <motion.div
                      className="h-2.5 rounded-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.level}%` }}
                      transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Projects/Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-12 text-center"
          >
            <h2 className="text-2xl font-bold font-geist-sans mb-4">Interested in working together?</h2>
            <p className="text-muted-foreground mb-6">
              I&apos;m always open to discussing new projects and opportunities.
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild>
                <a href="mailto:ch.ma.bashir@gmail.com" className="cursor-pointer">
                  Get In Touch
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/Resume_ab.pdf" target="_blank" rel="noopener noreferrer" className="cursor-pointer">
                  View Resume
                </a>
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full px-4 py-3 text-center text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} NexTalk. Crafted with passion by Abdullah Bashir.</p>
      </footer>
    </div>
  )
}