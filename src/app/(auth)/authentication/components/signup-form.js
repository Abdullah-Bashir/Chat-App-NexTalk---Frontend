
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Github, Loader2 } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { useRegisterUserMutation } from "@/app/redux/api/authApi"; // import the hook

export function SignupForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    // Using RTK Query hook for registration
    const [registerUser] = useRegisterUserMutation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Call RTK Query mutation to register the user
            const response = await registerUser({ name, email, password }).unwrap();

            // Show success message
            toast.success("Account created successfully! Please check your email for the verification code.");

            // Redirect the user to the verify OTP page
            router.push("/verify-otp");

        } catch (error) {
            console.error("Signup failed:", error);
            toast.error(error.message || "Registration failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };


    const handleSocialSignup = async (provider) => {
        setIsLoading(true);
        try {
            await signIn(provider, { callbackUrl: "/chat" });
        } catch (error) {
            toast.error(`${provider} signup failed.`);
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="space-y-3 text-xs "
        >
            <form onSubmit={handleSubmit} className="space-y-2">
                <div className="space-y-1">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                        id="name"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        disabled={isLoading}
                        className="h-8 text-xs"
                    />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="email-signup">Email</Label>
                    <Input
                        id="email-signup"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                        className="h-8 text-xs"
                    />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="password-signup">Password</Label>
                    <Input
                        id="password-signup"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                        className="h-8 text-xs"
                    />
                </div>
                <Button type="submit" className="w-full h-8 text-xs" disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                            Creating...
                        </>
                    ) : (
                        "Create Account"
                    )}
                </Button>
            </form>

            <div className="flex items-center gap-2 my-1">
                <Separator className="flex-1" />
                <span className="text-[10px] text-muted-foreground">or continue with</span>
                <Separator className="flex-1" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-2 gap-2"
            >
                <Button variant="outline" type="button" disabled={isLoading} onClick={() => handleSocialSignup("google")} className="text-xs h-8">
                    <FcGoogle className="mr-2 h-4 w-4" />
                    Google
                </Button>
                <Button variant="outline" type="button" disabled={isLoading} onClick={() => handleSocialSignup("github")} className="text-xs h-8">
                    <Github className="mr-2 h-4 w-4" />
                    GitHub
                </Button>
            </motion.div>
        </motion.div>
    );
}
