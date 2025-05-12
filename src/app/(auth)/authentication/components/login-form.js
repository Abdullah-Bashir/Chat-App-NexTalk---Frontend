"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react"; // Import signIn from next-auth
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { FcGoogle } from "react-icons/fc"; // Import Google icon
import { Github } from "lucide-react"; // Import GitHub icon
import { useLoginUserMutation } from "@/app/redux/api/authApi"; // import the hook

export function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    const [loginUser, { isLoading }] = useLoginUserMutation();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const { token } = await loginUser({ email, password }).unwrap();

            // Store token and redirect
            localStorage.setItem("authToken", token);
            toast.success("Logged in successfully!");
            router.push("/chat");
        } catch (error) {
            const errorMessage = error.data?.message || "Login failed";
            toast.error(errorMessage);

            // Clear password field on error
            if (errorMessage.includes("credentials")) {
                setPassword("");
            }
        }
    };

    const handleSocialLogin = async (provider) => {
        try {
            await signIn(provider, { callbackUrl: "/chat" });
        } catch (error) {
            toast.error(`${provider} login failed.`);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logging in...
                    </>
                ) : (
                    "Login"
                )}
            </Button>

            <div className="flex items-center gap-2 my-4">
                <div className="flex-1 border-t" />
                <span className="text-[10px] text-muted-foreground">or continue with</span>
                <div className="flex-1 border-t" />
            </div>

            <div className="grid grid-cols-2 gap-2">
                <Button
                    variant="outline"
                    type="button"
                    disabled={isLoading}
                    onClick={() => handleSocialLogin("google")}
                    className="text-xs h-8"
                >
                    <FcGoogle className="mr-2 h-4 w-4" />
                    Google
                </Button>
                <Button
                    variant="outline"
                    type="button"
                    disabled={isLoading}
                    onClick={() => handleSocialLogin("github")}
                    className="text-xs h-8"
                >
                    <Github className="mr-2 h-4 w-4" />
                    GitHub
                </Button>
            </div>
        </form>
    );
}
