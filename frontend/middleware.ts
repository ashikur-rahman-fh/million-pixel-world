import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(_request: NextRequest) {
  const response = NextResponse.next();

  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("text/html")) {
    response.headers.set("Cache-Control", "public, max-age=0, s-maxage=300, must-revalidate");
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
};
