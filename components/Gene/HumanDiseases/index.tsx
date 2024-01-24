import {
  faChevronDown,
  faChevronUp,
  faExternalLinkAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import _ from "lodash";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { Alert, Tab, Tabs } from "react-bootstrap";
import Card from "../../Card";
import Pagination from "../../Pagination";
import SortableTable from "../../SortableTable";
import styles from "./styles.module.scss";
import Phenogrid from "phenogrid";
import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "@/api-service";
import { GeneDisease } from "@/models/gene";
import { sectionWithErrorBoundary } from "@/hoc/sectionWithErrorBoundary";

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

const PhenoGridEl = ({ phenotypes, id }) => {
  const {
    query: { pid },
  } = useRouter();
  const cont = useRef(null);
  const yAxis =
    phenotypes?.split(",").map((x) => {
      const processed = x.replace(" ", "**").split("**");
      return {
        id: processed[0],
        term: processed[1],
      };
    }) ?? [];
  var data = {
    title: " ",
    xAxis: [[pid]],
    yAxis,
  };
  useEffect(() => {
    if (cont.current && Phenogrid) {
      Phenogrid.createPhenogridForElement(cont.current, {
        serverURL: "https://api.monarchinitiative.org/api/",
        gridSkeletonData: data,
        geneList: [[pid]],
        owlSimFunction: "compare",
      });
    }
  }, [cont.current]);

  return (
    <tr>
      <td colSpan={6}>
        <div style={{ width: "100%" }} ref={cont} id={`phenogrid${id}`}></div>
      </td>
    </tr>
  );
};

const Row = ({ data }: { data: GeneDisease }) => {
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
        <td>
          {data?.diseaseMatchedPhenotypes
            ?.split(",")
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
            <FontAwesomeIcon
              className="grey"
              size="xs"
              icon={faExternalLinkAlt}
            />
          </a>
        </td>
        <td onClick={() => setOpen(!open)}>
          <FontAwesomeIcon
            className="link"
            icon={open ? faChevronUp : faChevronDown}
          />
        </td>
      </tr>
      {open && (
        <PhenoGridEl
          phenotypes={data.diseaseMatchedPhenotypes}
          id={data.diseaseId.split(":")[1]}
        />
      )}
    </>
  );
};

const HumanDiseases = ({ gene }: { gene: any }) => {
  const router = useRouter();
  const [sorted, setSorted] = useState<Array<GeneDisease>>([]);
  const { isLoading, isError, data } = useQuery({
    queryKey: ['genes', router.query.pid, 'disease'],
    queryFn: () => fetchAPI(`/api/v1/genes/${router.query.pid}/disease`),
    enabled: router.isReady,
    select: data => data as Array<GeneDisease>,
  });
  const [tab, setTab] = useState("associated");

  useEffect(() => {
    if (data) {
      setSorted(_.orderBy(data, "diseaseTerm", "asc"));
    }
  }, [data]);

  if (isLoading) {
    return (
      <Card id="human-diseases">
        <h2>Human diseases caused by {gene.geneSymbol} mutations</h2>
        <p className="grey">Loading...</p>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card id="human-diseases">
        <h2>Human diseases caused by {gene.geneSymbol} mutations</h2>
        <Alert variant="primary">No data available for this section</Alert>
      </Card>
    );
  }

  const associatedData = sorted
    ? sorted.filter((x) => x.associationCurated === true)
    : [];
  const predictedData = sorted
    ? sorted.filter((x) => x.associationCurated !== true)
    : [];

  const selectedData = tab === "associated" ? associatedData : predictedData;

  return (
    <>
      <Card id="human-diseases">
        <h2>Human diseases caused by {gene.geneSymbol} mutations </h2>
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
            title={`Human diseases associated with ${gene.geneSymbol} (${associatedData.length})`}
          ></Tab>
          <Tab
            eventKey="predicted"
            title={`Human diseases predicted to be associated with ${gene.geneSymbol} (${predictedData.length})`}
          ></Tab>
        </Tabs>
        {isError ? (
          <Alert className={styles.table} variant="primary">
            No data available for this section.
          </Alert>
        ) : (
          <Pagination data={selectedData}>
            {(pageData) => (
              <SortableTable
                doSort={(sort) => {
                  setSorted(_.orderBy(data, sort[0], sort[1]));
                }}
                defaultSort={["phenodigmScore", "desc"]}
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
    </>
  );
};

export default sectionWithErrorBoundary(HumanDiseases, 'Human diseases', 'human-diseases');
