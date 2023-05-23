import React from "react";
import Card from "../../Card";
import useQuery from "../../useQuery";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";

const AlleleMap = ({
  mgiGeneAccessionId,
  alleleName,
}: {
  mgiGeneAccessionId: string;
  alleleName: string;
}) => {
  const [data, loading, error] = useQuery({
    query: `/api/v1/alleles/es_cell/get_by_mgi_and_allele_name/${mgiGeneAccessionId}/${alleleName}`,
  });

  if (!data || (Array.isArray(data) && data.length === 0)) {
    return null;
  }

  const {
    otherLinks: { genbankFile, alleleSimpleImage, emsembleUrl },
  } = data[0];

  return (
    <Card>
      <h2>Allele Map</h2>
      <p className="mb-0">
        {genbankFile && (
          <>
            <a href={genbankFile} target="_blank">
              <FontAwesomeIcon icon={faExternalLinkAlt} /> Genbank
            </a>{" "}
            <span className="grey ms-2 me-2">|</span>
          </>
        )}

        {emsembleUrl && (
          <a href={emsembleUrl} target="_blank">
            <FontAwesomeIcon icon={faExternalLinkAlt} /> Ensemble
          </a>
        )}
      </p>
      {!!alleleSimpleImage && (
        <div>
          <img
            src={alleleSimpleImage}
            style={{ display: "block", maxWidth: "100%" }}
          />
        </div>
      )}
    </Card>
  );
};

export default AlleleMap;
