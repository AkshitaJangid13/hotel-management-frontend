import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  // 👉 1. If user goes to root "/"
  if (pathname === "/") {
    if (token) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    } else {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // 👉 2. If user goes to login page
  if (pathname.startsWith("/login")) {
    if (token) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // 👉 3. Protect dashboard (and other private routes)
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

// Apply to all routes except static
export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};