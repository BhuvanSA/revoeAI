"use client";
import React, { useState } from "react";
import { useAuthContext } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import SheetViewer from "@/components/SheetViewer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Dashboard() {
    const { isLoggedIn } = useAuthContext();
    const [sheetId, setSheetId] = useState(
        "1K0ciGZXkw8TXiZbMhLd5bkPVJ5fzCYWrxmbHa0mTFg8"
    );
    const [activeSheetId, setActiveSheetId] = useState<string | null>(null);

    const handleViewSheet = () => {
        if (sheetId) {
            setActiveSheetId(sheetId);
        }
    };

    if (!isLoggedIn) {
        return (
            <div className="flex justify-center items-center h-screen">
                Checking authentication...
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-6">Google Sheets Dashboard</h1>

            <div className="mb-8 p-4 bg-white rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">
                    Connect to a Google Sheet
                </h2>
                <div className="flex gap-4">
                    <Input
                        value={sheetId}
                        onChange={(e) => setSheetId(e.target.value)}
                        placeholder="Enter Google Sheet ID"
                        className="flex-1"
                    />
                    <Button onClick={handleViewSheet}>View Sheet</Button>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                    The Sheet ID is the part of the URL after /d/ and before
                    /edit
                </p>
            </div>

            {activeSheetId && (
                <div className="bg-white rounded-lg shadow p-6">
                    <SheetViewer sheetId={activeSheetId} />
                </div>
            )}
        </div>
    );
}
