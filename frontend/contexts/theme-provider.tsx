"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Button } from "@/components/ui/button";
import { SunIcon, MoonIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeProvider({
    children,
    ...props
}: {
    children: React.ReactNode;
}) {
    const [mounted, setMounted] = useState(false);

    // Prevent hydration mismatch by only rendering children when mounted
    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <NextThemesProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            {...props}
        >
            {mounted ? (
                children
            ) : (
                <div style={{ visibility: "hidden" }}>{children}</div>
            )}
        </NextThemesProvider>
    );
}

export function ThemeToggler({
    className,
    ...rest
}: { className?: string } & Record<string, any>) {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        // Return an empty button with same dimensions to prevent layout shift
        return <Button variant="ghost" size="icon" {...rest} />;
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            {...rest}
        >
            {theme === "dark" ? (
                <MoonIcon
                    className={`transition-all text-primary ${className || ""}`}
                />
            ) : (
                <SunIcon
                    className={`transition-all text-primary ${className || ""}`}
                />
            )}
        </Button>
    );
}
