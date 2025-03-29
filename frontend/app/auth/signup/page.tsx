"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { LoadingButton } from "@/components/LoadingButton";
import { toast } from "sonner";
import Link from "next/link";
import apiClient from "@/lib/api-client";

// Define signup schema with password confirmation
const signupSchema = z
    .object({
        email: z.string().email({
            message: "Please enter a valid email address.",
        }),
        password: z.string().min(8, {
            message: "Password must be at least 8 characters.",
        }),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export default function SignUp() {
    const router = useRouter();
    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const form = useForm<z.infer<typeof signupSchema>>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    async function onSubmit(values: z.infer<typeof signupSchema>) {
        setIsLoading(true);
        try {
            const response = await apiClient.post("/api/auth/register", {
                email: values.email,
                password: values.password,
            });
            if (response.data.success) {
                router.replace("/auth/login");
                toast.success("Account created successfully!", {
                    description: "Welcome to RevoeAI",
                });
            } else {
                form.setError("email", {
                    type: "manual",
                    message: response.data.message || "Registration failed",
                });
                setError(response.data.message);
                setIsLoading(false);
            }
        } catch (error: unknown) {
            setError("An error occurred during registration");
            console.error(error);
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 rounded-2xl">
            <Card className="w-full max-w-md bg-card text-card-foreground rounded-2xl">
                <CardHeader>
                    <div className="mx-auto">
                        <Image
                            src="/logo.png"
                            height={75}
                            width={100}
                            alt="revoe logo"
                        />
                    </div>
                    <CardTitle className="text-2xl text-center font-bold text-foreground">
                        Create Account
                    </CardTitle>
                    <CardDescription className="text-center text-muted-foreground">
                        Enter your details to create an account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-4"
                        >
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-foreground">
                                            Email
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                className="bg-background border-input"
                                                placeholder="Enter your email"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-destructive" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-foreground">
                                            Password
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                className="bg-background border-input"
                                                type="password"
                                                placeholder="Create a password"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-destructive" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-foreground">
                                            Confirm Password
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                className="bg-background border-input"
                                                type="password"
                                                placeholder="Confirm your password"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-destructive" />
                                    </FormItem>
                                )}
                            />
                            {error && (
                                <div className="text-sm text-destructive text-center">
                                    {error}
                                </div>
                            )}
                            <LoadingButton type="submit" loading={isLoading}>
                                Sign Up
                            </LoadingButton>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                    <div className="relative w-full">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">
                                Already have an account?
                            </span>
                        </div>
                    </div>
                    <Link href={"/auth/login"} className="w-full">
                        <Button
                            variant="outline"
                            className="w-full border-border hover:bg-secondary"
                        >
                            Sign In
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
