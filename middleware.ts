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

export function middleware(request: NextRequest) {
  const LOGGING_ENABLED = process.env.LOGGING_ENABLED === "true";
  const isProd = process.env.NODE_ENV === "production";
  const upgradeInsecureRequests =
    (process.env.UPGRADE_INSECURE_REQUESTS ?? "true") === "true";
  const cspHeader = `
    default-src 'none';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' *.googletagmanager.com *.usercentrics.eu;
    style-src 'self' 'unsafe-inline';
    connect-src 'self' *.mousephenotype.org *.usercentrics.eu *.google.com *.ebi.ac.uk *.google-analytics.com *.amazonaws.com *.gentar.org stats.g.doubleclick.net ${!isProd ? "localhost:8010 localhost:5000" : ""};
    img-src 'self' blob: data: *.usercentrics.eu *.ebi.ac.uk *.amazonaws.com *.google.co.uk;
    frame-src *.usercentrics.eu monarchinitiative.org ${!isProd ? "localhost:5173" : ""};
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    ${upgradeInsecureRequests ? "upgrade-insecure-requests;" : ""}
`;

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

  const response = NextResponse.next();
  response.headers.set("Content-Security-Policy", cspHeader.replace(/\n/g, ""));
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
