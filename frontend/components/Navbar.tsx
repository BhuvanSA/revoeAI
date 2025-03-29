"use client";
import React, { useState } from "react";
import { Menu } from "@/components/ui/navbar-menu";
import { cn } from "@/lib/utils";
import { ThemeToggler } from "@/contexts/theme-provider";
import LoginLogoutButton from "./LoginLogoutButton";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { scrollToSection } from "@/lib/utils";

export function NavbarDemo() {
    return (
        <div className="relative w-full flex items-center justify-center">
            <Navbar className="top-2" />
        </div>
    );
}

function Navbar({ className }: { className?: string }) {
    const [active, setActive] = useState<string | null>(null);
    const pathname = usePathname();

    const handleKeyFeaturesClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (pathname !== "/") {
            window.location.href = "/#key-features";
            return;
        }
        scrollToSection("key-features");
    };

    return (
        <div
            className={cn(
                "fixed top-10 inset-x-0 max-w-sm mx-auto z-50",
                className
            )}
        >
            <Menu setActive={setActive}>
                <Link href="/" className="flex items-center ml-2">
                    Home
                </Link>
                <button
                    onClick={handleKeyFeaturesClick}
                    className="flex items-center ml-2"
                >
                    Key-Features
                </button>
                <LoginLogoutButton />
                <ThemeToggler />
            </Menu>
        </div>
    );
}
