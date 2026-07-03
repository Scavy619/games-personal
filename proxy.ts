import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

const PUBLIC_WRITE_PATHS = ["/api/contact", "/api/chat", "/api/auth/login"];

async function hasValidSession(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return false;
  return verifySessionToken(token);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") return NextResponse.next();
    const authed = await hasValidSession(request);
    if (!authed) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/api")) {
    const isMutating = ["POST", "PUT", "DELETE", "PATCH"].includes(request.method);
    const isPublicWrite = PUBLIC_WRITE_PATHS.some((p) => pathname.startsWith(p));
    if (isMutating && !isPublicWrite) {
      const authed = await hasValidSession(request);
      if (!authed) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
