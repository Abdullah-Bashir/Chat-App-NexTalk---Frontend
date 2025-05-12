"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/app/components/ThemeToggle"
import { CircuitBackground } from "@/app/components/circuit-background"
import { AnimatePresence, motion } from "framer-motion"
import { useVerifyOtpMutation, useResendOtpMutation } from "@/app/redux/api/authApi"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export default function VerifyOtpPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [otp, setOtp] = useState("")
    const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation()
    const [resendOtp, { isLoading: isResending }] = useResendOtpMutation()

    const handleVerify = async () => {
        if (!email) {
            toast.error("Email is required")
            return
        }
        if (otp.length !== 6) {
            toast.error("Please enter a 6-digit verification code")
            return
        }

        try {
            const result = await verifyOtp({
                email,
                verificationCode: otp
            }).unwrap()

            toast.success(result.message || "Account verified successfully")

            // Store token if available
            if (result.token) {
                localStorage.setItem("authToken", result.token)
            }

            // Redirect to chat page
            router.push('/chat')

        } catch (error) {
            toast.error(error.data?.message || "Verification failed")
        }
    }

    const handleResendOtp = async () => {
        if (!email) {
            toast.error("Email is required to resend OTP")
            return
        }

        try {
            const result = await resendOtp({ email }).unwrap()
            toast.success(result.message || "New OTP sent successfully")
        } catch (error) {
            toast.error(error.data?.message || "Failed to resend OTP")
        }
    }

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
            <CircuitBackground />
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />

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
                <div className="bg-background/60 backdrop-blur-xl rounded-2xl shadow-lg border border-border p-6 sm:p-8 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="space-y-2 text-center"
                    >
                        <h1 className="text-2xl sm:text-3xl font-bold font-geist-sans">
                            Verify Your Account
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Enter the email you registered with and the 6-digit code we sent you
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                        className="space-y-4"
                    >
                        {/* Email Input */}
                        <Input
                            type="email"
                            placeholder="Enter your registered email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="h-12"
                        />

                        {/* OTP Input Fields */}
                        <div className="flex justify-center gap-2">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <Input
                                    key={i}
                                    type="text"
                                    maxLength={1}
                                    value={otp[i] || ""}
                                    onChange={(e) => {
                                        const newOtp = otp.split("")
                                        newOtp[i] = e.target.value
                                        setOtp(newOtp.join(""))
                                        // Auto focus next input
                                        if (e.target.value && i < 5) {
                                            const nextInput = document.getElementById(`otp-${i + 1}`)
                                            if (nextInput) nextInput.focus()
                                        }
                                    }}
                                    id={`otp-${i}`}
                                    className="h-14 w-14 text-center text-xl font-semibold"
                                />
                            ))}
                        </div>

                        {/* Verify Button */}
                        <div className="pt-2">
                            <Button
                                onClick={handleVerify}
                                disabled={!email || otp.length < 6 || isVerifying}
                                className="w-full"
                            >
                                {isVerifying ? (
                                    <motion.span
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        className="inline-block"
                                    >
                                        🔄
                                    </motion.span>
                                ) : (
                                    "Verify Account"
                                )}
                            </Button>
                        </div>

                        {/* Resend OTP Link */}
                        <div className="text-center text-sm text-muted-foreground">
                            <p>Didn&apos;t receive a code?</p>
                            {" "}
                            <button
                                onClick={handleResendOtp}
                                disabled={!email || isResending}
                                className="text-primary hover:underline font-medium disabled:opacity-50"
                            >
                                {isResending ? "Sending..." : "Resend Code"}
                            </button>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    )
}