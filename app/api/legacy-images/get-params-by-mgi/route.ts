const endpointURL =
  "http://wp-p1m-d7.ebi.ac.uk:8986/solr/images/select?facet=on&facet.field=sangerProcedureName";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("mgiGeneAccessionId");
  if (!id) {
    return new Response("Missing mgiGeneAccessionId parameter", {
      status: 400,
    });
  }
  const url = `${endpointURL}&q=mgi_accession_id:"${id}"`;
  const response = await fetch(url);
  const data = await response.json();
  const facetData: Array<any> =
    data.facet_counts.facet_fields.sangerProcedureName;
  let isDone = false;
  const results: Record<string, number> = {};
  do {
    const paramName: string = facetData.shift();
    const count: number = facetData.shift();
    if (count === 0) {
      isDone = true;
      break;
    }
    results[paramName] = count;
  } while (!isDone);
  return Response.json(results);
}
