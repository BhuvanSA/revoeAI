import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
    const { cookies } = request;

    // Try different possible cookie names
    const sessionCookie =
        cookies.get("session") || cookies.get("auth") || cookies.get("token");

    // Enhanced debugging with safe cookie info
    console.log("Middleware path:", request.nextUrl.pathname);
    console.log(
        "Available cookies:",
        cookies
            .getAll()
            .map((c) => c.name)
            .join(", ")
    );

    if (sessionCookie) {
        // Log first few characters of token to verify format (safe for logs)
        const tokenPreview = sessionCookie.value.substring(0, 12) + "...";
        console.log("Session token found:", tokenPreview);
    }

    // Add request header info to check for origin/referer
    console.log("Request headers:", {
        origin: request.headers.get("origin"),
        referer: request.headers.get("referer"),
        host: request.headers.get("host"),
    });

    // Check protected routes
    if (
        request.nextUrl.pathname.startsWith("/dashboard") ||
        request.nextUrl.pathname.startsWith("/settings")
    ) {
        if (!sessionCookie) {
            console.log("No valid session cookie found, redirecting to login");
            return NextResponse.redirect(new URL("/auth/login", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/settings/:path*"],
};
