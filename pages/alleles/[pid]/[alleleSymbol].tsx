import { Alert, Button, Container } from "react-bootstrap";
import Search from "../../../components/Search";
import _ from "lodash";
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
import Pagination from "../../../components/Pagination";
import SortableTable from "../../../components/SortableTable";
import useQuery from "../../../components/useQuery";
import Mice from "../../../components/Allele/Mice";
import ESCell from "../../../components/Allele/ESCell";
import TargetingVector from "../../../components/Allele/TVP";
import IntermediateVector from "../../../components/Allele/IVP";

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
    {/* <Check isChecked={hasData} /> */}
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
    query: { pid, alleleSymbol },
  } = useRouter();

  const [allele, loading, error] = useQuery({
    query: `/api/v1/alleles/${pid}/${alleleSymbol}`,
  });

  if (loading) {
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
  if (error) {
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
            <p className="grey mb-4">Error: {error}</p>
          </Card>
        </Container>
      </>
    );
  }

  const {
    mgiGeneAccessionId,
    geneSymbol,
    alleleName,
    alleleDescription,
    alleleMapUrl,
    genbankFileUrl,
    emsembleUrl,
    doesMiceProductsExist,
    doesEsCellProductsExist,
    doesCrisprProductsExist,
    doesIntermediateVectorProductsExist,
    doesTargetingVectorProductsExist,
  } = allele;

  const esCellProductTypes = [
    { name: "Mice", link: "#mice", hasData: doesMiceProductsExist },
    {
      name: "Targeted ES cells",
      link: "#esCell",
      hasData: doesEsCellProductsExist,
    },
    {
      name: "Targeted vectors",
      link: "#targetingVector",
      hasData: doesTargetingVectorProductsExist,
    },
    // {
    //   name: "Intermediate vectors",
    //   link: "#intermediateVector",
    //   hasData: doesIntermediateVectorProductsExist,
    // },
  ];

  const crisprProductTypes = [
    {
      name: "Crisprs",
      link: "#CRISPR",
      hasData: doesCrisprProductsExist,
    },
    { name: "Mice", link: "#mice", hasData: doesMiceProductsExist },
  ];

  return (
    <>
      <Head>
        <title>
          Allele Details | {geneSymbol}-{alleleName} | International Mouse
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
              <sup>{alleleName}</sup>
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
        <Card>
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
        </Card>
        {doesMiceProductsExist && (
          <Mice
            mgiGeneAccessionId={mgiGeneAccessionId}
            alleleName={alleleName}
          />
        )}
        {doesEsCellProductsExist && (
          <ESCell
            mgiGeneAccessionId={mgiGeneAccessionId}
            alleleName={alleleName}
          />
        )}
        {doesTargetingVectorProductsExist && (
          <TargetingVector
            mgiGeneAccessionId={mgiGeneAccessionId}
            alleleName={alleleName}
          />
        )}
        {/* {!doesTargetingVectorProductsExist && (
          <IntermediateVector
            mgiGeneAccessionId={mgiGeneAccessionId}
            alleleName={alleleName}
          />
        )} */}
        <Card>
          <Link
            href={`/genes/${pid}/#purchase`}
            scroll={false}
            className="secondary"
          >
            See all alleles for{allele.geneSymbol}{" "}
            <FontAwesomeIcon icon={faArrowRightLong} />
          </Link>
        </Card>
      </Container>
    </>
  );
};

export default Gene;
