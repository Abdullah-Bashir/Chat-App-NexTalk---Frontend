"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify"; // <-- ADD THIS
import { FiLoader } from "react-icons/fi";

export default function SuccessPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "loading") return;

        if (!session) {
            router.replace("/login");
        } else {
            toast.success("Logged in successfully!"); // <-- ADD THIS
            setTimeout(() => {
                router.replace("/");
            }, 2000); // Wait 2 seconds to let toast show
        }
    }, [session, status, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <button
                disabled
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl shadow-lg animate-pulse focus:outline-none"
            >
                <FiLoader className="w-5 h-5 animate-spin" />
                <span className="font-medium">Verifying…</span>
            </button>
        </div>
    );
}
