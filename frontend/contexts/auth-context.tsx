"use client";
import apiClient from "@/lib/api-client";
import React, { createContext, useState, useContext, useEffect } from "react";

type AuthContextProviderProps = {
    children: React.ReactNode;
};

type AuthContext = {
    isLoggedIn: boolean;
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
    checkAuth: () => Promise<void>;
    user: string | null;
};

export const AuthContext = createContext<AuthContext | null>(null);

export default function AuthContextProvider({
    children,
}: AuthContextProviderProps) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);

    const checkAuth = async () => {
        try {
            setUser(null);
            const response = await apiClient.get("/api/auth/checkAuth");
            if (response.data.success) {
                setIsLoggedIn(response.data.success);
                setUser(response.data.user);
            } else {
                console.error("Auth check failed");
                setIsLoggedIn(false);
                setUser(null);
            }
        } catch (error) {
            console.error("Auth check failed:", error);
            setIsLoggedIn(false);
            setUser(null);
        }
    };

    useEffect(() => {
        console.log("verifying session");
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider
            value={{ isLoggedIn, setIsLoggedIn, checkAuth, user }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuthContext() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error(
            "useAuthContext must be used within an AuthContextProvider"
        );
    }
    return context;
}
