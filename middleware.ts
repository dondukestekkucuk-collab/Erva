import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "default-secret-change-me"
);

const publicPaths = ["/giris", "/kayit"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip API routes and static files
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get("auth-token")?.value;
  const isPublicPath = publicPaths.some((p) => pathname.startsWith(p));

  // If user has valid token
  if (token) {
    try {
      await jwtVerify(token, JWT_SECRET);

      // Logged-in user trying to access login/register -> redirect to home
      if (isPublicPath) {
        return NextResponse.redirect(new URL("/", req.url));
      }

      return NextResponse.next();
    } catch {
      // Invalid token - clear it and redirect to login
      const response = NextResponse.redirect(new URL("/giris", req.url));
      response.cookies.delete("auth-token");
      return response;
    }
  }

  // No token - allow public paths, redirect others to login
  if (isPublicPath) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/giris", req.url));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
