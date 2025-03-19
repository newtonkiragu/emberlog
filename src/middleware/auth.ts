import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Protect API routes
  if (path.startsWith("/api/v1")) {
    const token = await getToken({ req });

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized", status: 401 }
      );
    }
  }

  return NextResponse.next();
}