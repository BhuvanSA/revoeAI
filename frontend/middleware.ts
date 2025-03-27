import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
    const { cookies } = request;
    const sessionCookie = cookies.get("session");

    // Check if user is logged in
    if (!sessionCookie && !request.nextUrl.pathname.startsWith("/auth")) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/settings/:path*",
        // Add other protected routes
    ],
};
