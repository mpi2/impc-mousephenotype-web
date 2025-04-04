const endpointURL = "http://wp-p1m-d7.ebi.ac.uk:8986/solr/images/select";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("mgiGeneAccessionId");
  const procedureName = searchParams.get("procedureName");
  if (!id || !procedureName) {
    return new Response("Missing parameter", { status: 400 });
  }
  const url = `${endpointURL}?q=mgi_accession_id:"${id}" AND sangerProcedureName: "${procedureName}"`;
  const response = await fetch(url);
  const data = await response.json();
  return Response.json(data);
}
