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
import { useAuthContext } from "@/contexts/auth-context";
import { loginSchema } from "@/lib/schemas/auth";
import { toast } from "sonner";
import Link from "next/link";
import apiClient from "@/lib/api-client";

export default function SignIn() {
    const router = useRouter();
    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { setIsLoggedIn } = useAuthContext();

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(values: z.infer<typeof loginSchema>) {
        setIsLoading(true);
        try {
            const response = await apiClient.post("/api/auth/login", {
                email: values.email,
                password: values.password,
            });
            if (response.data.success) {
                setIsLoggedIn(true);
                router.push("/dashboard");
                toast.success("Login successful!", {
                    description: "You have been logged in successfully",
                });
            } else {
                form.setError("email", {
                    type: "manual",
                    message: "Invalid credentials",
                });
                form.setError("password", {
                    type: "manual",
                    message: "Invalid credentials",
                });
                setError(response.data.message);
                setIsLoading(false);
            }
        } catch (error: unknown) {
            setError("An error occurred during login");
            console.error(error);
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 rounded">
            <Card className="w-full max-w-md bg-card text-card-foreground rounded-lg">
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
                        Login
                    </CardTitle>
                    <CardDescription className="text-center text-muted-foreground">
                        Use your registered email-id and password.
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
                                            Registered Email ID
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
                                                placeholder="Enter your password"
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
                                Sign In
                            </LoadingButton>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                    <div className="relative w-full">
                        <Button
                            variant="link"
                            className="w-full -mt-4 text-primary hover:text-primary/90"
                            onClick={() => router.push("/auth/forgotpassword")}
                        >
                            Forgot Password?
                        </Button>
                    </div>
                    <div className="relative w-full">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">
                                Not yet Registered?
                            </span>
                        </div>
                    </div>
                    <Link href={"/auth/signup"} className="w-full">
                        <Button
                            variant="outline"
                            className="w-full border-border hover:bg-secondary"
                        >
                            Sign Up
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
