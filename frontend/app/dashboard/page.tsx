"use client";
import React, { useEffect, useState } from "react";
import { useAuthContext } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import SheetViewer from "@/components/SheetViewer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Image from "next/image";
import Link from "next/link";
import { LoadingButton } from "@/components/LoadingButton";

// Function to extract Sheet ID from Google Sheets URL
const extractSheetId = (url: string): string | null => {
    try {
        // Handle both URL and direct ID input

        // If it's already just an ID (no slashes or spaces)
        if (/^[a-zA-Z0-9_-]+$/.test(url.trim())) {
            return url.trim();
        }

        // Extract from full URL
        const regex = /\/d\/([a-zA-Z0-9_-]+)(?:\/|$)/;
        const match = url.match(regex);

        if (match && match[1]) {
            return match[1];
        }

        return null;
    } catch (error) {
        console.error("Error extracting sheet ID:", error);
        return null;
    }
};

export default function Dashboard() {
    const router = useRouter();
    const { isLoggedIn, userId, isAuthLoading } = useAuthContext();

    useEffect(() => {
        if (!isLoggedIn && !isAuthLoading) {
            router.replace("/auth/login");
        }
    }, [isAuthLoading, isLoggedIn, router]);

    const [sheetUrl, setSheetUrl] = useState(
        "https://docs.google.com/spreadsheets/d/1K0ciGZXkw8TXiZbMhLd5bkPVJ5fzCYWrxmbHa0mTFg8/edit"
    );
    const [activeSheetId, setActiveSheetId] = useState<string | null>(null);
    const [urlError, setUrlError] = useState<string | null>(null);

    const handleViewSheet = () => {
        setUrlError(null);

        if (!sheetUrl.trim()) {
            setUrlError("Please enter a Google Sheet URL");
            return;
        }

        const extractedId = extractSheetId(sheetUrl);

        if (!extractedId) {
            setUrlError("Invalid Google Sheet URL. Please check the format.");
            return;
        }

        console.log(
            `Extracted Sheet ID: ${extractedId} from URL: ${sheetUrl} user Id: ${userId}`
        );
        setActiveSheetId(extractedId);
    };

    return (
        <div className="container mx-auto min-h-screen py-8">
            <div className="flex justify-between items-center mb-6">
                <div className="flex flex-row">
                    <Image
                        width={50}
                        height={37.5}
                        src="/logo.png"
                        alt="logo"
                    />
                    <h1 className="text-3xl font-bold">revoeAI</h1>
                </div>
                <Link href="/auth/logout">
                    <Button variant="outline">Logout</Button>
                </Link>
            </div>

            <div className="mb-8 p-4 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">
                    Connect to a Google Sheet
                </h2>
                <div className="flex gap-4">
                    <Input
                        value={sheetUrl}
                        onChange={(e) => setSheetUrl(e.target.value)}
                        placeholder="Paste Google Sheet URL here"
                        className="flex-1"
                    />
                    <LoadingButton onClick={handleViewSheet} className="w-32">
                        View Sheet
                    </LoadingButton>
                </div>

                {urlError && (
                    <Alert variant="destructive" className="mt-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{urlError}</AlertDescription>
                    </Alert>
                )}

                <p className="mt-2 text-sm text-gray-500">
                    Paste the full Google Sheet URL (e.g.,
                    https://docs.google.com/spreadsheets/d/...)
                </p>
            </div>

            {activeSheetId && userId && (
                <div className="rounded-lg shadow p-6">
                    <SheetViewer sheetId={activeSheetId} />
                </div>
            )}
        </div>
    );
}
