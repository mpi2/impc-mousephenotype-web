const endpointURL = "http://wp-p1m-d7.ebi.ac.uk:8986/solr/images/select";
const imageURL = "http://hh-rke-wp-webadmin-20-worker-1.caas.ebi.ac.uk:30590/";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("mgiGeneAccessionId");
  const procedureName = searchParams.get("procedureName");
  if (!id || !procedureName) {
    return new Response("Missing parameter", { status: 400 });
  }
  const url = `${endpointURL}?rows=1000&q=mgi_accession_id:"${id}" AND sangerProcedureName: "${procedureName}"`;
  const response = await fetch(url);
  const data = await response.json();
  const processedImages = data.response.docs.map((image) => ({
    ...image,
    fullResolutionFilePath: `${imageURL}${image.fullResolutionFilePath.substring(7)}`,
    largeThumbnailFilePath: `${imageURL}${image.largeThumbnailFilePath.substring(7)}`,
    smallThumbnailFilePath: `${imageURL}${image.smallThumbnailFilePath.substring(7)}`,
    annotations: image.tagName.map((attribute, index) => ({
      name: attribute,
      value: image.tagValue[index],
    })),
  }));

  return Response.json({
    mutantImages: processedImages.filter((image) => image.genotype !== "WT"),
    wildtypeImages: processedImages.filter((image) => image.genotype === "WT"),
  });
}
