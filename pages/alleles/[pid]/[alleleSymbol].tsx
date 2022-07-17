import { Alert, Button, Col, Container, Row } from "react-bootstrap";
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
import { useEffect, useState } from "react";
import Head from "next/head";
import styles from "./styles.module.scss";
import Pagination from "../../../components/Pagination";
import SortableTable from "../../../components/SortableTable";

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
  const [gene, setGene] = useState(null);
  const [allele, setAllele] = useState(null);
  const [loading, setLoading] = useState(true);
  const {
    query: { pid, alleleSymbol },
  } = useRouter();

  useEffect(() => {
    (async () => {
      if (!pid) return;
      const res = await fetch(`/api/genes/${pid}/summary`);
      if (res.ok) {
        setGene(await res.json());
      }

      const res2 = await fetch(`/api/products/${pid}/${alleleSymbol}`);
      if (res2.ok) {
        setAllele(await res2.json());
      }
      setLoading(false);
    })();
  }, [pid]);

  if (loading) {
    return (
      <>
        <Search />
        <Container className="page">
          <Card>Loading...</Card>
        </Container>
      </>
    );
  }
  if (!gene || !allele) {
    return (
      <>
        <Search />
        <Container className="page">
          <Card>
            <Link href={`/genes/${pid}`}>
              <a href="#" className="grey mb-3 small">
                <FontAwesomeIcon icon={faArrowLeftLong} /> BACK TO GENE
              </a>
            </Link>
            <h2 className="mt-4 mb-2">Failed to load allele data</h2>
            <p className="grey mb-4">
              Something went wrong. Please try again later.
            </p>
          </Card>
        </Container>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>
          Allele Details | {gene.geneSymbol}-{alleleSymbol} | International
          Mouse Phenotyping Consortium
        </title>
      </Head>
      <Search />
      <Container className="page">
        <Card>
          <Link href={`/genes/${pid}`}>
            <a href="#" className="grey mb-3 small">
              <FontAwesomeIcon icon={faArrowLeftLong} /> BACK TO GENE
            </a>
          </Link>
          <p className={styles.subheading}>ALLELE</p>
          <h1 className="mb-2 mt-2">
            Allele Products |{" "}
            <strong>
              {gene.geneSymbol}
              <sup>{alleleSymbol}</sup>
            </strong>{" "}
          </h1>
          <p className="mb-4 grey">{allele.alleleDescription}</p>
          <div style={{ display: "flex" }}>
            <ProductItem
              hasData={allele.miceProducts && allele.miceProducts.length > 0}
              name="Mice"
              link="#mice"
            />
            <ProductItem
              hasData={
                allele.esCellProducts && allele.esCellProducts.length > 0
              }
              name="Targeted ES cells"
              link="#esCell"
            />
            <ProductItem
              hasData={
                allele.targetingVectorProducts &&
                allele.targetingVectorProducts.length > 0
              }
              name="Targeting vectors"
              link="#targetingVector"
            />
          </div>
        </Card>
        <Card>
          <h2>Allele Map</h2>
          <p className="mb-0">
            <a href={allele.genbankFileUrl} target="_blank">
              <FontAwesomeIcon icon={faExternalLinkAlt} /> Genbank
            </a>
            <span className="grey ms-2 me-2">|</span>
            <a href={allele.emsembleUrl} target="_blank">
              <FontAwesomeIcon icon={faExternalLinkAlt} /> Ensemble
            </a>
          </p>
          <div>
            <img src={allele.alleleMapUrl} />
          </div>
        </Card>
        <Card id="mice">
          <h2>Mice</h2>
          {!!allele.miceProducts && allele.miceProducts.length > 0 ? (
            <Pagination data={allele.miceProducts}>
              {(pageData) => (
                <SortableTable
                  doSort={() => {}}
                  defaultSort={["title", "asc"]}
                  headers={[
                    { width: 3, label: "Colony Name", disabled: true },
                    {
                      width: 2,
                      label: "Genetic Background",
                      disabled: true,
                    },
                    { width: 2, label: "Production Centre", disabled: true },
                    { width: 1, label: "QC Data", disabled: true },
                    {
                      width: 2,
                      label: "ES Cell/Parent Mouse Colony",
                      disabled: true,
                    },
                    { width: 2, label: "Order / Contact", disabled: true },
                  ]}
                >
                  {pageData.map((p) => {
                    return (
                      <tr>
                        <td>
                          <strong>{p.colonyName}</strong>
                        </td>
                        <td>{p.geneticBackground}</td>
                        <td>{p.productionCentre}</td>
                        <td>
                          <a
                            href={p.qcDataUrl}
                            target="_blank"
                            className="link"
                          >
                            QC data{" "}
                            <FontAwesomeIcon
                              icon={faExternalLinkAlt}
                              className="grey"
                            />
                          </a>
                        </td>
                        <td>{p.esCellParentColony}</td>
                        <td>
                          <a
                            href={p.orderLink}
                            target="_blank"
                            className="link primary"
                          >
                            <FontAwesomeIcon icon={faCartShopping} /> Order
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </SortableTable>
              )}
            </Pagination>
          ) : (
            <Alert variant="primary">
              No mice products found for this allele.
            </Alert>
          )}
        </Card>
        <Card id="esCell">
          <h2>Es cells</h2>
          {!!allele.esCellProducts && allele.esCellProducts.length > 0 ? (
            <Pagination data={allele.esCellProducts}>
              {(pageData) => (
                <SortableTable
                  doSort={() => {}}
                  defaultSort={["title", "asc"]}
                  headers={[
                    { width: 2, label: "ES Cell Clone", disabled: true },
                    {
                      width: 2,
                      label: "ES Cell strain",
                      disabled: true,
                    },
                    { width: 2, label: "Parental Cell Line", disabled: true },
                    { width: 1, label: "IKMC Project", disabled: true },
                    { width: 1, label: "QC Data", disabled: true },
                    {
                      width: 2,
                      label: "Targeting Vector",
                      disabled: true,
                    },
                    { width: 2, label: "Order / Contact", disabled: true },
                  ]}
                >
                  {pageData.map((p) => {
                    return (
                      <tr>
                        <td>
                          <strong>{p.esCellClone}</strong>
                        </td>
                        <td>{p.esCellStrain}</td>
                        <td>{p.parentalCellLine}</td>
                        <td>{p.ikmcProject}</td>
                        <td>
                          <a
                            href={p.qcDataUrl}
                            target="_blank"
                            className="link"
                          >
                            QC data{" "}
                            <FontAwesomeIcon
                              icon={faExternalLinkAlt}
                              className="grey"
                            />
                          </a>
                        </td>
                        <td>{p.targetingVector}</td>
                        <td>
                          <a
                            href={p.order}
                            target="_blank"
                            className="link primary"
                          >
                            <FontAwesomeIcon icon={faCartShopping} /> Order
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </SortableTable>
              )}
            </Pagination>
          ) : (
            <Alert variant="primary">
              No ES cell products found for this allele.
            </Alert>
          )}
        </Card>
        <Card id="targetingVector">
          <h2>Targeting vectors</h2>
          {!!allele.targetingVectorProducts &&
          allele.targetingVectorProducts.length > 0 ? (
            <Pagination data={allele.targetingVectorProducts}>
              {(pageData) => (
                <SortableTable
                  doSort={() => {}}
                  defaultSort={["title", "asc"]}
                  headers={[
                    { width: 2, label: "Design Oligos", disabled: true },
                    {
                      width: 2,
                      label: "Targeting Vector",
                      disabled: true,
                    },
                    { width: 1, label: "Cassette", disabled: true },
                    { width: 1, label: "Backbone", disabled: true },
                    { width: 1.5, label: "IKMC Project", disabled: true },
                    {
                      width: 1.5,
                      label: "Genbank File",
                      disabled: true,
                    },
                    {
                      width: 1,
                      label: "Vector Map",
                      disabled: true,
                    },
                    { width: 2, label: "Order", disabled: true },
                  ]}
                >
                  {pageData.map((p) => {
                    return (
                      <tr>
                        <td>
                          <strong>{p.designOligos}</strong>
                        </td>
                        <td>{p.targetingVector}</td>
                        <td>{p.cassette}</td>
                        <td>{p.backbone}</td>
                        <td>{p.ikmcProject}</td>
                        <td>
                          {!!p.genbankFile ? (
                            <a
                              href={p.genbankFile}
                              target="_blank"
                              className="link"
                            >
                              Genbank{" "}
                              <FontAwesomeIcon
                                icon={faExternalLinkAlt}
                                className="grey"
                              />
                            </a>
                          ) : (
                            "None"
                          )}
                        </td>
                        <td>
                          {!!p.vectorMap ? (
                            <a
                              href={p.vectorMap}
                              target="_blank"
                              className="link"
                            >
                              Vector map{" "}
                              <FontAwesomeIcon
                                icon={faExternalLinkAlt}
                                className="grey"
                              />
                            </a>
                          ) : (
                            "None"
                          )}
                        </td>
                        <td>
                          <a
                            href={p.order}
                            target="_blank"
                            className="link primary"
                          >
                            <FontAwesomeIcon icon={faCartShopping} /> Order
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </SortableTable>
              )}
            </Pagination>
          ) : (
            <Alert variant="primary">
              No targeting vector products found for this allele.
            </Alert>
          )}
        </Card>
        <Card>
          <Link href={`/genes/${pid}/#purchase`}>
            <a href="#" className="secondary">
              See all alleles for {gene.geneSymbol}{" "}
              <FontAwesomeIcon icon={faArrowRightLong} />
            </a>
          </Link>
        </Card>
      </Container>
    </>
  );
};

export default Gene;
