import { NextRequest, NextResponse } from "next/server";
import logger from "./logger";

const isURLImage = (path: string) => {
  const types = ["png", "svg", "ico", "jpeg", "jpg", "webp", "gif"];
  return types.some((type) => path.endsWith(`.${type}`));
};

const hasNextJsMiddlewareHeader = (headers: Headers) => {
  return (
    headers.has("x-middleware-prefetch") &&
    headers.get("x-middleware-prefetch") === "1"
  );
};

const logRequest = (request: NextRequest) => {
  const LOGGING_ENABLED = process.env.LOGGING_ENABLED === "true";
  if (LOGGING_ENABLED) {
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
  }
};

export function middleware(request: NextRequest) {
  logRequest(request);
  const isDev = process.env.NODE_ENV === "development";
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const cspHeader = `
    default-src 'none';
    script-src 'self' 'nonce-${nonce}' ${isDev ? "'unsafe-eval'" : ""} 'strict-dynamic';
    style-src 'self' ${isDev ? "'unsafe-inline'" : `'nonce-${nonce}'`} ;
    connect-src 'self' ${isDev ? "localhost:8010" : ""} *.mousephenotype.org *.usercentrics.eu *.google-analytics.com *.google.com *.amazonaws.com *.gentar.org *.ebi.ac.uk;
    img-src 'self' blob: data: *.usercentrics.eu *.google.co.uk *.ebi.ac.uk;
    frame-src 'self' *.usercentrics.eu;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `;

  const contentSecurityPolicyHeaderValue = cspHeader
    .replace(/\s{2,}/g, " ")
    .trim();
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set(
    "Content-Security-Policy",
    contentSecurityPolicyHeaderValue,
  );
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  response.headers.set(
    "Content-Security-Policy",
    contentSecurityPolicyHeaderValue,
  );

  return response;
}

export const config = {
  matcher: [
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
