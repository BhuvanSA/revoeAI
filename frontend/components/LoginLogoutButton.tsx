"use client";

import React from "react";
import Link from "next/link";
import { useAuthContext } from "@/contexts/auth-context";

const LoginLogoutButton = () => {
    const { isLoggedIn } = useAuthContext();

    return (
        <div>
            {isLoggedIn ? (
                <>
                    <Link
                        href="/auth/logout"
                        className="cursor-pointer text-foreground hover:opacity-[0.9]"
                    >
                        Logout
                    </Link>
                </>
            ) : (
                <>
                    <Link
                        href="/auth/login"
                        className="cursor-pointer text-foreground hover:opacity-[0.9]"
                    >
                        Login
                    </Link>
                </>
            )}
        </div>
    );
};

export default LoginLogoutButton;
