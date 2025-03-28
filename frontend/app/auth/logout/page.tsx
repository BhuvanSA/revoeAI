"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/api-client";
import { useAuthContext } from "@/contexts/auth-context";

const Page = () => {
    const router = useRouter();
    const { setIsLoggedIn } = useAuthContext();

    useEffect(() => {
        const performLogout = async () => {
            // Give a brief delay to show the message
            const response = await apiClient.get("/api/auth/logout");
            if (response.data.success) {
                setIsLoggedIn(false);
                router.replace("/auth/login");
            } else {
                console.log("error logging out");
            }
        };

        performLogout();
    }, []);

    return (
        <div className="h-screen w-full flex flex-col items-center justify-center">
            <div className="text-2xl font-medium mb-4">Logging out...</div>
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
    );
};

export default Page;
