import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthContextProvider from "@/contexts/auth-context";
import { ThemeProvider } from "@/contexts/theme-provider";
import { NavbarDemo } from "@/components/Navbar";
import { Toaster } from "sonner";
import Footer from "@/components/Footer";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "RevoeAI | Google Sheets Analytics & Data Visualization",
    description:
        "Turn your spreadsheets into intelligent insights with RevoeAI. Real-time Google Sheets integration, dynamic columns, and powerful data analytics.",
    keywords: [
        "spreadsheet analytics",
        "Google Sheets integration",
        "data visualization",
        "real-time analytics",
        "spreadsheet automation",
        "business intelligence",
        "dynamic columns",
        "data management",
        "spreadsheet enhancement",
        "RevoeAI",
    ],
    authors: [{ name: "RevoeAI Team" }],
    openGraph: {
        title: "RevoeAI | Intelligent Spreadsheet Analytics",
        description:
            "Transform your Google Sheets with real-time analytics, dynamic columns, and smart data management.",
        url: "https://revoe-ai-iota.vercel.app/",
        siteName: "RevoeAI",
        images: [
            {
                url: "/og-image.png", // Create this image for social sharing
                width: 1200,
                height: 630,
                alt: "RevoeAI Dashboard Preview",
            },
        ],
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "RevoeAI | Intelligent Spreadsheet Analytics",
        description:
            "Transform your Google Sheets with real-time analytics and smart data management.",
        images: ["/twitter-image.png"], // Create this image for Twitter
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    metadataBase: new URL("https://revoe-ai-iota.vercel.app/"), // Update with your actual domain
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
                suppressHydrationWarning
            >
                <ThemeProvider>
                    <AuthContextProvider>
                        <NavbarDemo />
                        {children}
                        <Footer />
                        <Toaster />
                    </AuthContextProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
