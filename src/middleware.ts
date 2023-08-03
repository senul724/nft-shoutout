import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { ISession } from "./types/session";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const session = request.cookies.get("_session")?.value;

  if (path === "/" && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (path.startsWith("/dashboard") && !session) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (path.startsWith("/dashboard") && session) {
    const { address } = jwt.decode(session) as ISession;
    return NextResponse.rewrite(new URL(`/dashboard/${address}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard"],
};
