"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export const useSyncNextAuthToken = () => {
    const { data: session } = useSession();

    useEffect(() => {
        if (session?.user?.email) {
            // 👇 Make a request to your Express backend to get a token
            fetch("http://localhost:5000/api/auth/generate-token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: session.user.email }),
            })
                .then(res => res.json())
                .then(data => {
                    if (data.token) {
                        localStorage.setItem("authToken", data.token);
                    }
                })
                .catch(err => {
                    console.error("Failed to sync token:", err);
                });
        }
    }, [session]);
};
