"use client";
import React, { useState } from "react";
import {
    HoveredLink,
    Menu,
    MenuItem,
    ProductItem,
} from "@/components/ui/navbar-menu";
import { cn } from "@/lib/utils";
import { ThemeToggler } from "@/contexts/theme-provider";
import LoginLogoutButton from "./LoginLogoutButton";
import Link from "next/link";

export function NavbarDemo() {
    return (
        <div className="relative w-full flex items-center justify-center">
            <Navbar className="top-2" />
        </div>
    );
}

function Navbar({ className }: { className?: string }) {
    const [active, setActive] = useState<string | null>(null);
    return (
        <div
            className={cn(
                "fixed top-10 inset-x-0 max-w-md mx-auto z-50",
                className
            )}
        >
            <Menu setActive={setActive}>
                <Link href="/" className="flex items-center ml-2">
                    Home
                </Link>
                <MenuItem setActive={setActive} active={active} item="Features">
                    <div className="flex flex-col space-y-2 text-sm">
                        <HoveredLink href="/">Real-time Data Sync</HoveredLink>
                        <HoveredLink href="/">Custom Columns</HoveredLink>
                        <HoveredLink href="/">Data Filtering</HoveredLink>
                        <HoveredLink href="/">Data Visualization</HoveredLink>
                    </div>
                </MenuItem>
                <MenuItem
                    setActive={setActive}
                    active={active}
                    item="Solutions"
                >
                    <div className="text-sm grid grid-cols-2 gap-10 p-2">
                        <ProductItem
                            title="Sheet Analyzer"
                            href="/"
                            src="/dashboard-preview.png"
                            description="Instant analytics for your Google Sheets data with real-time insights."
                        />
                        <ProductItem
                            title="Column Manager"
                            href="/"
                            src="/dashboard-preview.png"
                            description="Add custom columns and data types to enhance your spreadsheet capabilities."
                        />
                        <ProductItem
                            title="Data Explorer"
                            href="/"
                            src="/dashboard-preview.png"
                            description="Explore and filter your data with an intuitive, responsive interface."
                        />
                        <ProductItem
                            title="Enterprise Hub"
                            href="/"
                            src="/dashboard-preview.png"
                            description="Secure, scalable solutions for teams managing large datasets."
                        />
                    </div>
                </MenuItem>
                <MenuItem setActive={setActive} active={active} item="Pricing">
                    <div className="flex flex-col space-y-4 text-sm">
                        <HoveredLink href="/">Free</HoveredLink>
                        <HoveredLink href="/">Pro</HoveredLink>
                        <HoveredLink href="/">Team</HoveredLink>
                        <HoveredLink href="/">Enterprise</HoveredLink>
                    </div>
                </MenuItem>
                <LoginLogoutButton />
                <ThemeToggler />
            </Menu>
        </div>
    );
}
