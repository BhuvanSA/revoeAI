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
                <MenuItem setActive={setActive} active={active} item="Services">
                    <div className="flex flex-col space-y-2 text-sm">
                        <HoveredLink href="/">Web Development</HoveredLink>
                        <HoveredLink href="/">Interface Design</HoveredLink>
                        <HoveredLink href="/">
                            Search Engine Optimization
                        </HoveredLink>
                        <HoveredLink href="/">Branding</HoveredLink>
                    </div>
                </MenuItem>
                <MenuItem setActive={setActive} active={active} item="Products">
                    <div className="  text-sm grid grid-cols-2 gap-10 p-2">
                        <ProductItem
                            title="Algochurn"
                            href="/"
                            src="/dashboard-preview.png"
                            description="Prepare for tech interviews like never before."
                        />
                        <ProductItem
                            title="Tailwind Master Kit"
                            href="/"
                            src="/dashboard-preview.png"
                            description="Production ready Tailwind css components for your next project"
                        />
                        <ProductItem
                            title="Moonbeam"
                            href="/"
                            src="/dashboard-preview.png"
                            description="Never write from scratch again. Go from idea to blog in minutes."
                        />
                        <ProductItem
                            title="Rogue"
                            href="/"
                            src="/dashboard-preview.png"
                            description="Respond to government RFPs, RFIs and RFQs 10x faster using AI"
                        />
                    </div>
                </MenuItem>
                <MenuItem setActive={setActive} active={active} item="Pricing">
                    <div className="flex flex-col space-y-4 text-sm">
                        <HoveredLink href="/">Hobby</HoveredLink>
                        <HoveredLink href="/">Individual</HoveredLink>
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
