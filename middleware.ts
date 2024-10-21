import { NextRequest, NextResponse } from "next/server";
import logger from "./logger";

const isURLImage = (path: string) => {
  const types = ["png", "svg", "ico", "jpeg", "jpg", "webp", "gif"];
  return types.some((type) => path.endsWith(`.${type}`));
};

// WIP
const hasNextJsMiddlewareHeader = (headers: Headers) => {
  return (
    headers.has("x-middleware-prefetch") &&
    headers.get("x-middleware-prefetch") === "1"
  );
};

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const headers = request.headers;
  const log = {
    method: request.method,
    path: request.nextUrl.pathname,
    params: request.nextUrl.search || null,
    ua: request.headers.get("user-agent") || null,
    isPrefetch: hasNextJsMiddlewareHeader(headers),
  };
  if (!path.startsWith("/_next") && !isURLImage(path)) {
    logger.info(log);
  }

  return NextResponse.next();
}
