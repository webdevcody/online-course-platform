/* eslint-disable @typescript-eslint/no-explicit-any */
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  const {
    data: { auth },
  } = await fetch(`${url.origin}/api/authSSR`, {
    headers: req.headers,
  }).then((res) => res.json());

  url.search = new URLSearchParams(`callbackUrl=${url}`).toString();
  url.pathname = `/api/auth/signin`;

  return !auth ? NextResponse.redirect(url) : NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/dashboard/courses"],
};
