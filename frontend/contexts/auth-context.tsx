"use client";
import apiClient from "@/lib/api-client";
import React, { createContext, useState, useContext, useEffect } from "react";

type AuthContextProviderProps = {
    children: React.ReactNode;
};

type AuthContext = {
    isLoggedIn: boolean;
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
    setUser: React.Dispatch<React.SetStateAction<boolean>>;
    checkAuth: () => Promise<void>;
    userId: string | null;
};

export const AuthContext = createContext<AuthContext | null>(null);

export default function AuthContextProvider({
    children,
}: AuthContextProviderProps) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUser] = useState(null);
    console.log("userID is currently", userId);

    const checkAuth = async () => {
        try {
            const response = await apiClient.get("/api/auth/checkAuth");
            if (response.data.success) {
                setIsLoggedIn(response.data.success);
                setUser(response.data.user);
            } else {
                console.log("Auth check failed");
                setIsLoggedIn(false);
            }
        } catch (error) {
            console.log("Auth check failed:", error);
            setIsLoggedIn(false);
            setUser(null);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider
            value={{ isLoggedIn, setIsLoggedIn, checkAuth, userId, setUser }}
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
