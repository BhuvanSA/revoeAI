import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
    const { cookies } = request;

    // Try different possible cookie names
    const sessionCookie =
        cookies.get("session") || cookies.get("auth") || cookies.get("token");

    // Debug in production (shows in server logs)
    console.log("Middleware path:", request.nextUrl.pathname);
    console.log(
        "Available cookies:",
        cookies
            .getAll()
            .map((c) => c.name)
            .join(", ")
    );

    // Check protected routes
    if (
        request.nextUrl.pathname.startsWith("/dashboard") ||
        request.nextUrl.pathname.startsWith("/settings")
    ) {
        // If no session cookie, redirect to login
        if (!sessionCookie) {
            console.log("No valid session cookie found, redirecting");
            return NextResponse.redirect(new URL("/auth/login", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/settings/:path*"],
};
