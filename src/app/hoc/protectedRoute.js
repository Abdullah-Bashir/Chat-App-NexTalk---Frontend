import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import LoadingAnimation from "../components/loading-animation";
import { useValidateTokenQuery } from "@/app/redux/api/authApi";

export default function ProtectedRoute(WrappedComponent) {
    return function Wrapper(props) {
        const router = useRouter();
        const [initialCheckDone, setInitialCheckDone] = useState(false);
        const [minLoadingDone, setMinLoadingDone] = useState(false);
        const startTimeRef = useRef(Date.now());
        const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

        const { data: user, isLoading, isError } = useValidateTokenQuery(undefined, {
            skip: !token,
        });

        useEffect(() => {
            // Set minimum loading time of 4 seconds
            const timer = setTimeout(() => {
                setMinLoadingDone(true);
            }, 4000);

            return () => clearTimeout(timer);
        }, []);

        useEffect(() => {
            if (!token) {
                // Wait until minimum loading time is done before redirecting
                const remainingTime = Math.max(0, 4000 - (Date.now() - startTimeRef.current));
                setTimeout(() => router.push("/authentication"), remainingTime);
                return;
            }

            if (!isLoading && minLoadingDone) {
                if (isError || !user?._id) {
                    router.push("/authentication");
                } else {
                    // Save userId to localStorage if token is valid
                    localStorage.setItem("userId", user._id);
                }
                setInitialCheckDone(true);
            }
        }, [token, isLoading, isError, user, router, minLoadingDone]);

        // Show loading animation for minimum 4 seconds or until auth check completes
        if (!minLoadingDone || !initialCheckDone || isLoading) {
            return <LoadingAnimation />;
        }

        if (!user?._id) {
            return null; // Redirect will happen from useEffect
        }

        return <WrappedComponent {...props} />;
    };
}
