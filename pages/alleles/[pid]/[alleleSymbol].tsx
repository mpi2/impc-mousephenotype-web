import { Button, Container } from "react-bootstrap";
import Search from "@/components/Search";
import Card from "@/components/Card";
import { useRouter } from "next/router";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowLeftLong,
  faArrowRightLong,
  faCartShopping,
} from "@fortawesome/free-solid-svg-icons";
import Head from "next/head";
import styles from "./styles.module.scss";
import Mice from "@/components/Allele/Mice";
import ESCell from "@/components/Allele/ESCell";
import TargetingVector from "@/components/Allele/TVP";
import Crispr from "@/components/Allele/Crispr";
import AlleleMap from "@/components/Allele/AlleleMap.tsx";
import { useEffect, useState } from "react";
import QCModal from "@/components/Allele/QCModal.tsx";
import IntermediateVector from "@/components/Allele/IVP";
import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "@/api-service";
import Skeleton from "react-loading-skeleton";
import classNames from "classnames";

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
      <a
        className={classNames("btn", { "btn-grey impc-base-button": !hasData, "impc-primary-button": hasData })}
        style={{ minWidth: 120, cursor: hasData ? 'pointer' : 'initial' }}
        href={link}
      >
        {hasData ? (
          <span>
            <FontAwesomeIcon icon={faCartShopping} />
            Order
          </span>
        ) : (
          "Not available"
        )}
      </a>
    </p>
  </div>
);

const Gene = () => {
  const {
    isReady,
    query: { pid, alleleSymbol },
  } = useRouter();

  const { data: allele, isLoading, isError, error } = useQuery({
    queryKey: ['genes', pid, 'alleles', alleleSymbol, 'order'],
    queryFn: () => fetchAPI(`/api/v1/alleles/${pid}/${alleleSymbol}`),
    enabled: isReady
  })

  const [qcData, setQcData] = useState<any[]>(null);

  useEffect(() => {
    if (allele) {
      const hash = window.location.hash;
      if (hash.length > 0) {
        setTimeout(() => {
          document.querySelector(window.location.hash)?.scrollIntoView();
        }, 500);
      }
    }
  }, [allele]);


  if (isLoading || !allele) {
    return (
      <>
        <Search />
        <Container className="page">
          <Card>
            <Link href={`/genes/${pid}/#order`} className="grey mb-3 small">
              <FontAwesomeIcon icon={faArrowLeftLong} />&nbsp;
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
            <Link href={`/genes/${pid}#order`} className="grey mb-3 small">
              <FontAwesomeIcon icon={faArrowLeftLong} />&nbsp;
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
    alleleDescription,
    doesMiceProductsExist,
    doesEsCellProductsExist,
    doesCrisprProductsExist,
    doesIntermediateVectorProductsExist,
    doesTargetingVectorProductsExist,
  } = allele;

  const productTypes = [
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

  return (
    <>
      <Head>
        <title>
          Allele Details | {allele.geneSymbol} - {alleleSymbol} | International Mouse
          Phenotyping Consortium
        </title>
      </Head>
      <Search />
      <Container className="page">
        <Card>
          <div className="subheading">
            <span className="subheadingSection primary">
              <Link
                href={`/genes/${pid}`}
                className="mb-3"
                style={{textTransform: 'none', fontWeight: 'normal', letterSpacing: 'normal', fontSize: '1.15rem'}}
              >
                <FontAwesomeIcon icon={faArrowLeft}/>
                &nbsp;
                Go Back to {allele.geneSymbol || <Skeleton style={{width: '50px'}} inline/>}
              </Link>
            </span>
          </div>
          <p className={`${styles.subheading} mt-2`}>ALLELE</p>
          <h1 className="mb-2 mt-2">
            <strong>
              {allele.geneSymbol}
              <sup>{allele.alleleName}</sup>
            </strong>{" "}
          </h1>
          <p className="mb-4 grey">{alleleDescription}</p>
          <div style={{display: "flex", flexWrap: "wrap"}}>
            {productTypes.map((productType) => (
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
            href={`/genes/${pid}/#order`}
            scroll={false}
            className="primary link"
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
