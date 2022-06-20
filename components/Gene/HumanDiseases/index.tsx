import {
  faChevronDown,
  faChevronUp,
  faExternalLinkAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import _ from "lodash";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Alert, Tab, Tabs, Table } from "react-bootstrap";
import Card from "../../Card";
import Pagination from "../../Pagination";
import SortableTable from "../../SortableTable";
import styles from "./styles.module.scss";

const Scale = ({ children = 5 }: { children: number }) => {
  return (
    <div className={styles.scale}>
      {Array.from(Array(5).keys())
        .map((n) => n + 1)
        .map((n) => (
          <span className={n <= children ? styles.selected : ""} />
        ))}
    </div>
  );
};

// Add the graph: https://github.com/monarch-initiative/phenogrid

const Row = ({ data }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <tr>
        <td>
          <strong className={styles.link}>{data.diseaseTerm}</strong>
        </td>
        <td>
          <Scale>{Math.round((data.phenodigmScore / 100) * 5)}</Scale>
        </td>
        <td onClick={() => setOpen(!open)} className="link">
          {data.diseaseMatchedPhenotypes
            .split(",")
            .map((x) => x.replace(" ", "**").split("**")[1])
            .join(", ")}
        </td>
        <td>
          <a
            href={`http://omim.org/entry/${data.diseaseId.split(":")[1]}`}
            target="_blank"
            className="link primary"
          >
            {data.diseaseId}{" "}
            <FontAwesomeIcon className="grey" icon={faExternalLinkAlt} />
          </a>
        </td>
        <td onClick={() => setOpen(!open)}>
          <FontAwesomeIcon
            className="link"
            icon={open ? faChevronDown : faChevronUp}
          />
        </td>
      </tr>
      {open && <tr>Insert phenoGrid here</tr>}
    </>
  );
};

const HumanDiseases = () => {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [sorted, setSorted] = useState<any[]>(null);
  const [tab, setTab] = useState("associated");
  useEffect(() => {
    (async () => {
      if (!router.query.pid) return;
      const res = await fetch(`/api/genes/${router.query.pid}/diseases`);
      if (res.ok) {
        const diseases = await res.json();
        setData(diseases);
        setSorted(_.orderBy(diseases, "diseaseTerm", "asc"));
      }
    })();
  }, [router.query.pid]);

  const associatedData = sorted
    ? sorted.filter((x) => x.associationCurated === "true")
    : [];
  const predictedData = sorted
    ? sorted.filter((x) => x.associationCurated !== "true")
    : [];

  const selectedData = tab === "associated" ? associatedData : predictedData;

  return (
    <Card id="human-diseases">
      <h2>Human diseases caused by Mavs mutations </h2>
      <div className="mb-4">
        <p>
          The analysis uses data from IMPC, along with published data on other
          mouse mutants, in comparison to human disease reports in OMIM,
          Orphanet, and DECIPHER.
        </p>
        <p>
          Phenotype comparisons summarize the similarity of mouse phenotypes
          with human disease phenotypes.
        </p>
      </div>
      <Tabs defaultActiveKey="associated" onSelect={(e) => setTab(e)}>
        <Tab
          eventKey="associated"
          title={`Human diseases associated with Mavs (${associatedData.length})`}
        ></Tab>
        <Tab
          eventKey="predicted"
          title={`Human diseases predicted to be associated with Mavs (${predictedData.length})`}
        ></Tab>
      </Tabs>
      {!selectedData || !selectedData.length ? (
        <Alert className={styles.table}>
          No human diseases associated to this gene by orthology or annotation.
        </Alert>
      ) : (
        <Pagination data={selectedData}>
          {(pageData) => (
            <SortableTable
              doSort={(sort) => {
                setSorted(_.orderBy(data, sort[0], sort[1]));
              }}
              defaultSort={["parameterName", "asc"]}
              headers={[
                { width: 5, label: "Disease", field: "diseaseTerm" },
                {
                  width: 2,
                  label: "Similarity of phenotypes",
                  field: "phenodigmScore",
                },
                {
                  width: 3,
                  label: "Matching phenotypes",
                  field: "diseaseMatchedPhenotypes",
                },
                { width: 2, label: "Source", field: "diseaseId" },
                { width: 1, label: "Expand", disabled: true },
              ]}
            >
              {pageData.map((d) => (
                <Row data={d} />
              ))}
            </SortableTable>
          )}
        </Pagination>
      )}
    </Card>
  );
};

export default HumanDiseases;
