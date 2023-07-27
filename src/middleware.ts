import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // const path = request.nextUrl.pathname;

  console.log("cookie *******************************");

  console.log(request.cookies.get("_session"));

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard"],
};
