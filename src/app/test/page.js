"use client";

import { useSession } from "next-auth/react";

export default function SessionChecker() {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return <div>Loading session...</div>;
    }

    return (
        <div>
            {session ? (
                <>
                    <h2>✅ You are logged in</h2>
                    <p>User: {session.user.email}</p>
                </>
            ) : (
                <h2>❌ You are NOT logged in</h2>
            )}
        </div>
    );
}
