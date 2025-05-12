"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import LoadingAnimation from "../components/loading-animation"

export default function ProtectedRoute(WrappedComponent) {
    return function Wrapper(props) {
        const { status } = useSession()
        const router = useRouter()
        const [isAuth, setIsAuth] = useState(false)
        const [showLoading, setShowLoading] = useState(true)
        const [loadingStartTime] = useState(Date.now()) // Track when loading started

        useEffect(() => {
            const minLoadingTime = 3000 // 3 seconds minimum loading time
            const token = localStorage.getItem("authToken")

            const checkAuth = () => {
                if (status === "loading") return // Still loading session

                const elapsedTime = Date.now() - loadingStartTime
                const remainingTime = Math.max(0, minLoadingTime - elapsedTime)

                if (status === "unauthenticated" && !token) {
                    // Not authenticated - wait remaining time before redirect
                    setTimeout(() => {
                        router.push("/authentication")
                    }, remainingTime)
                } else {
                    // Authenticated - wait remaining time before showing content
                    setTimeout(() => {
                        setIsAuth(true)
                        setShowLoading(false)
                    }, remainingTime)
                }
            }

            // Set a timeout to ensure minimum 3 seconds loading
            const timer = setTimeout(checkAuth, minLoadingTime)

            // Also check auth immediately in case loading takes longer than 3s
            if (status !== "loading") {
                checkAuth()
            }

            return () => clearTimeout(timer)
        }, [status, router, loadingStartTime])

        if (showLoading) {
            return <LoadingAnimation />
        }

        if (!isAuth) {
            return null // Don't flash content before redirect
        }

        return <WrappedComponent {...props} />
    }
}