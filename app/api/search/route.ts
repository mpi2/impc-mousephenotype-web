import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const prefix = searchParams.get("query");
  const resp = await fetch(
    `http://impc-search-service:8080/v1/search?prefix=${prefix}`,
  );
  if (!resp.ok) {
    return Response.json({ status: resp.status, message: resp.statusText });
  }
  const data = await resp.json();
  return Response.json(data);
}
