import { NextRequest, NextResponse } from "next/server";
import logger from "./logger";

export function middleware(request: NextRequest) {
  const log = {
    method: request.method,
    path: request.nextUrl.pathname,
    query: request.nextUrl.search || null,
    ua: request.headers.get("user-agent") || null,
  };
  logger.info(log);
  return NextResponse.next();
}
