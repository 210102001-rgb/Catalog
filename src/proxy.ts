import { NextRequest, NextResponse } from "next/server";
import { verify } from "jsonwebtoken";

export function proxy(request: NextRequest) {
  // Public routes that don't require authentication
  const publicPaths = [
    "/api/auth/login",
    "/api/auth/register",
    "/api/auth/customer/login",
    "/api/auth/customer/register",
    "/api/auth/admin/login",
    "/api/auth/admin/register",
    "/login",
    "/register",
    "/customer-login",
    "/admin-login",
    "/",
    "/katalog",
    "/produk",
  ];

  // Check if the current path is public
  const isPublicPath = publicPaths.some((path) => request.nextUrl.pathname.startsWith(path));

  if (!isPublicPath) {
    // Get token from cookies
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
      // Redirect to appropriate login page based on intended destination
      if (request.nextUrl.pathname.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/admin-login", request.url));
      } else {
        return NextResponse.redirect(new URL("/customer-login", request.url));
      }
    }

    try {
      // Verify token
      const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
      const decoded = verify(token, JWT_SECRET) as { userId: string; role: string; email: string };

      // Add user info to request headers
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-user-id", decoded.userId);
      requestHeaders.set("x-user-role", decoded.role);
      requestHeaders.set("x-user-email", decoded.email);

      const response = NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });

      return response;
    } catch (error) {
      console.error("Token verification failed:", error);
      // Clear invalid token
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("auth_token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
