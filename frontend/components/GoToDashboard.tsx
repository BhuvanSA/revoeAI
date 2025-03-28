"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/contexts/auth-context";

export default function GoToDashboard() {
    const { isLoggedIn } = useAuthContext();

    return (
        <div className="flex space-x-2">
            {isLoggedIn ? (
                <Link href="/dashboard">
                    <Button>Go to Dashboard</Button>
                </Link>
            ) : (
                <>
                    <Link href="/auth/login">
                        <Button variant="outline">Log in</Button>
                    </Link>
                    <Link href="/auth/signup">
                        <Button>Sign up</Button>
                    </Link>
                </>
            )}
        </div>
    );
}
