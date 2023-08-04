import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwt_key } from "./utils/phrase_formatter";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const session = request.cookies.get("_session")?.value;

  if (path === "/" && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (path.startsWith("/dashboard") && !session) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (path.startsWith("/dashboard") && session) {
    const { payload } = await jwtVerify(session, jwt_key);
    const { address } = payload as { address: string };
    console.log(address);
    return NextResponse.rewrite(new URL(`/dashboard/${address}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard"],
};
