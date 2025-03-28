"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart2, Calendar, Table } from "lucide-react";
import GoToDashboard from "@/components/GoToDashboard";

export default function Home() {
    return (
        <div className="min-h-screen bg-background">
            {/* Navbar */}
            <nav className="container mx-auto py-6 px-4 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <Image
                        width={50}
                        height={37.5}
                        src="/logo.png"
                        alt="RevoeAI Logo"
                    />
                    <span className="text-2xl font-bold">revoeAI</span>
                </div>
                <GoToDashboard />
            </nav>

            {/* Hero Section */}
            <section className="container mx-auto px-4 py-20 flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 mb-10 md:mb-0">
                    <h1 className="text-5xl font-bold leading-tight mb-6">
                        Turn your spreadsheets into
                        <span className="text-primary">
                            {" "}
                            intelligent insights
                        </span>
                    </h1>
                    <p className="text-xl text-muted-foreground mb-8 mr-2 pr-2">
                        RevoeAI enhances your Google Sheets with powerful
                        real-time analytics and dynamic data management
                        capabilities.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link href="/auth/signup">
                            <Button size="lg" className="px-8">
                                Get Started{" "}
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link href="https://www.loom.com/share/8e942a9477ac4ad1b32d32da5ea49804?sid=70873101-7ace-4474-9152-c5bdcd1997d5">
                            <Button variant="outline" size="lg">
                                Watch Demo
                            </Button>
                        </Link>
                    </div>
                </div>
                <div className="md:w-1/2">
                    <div className="relative rounded-lg shadow-xl overflow-hidden">
                        <Image
                            src="/dashboard-preview.png"
                            alt="RevoeAI Dashboard"
                            width={600}
                            height={400}
                            className="w-full h-auto"
                            // If you don't have this image, replace with:
                            // Use a placeholder or create a mockup image
                        />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="bg-muted py-20">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-16">
                        Key Features
                    </h2>
                    <div className="grid md:grid-cols-3 gap-10">
                        <div className="bg-card p-8 rounded-lg shadow-md">
                            <div className="rounded-full bg-accent p-3 w-fit mb-6">
                                <Table className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">
                                Real-time Google Sheets Integration
                            </h3>
                            <p className="text-muted-foreground">
                                Connect your spreadsheets and see data updates
                                instantly without constant refreshing.
                            </p>
                        </div>
                        <div className="bg-card p-8 rounded-lg shadow-md">
                            <div className="rounded-full bg-accent p-3 w-fit mb-6">
                                <BarChart2 className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">
                                Dynamic Column Management
                            </h3>
                            <p className="text-muted-foreground">
                                Add and customize new columns on the fly without
                                affecting your original data source.
                            </p>
                        </div>
                        <div className="bg-card p-8 rounded-lg shadow-md">
                            <div className="rounded-full bg-accent p-3 w-fit mb-6">
                                <Calendar className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">
                                Smart Data Types
                            </h3>
                            <p className="text-muted-foreground">
                                Work with specialized input fields for text,
                                dates, and other data types for better data
                                management.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How it Works */}
            <section className="container mx-auto px-4 py-20">
                <h2 className="text-3xl font-bold text-center mb-16">
                    How It Works
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="text-center">
                        <div className="rounded-full bg-primary text-primary-foreground w-12 h-12 flex items-center justify-center mx-auto mb-6">
                            1
                        </div>
                        <h3 className="text-xl font-semibold mb-3">
                            Connect Your Sheet
                        </h3>
                        <p className="text-muted-foreground">
                            Paste your Google Sheet URL and RevoeAI instantly
                            connects to your data.
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="rounded-full bg-primary text-primary-foreground w-12 h-12 flex items-center justify-center mx-auto mb-6">
                            2
                        </div>
                        <h3 className="text-xl font-semibold mb-3">
                            Customize Your View
                        </h3>
                        <p className="text-muted-foreground">
                            Add custom columns and configure data types to
                            enhance your spreadsheet.
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="rounded-full bg-primary text-primary-foreground w-12 h-12 flex items-center justify-center mx-auto mb-6">
                            3
                        </div>
                        <h3 className="text-xl font-semibold mb-3">
                            Analyze in Real-time
                        </h3>
                        <p className="text-muted-foreground">
                            Watch your data update in real-time and gain
                            valuable insights instantly.
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-primary text-primary-foreground py-16">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-6">
                        Ready to transform your spreadsheets?
                    </h2>
                    <p className="text-xl mb-8 max-w-2xl mx-auto">
                        Join RevoeAI today and experience a smarter way to work
                        with your Google Sheets data.
                    </p>
                    <Link href="/dashboard">
                        <Button size="lg" variant="secondary">
                            Get Started for Free
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
