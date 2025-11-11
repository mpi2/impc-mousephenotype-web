import { fetchLandingPageData } from "@/api-service";

export async function GET() {
  const releaseJSON = await fetchLandingPageData("release_metadata", {
    cache: "no-store",
  });
  return Response.json(releaseJSON);
}
