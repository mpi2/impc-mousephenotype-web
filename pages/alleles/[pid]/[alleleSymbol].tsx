import { Button, Container } from "react-bootstrap";
import Search from "../../../components/Search";
import Card from "../../../components/Card";
import { useRouter } from "next/router";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeftLong,
  faArrowRightLong,
  faCartShopping,
  faExternalLinkAlt,
} from "@fortawesome/free-solid-svg-icons";
import Head from "next/head";
import styles from "./styles.module.scss";
import Mice from "../../../components/Allele/Mice";
import ESCell from "../../../components/Allele/ESCell";
import TargetingVector from "../../../components/Allele/TVP";
import { formatAlleleSymbol } from "../../../utils";
import Crispr from "../../../components/Allele/Crispr";
import AlleleMap from "../../../components/Allele/AlleleMap.tsx";
import { useState } from "react";
import QCModal from "../../../components/Allele/QCModal.tsx";
import IntermediateVector from "../../../components/Allele/IVP";
import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "../../../api-service";

const ProductItem = ({
  name,
  link,
  hasData,
}: {
  name: string;
  link: string;
  hasData: boolean;
}) => (
  <div
    className={hasData ? styles.dataCollection : styles.dataCollectionInactive}
  >
    {name}
    <p className="mt-2">
      <a href={link}>
        <Button
          variant={hasData ? "secondary" : "grey"}
          disabled={!hasData}
          style={{ minWidth: 120 }}
        >
          {hasData ? (
            <span className="white">
              <FontAwesomeIcon icon={faCartShopping} />
              Order
            </span>
          ) : (
            "Not available"
          )}
        </Button>
      </a>
    </p>
  </div>
);

const Gene = () => {
  const {
    isReady,
    query: { pid, alleleSymbol },
  } = useRouter();

  const { data: alleles, isLoading, isError, error } = useQuery({
    queryKey: ['genes', pid, 'alleles', alleleSymbol, 'order'],
    queryFn: () => fetchAPI(`/api/v1/genes/${pid}/${alleleSymbol}/order`),
    enabled: isReady
  })

  const [qcData, setQcData] = useState<any[]>(null);

  const allele = (alleles ?? [])[0];

  if (isLoading) {
    return (
      <>
        <Search />
        <Container className="page">
          <Card>
            <Link href={`/genes/${pid}`} className="grey mb-3 small">
              <FontAwesomeIcon icon={faArrowLeftLong} />
              BACK TO GENE
            </Link>
            <br />
            <p className="grey">Loading...</p>
          </Card>
        </Container>
      </>
    );
  }
  if (isError) {
    return (
      <>
        <Search />
        <Container className="page">
          <Card>
            <Link href={`/genes/${pid}`} className="grey mb-3 small">
              <FontAwesomeIcon icon={faArrowLeftLong} />
              BACK TO GENE
            </Link>
            <h2 className="mt-4 mb-2">Failed to load allele data</h2>
            <p className="grey mb-4">
              Something went wrong. Please try again later.
            </p>
            <p className="grey mb-4">Error: {error.toString()}</p>
          </Card>
        </Container>
      </>
    );
  }

  const {
    mgiGeneAccessionId,
    alleleSymbol: geneAlleleSymbol,
    alleleDescription,
    productTypes,
  } = allele;

  const doesMiceProductsExist = productTypes.includes("mouse");
  const doesEsCellProductsExist = productTypes.includes("es_cell");
  const doesCrisprProductsExist = productTypes.includes("crispr");
  const doesIntermediateVectorProductsExist = productTypes.includes(
    "intermediate_vector"
  );
  const doesTargetingVectorProductsExist =
    productTypes.includes("targeting_vector");

  const esCellProductTypes = [
    { name: "Mice", link: "#mice", hasData: doesMiceProductsExist },
    {
      name: "Targeted ES cells",
      link: "#esCell",
      hasData: doesEsCellProductsExist,
    },
    {
      name: "Targeting vectors",
      link: "#targetingVector",
      hasData: doesTargetingVectorProductsExist,
    },
    {
      name: "Intermediate vectors",
      link: "#intermediateVector",
      hasData: doesIntermediateVectorProductsExist,
    },
  ];

  const crisprProductTypes = [
    { name: "Mice", link: "#mice", hasData: doesMiceProductsExist },
  ];

  const [geneSymbol] = formatAlleleSymbol(geneAlleleSymbol);

  return (
    <>
      <Head>
        <title>
          Allele Details | {geneSymbol} - {alleleSymbol} | International Mouse
          Phenotyping Consortium
        </title>
      </Head>
      <Search />
      <Container className="page">
        <Card>
          <Link href={`/genes/${pid}`} className="grey mb-3 small">
            <FontAwesomeIcon icon={faArrowLeftLong} />
            BACK TO GENE
          </Link>
          <p className={styles.subheading}>ALLELE</p>
          <h1 className="mb-2 mt-2">
            <strong>
              {geneSymbol}
              <sup>{alleleSymbol}</sup>
            </strong>{" "}
          </h1>
          <p className="mb-4 grey">{alleleDescription}</p>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {(doesCrisprProductsExist
              ? crisprProductTypes
              : esCellProductTypes
            ).map((productType) => (
              <ProductItem {...productType} />
            ))}
          </div>
        </Card>
        {doesEsCellProductsExist && (
          <AlleleMap
            mgiGeneAccessionId={mgiGeneAccessionId}
            alleleName={alleleSymbol as string}
          />
        )}
        {/* <Card>
          <h2>Allele Map</h2>
          <p className="mb-0">
            {genbankFileUrl && (
              <>
                <a href={genbankFileUrl} target="_blank">
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
          {!!alleleMapUrl && (
            <div>
              <img
                src={alleleMapUrl}
                style={{ display: "block", maxWidth: "100%" }}
              />
            </div>
          )}
        </Card> */}
        {doesMiceProductsExist && (
          <Mice
            isCrispr={doesCrisprProductsExist}
            mgiGeneAccessionId={mgiGeneAccessionId}
            alleleName={alleleSymbol as string}
            setQcData={setQcData}
          />
        )}
        {doesEsCellProductsExist && (
          <ESCell
            mgiGeneAccessionId={mgiGeneAccessionId}
            alleleName={alleleSymbol as string}
            setQcData={setQcData}
          />
        )}
        {doesTargetingVectorProductsExist && (
          <TargetingVector
            mgiGeneAccessionId={mgiGeneAccessionId}
            alleleName={alleleSymbol as string}
          />
        )}
        {doesIntermediateVectorProductsExist && (
          <IntermediateVector
            mgiGeneAccessionId={mgiGeneAccessionId}
            alleleName={alleleSymbol as string}
          />
        )}

        {doesCrisprProductsExist && (
          <Crispr
            mgiGeneAccessionId={mgiGeneAccessionId}
            alleleName={alleleSymbol as string}
          />
        )}
        <Card>
          <Link
            href={`/genes/${pid}/#purchase`}
            scroll={false}
            className="secondary"
          >
            See all alleles for the gene{" "}
            <FontAwesomeIcon icon={faArrowRightLong} />
          </Link>
        </Card>
      </Container>

      <QCModal
        onClose={() => {
          setQcData(null);
        }}
        qcData={qcData}
      />
    </>
  );
};

export default Gene;
