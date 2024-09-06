import {
  faChevronDown,
  faChevronUp,
  faExternalLinkAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import _ from "lodash";
import { useRouter } from "next/router";
import { forwardRef, useEffect, useRef, useState } from "react";
import { Alert, Overlay, Tab, Tabs, Tooltip } from "react-bootstrap";
import Card from "../../Card";
import Pagination from "../../Pagination";
import SortableTable from "../../SortableTable";
import styles from "./styles.module.scss";
import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "@/api-service";
import { GeneDisease } from "@/models/gene";
import { sectionWithErrorBoundary } from "@/hoc/sectionWithErrorBoundary";
import { DownloadData, SectionHeader } from "@/components";
import { isIframeLoaded } from './isIframeLoaded';

type ScaleProps = {
  children: number;
  toggleFocus: (newValue: boolean) => void
}
type Ref = HTMLDivElement;

const Scale = forwardRef<Ref, ScaleProps>((props: ScaleProps, ref) => {
  const { children = 5, toggleFocus } = props;
  return (
    <div
      ref={ref}
      className={styles.scale}
      onMouseOver={() => toggleFocus(true)}
      onMouseLeave={() => toggleFocus(false)}
    >
      {Array.from(Array(5).keys())
        .map((n) => n + 1)
        .map((n) => (
          <span key={n} className={n <= children ? styles.selected : ""} />
        ))}
    </div>
  );
});

const PhenoGridEl = ({ phenotypes, m_phenotypes, id, phenodigmScore, data}) => {
  const {
    query: { pid },
  } = useRouter();
  console.log('data',data)
  const iframeRef = useRef(null);
  const [iframeHeight, setiFrameHeight] = useState(400);

  const processPhenotypes = (phenotypeString) =>
    phenotypeString?.split(",").map((x) => {
      const processed = x.replace(" ", "**").split("**");
      return {
        id: processed[0],
        term: processed[1],
      };
    }) ?? [];

  // Process disease phenotypes and mouse phenotypes
  const diseasePhenotypes = processPhenotypes(phenotypes.join());
  const mousePhenotypes = processPhenotypes(m_phenotypes.join());

  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe) {
      isIframeLoaded(iframe)
        .then(() => {
          console.log("Iframe loaded successfully");

          setTimeout(() => {
          const subjects = diseasePhenotypes.map(item => item.id);
          const objectSets = [{
            id: id,
            label: `${phenodigmScore.toFixed(2)}-${id}`,
            phenotypes: mousePhenotypes.map(item => item.id),
          }];

          iframe.contentWindow?.postMessage({
            subjects: subjects,
            "object-sets": objectSets,
          }, "http://monarchinitiative.org");

          console.log("Message sent with a dealy of 0.3s");
          }, 300);
        })
        .catch((error) => {
          console.error("Error loading iframe or sending message:", error);
        });
    }

    const handleMessage = (event: MessageEvent) => {
      const { width, height } = event.data;
      if (!iframe) return;

      // Set the iframe to fill its container
      iframe.style.width = '100%';
      iframe.style.height = '1000px';

      // // But never bigger than its contents
      iframe.style.maxWidth = `${width}px`;
      iframe.style.maxHeight = `${iframeHeight}px`;
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [diseasePhenotypes, mousePhenotypes, id, phenodigmScore]);

  return (
    <tr>
      <td colSpan={6}>
        <div style={{ width: "100%", height: `${iframeHeight}px`, overflow: "hidden" }}>
          <iframe
            ref={iframeRef}
            name="pheno-multi"
            title="MultiCompare Phenogrid"
            src="http://monarchinitiative.org/phenogrid-multi-compare"
            style={{width: "100%", height: "100%", border: "none"}}
          />
        </div>
      </td>
    </tr>
  );
};

const Row = ({ rowData, data }: { rowData: GeneDisease, data: Array<GeneDisease> }) => {
  const [open, setOpen] = useState(false);
  const [tooltipShow, setTooltipShow] = useState(false);
  const tooltipRef = useRef(null);

  return (
    <>
      <tr>
        <td>
          <strong className={styles.link}>{rowData.diseaseTerm}</strong>
        </td>
        <td>
          <Scale ref={tooltipRef} toggleFocus={setTooltipShow}>
            {Math.round((rowData.phenodigmScore / 100) * 5)}
          </Scale>
          <Overlay target={tooltipRef.current} show={tooltipShow} placement="top">
            {(props) => (
              <Tooltip id={`${rowData.mgiGeneAccessionId}-${rowData.diseaseId}`} {...props}>
                Phenodigm score: {rowData.phenodigmScore.toFixed(2)}%
              </Tooltip>
            )}
          </Overlay>
        </td>
        <td>
          {rowData?.diseaseMatchedPhenotypes
            ?.split(",")
            .map((x) => x.replace(" ", "**").split("**")[1])
            .join(", ")}
        </td>
        <td>
          <a
            href={`http://omim.org/entry/${rowData.diseaseId.split(":")[1]}`}
            target="_blank"
            className="link primary"
          >
            {rowData.diseaseId}{" "}
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
          phenotypes={rowData.diseasePhenotypes}
          m_phenotypes={rowData.modelPhenotypes}
          id={rowData.modelDescription}
          phenodigmScore={rowData.phenodigmScore}
          data = {data}
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
        <SectionHeader
          containerId="#human-diseases"
          title={`Human diseases caused by <i>${gene.geneSymbol}</i> mutations`}
          href="https://dev.mousephenotype.org/help/data-visualization/gene-pages/disease-models/"
        />
        <p className="grey">Loading...</p>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card id="human-diseases">
        <SectionHeader
          containerId="#human-diseases"
          title={`Human diseases caused by <i>${gene.geneSymbol}</i> mutations`}
          href="https://dev.mousephenotype.org/help/data-visualization/gene-pages/disease-models/"
        />
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
        <SectionHeader
          containerId="#human-diseases"
          title={`Human diseases caused by <i>${gene.geneSymbol}</i> mutations`}
          href="https://dev.mousephenotype.org/help/data-visualization/gene-pages/disease-models/"
        />
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
            title={
              <>
                Human diseases associated with <i>{gene.geneSymbol}</i> ({associatedData.length})
              </>
            }
          ></Tab>
          <Tab
            eventKey="predicted"
            title={
              <>
                Human diseases predicted to be associated with <i>{gene.geneSymbol}</i> ({predictedData.length})
              </>
            }
          ></Tab>
        </Tabs>
        {!selectedData || !selectedData.length ? (
          <Alert className={styles.table} variant="primary">
            No data available for this section.
          </Alert>
        ) : (
          <>
            <Pagination
              data={selectedData}
              additionalBottomControls={
                <DownloadData<GeneDisease>
                  data={sorted}
                  fileName={`${gene.geneSymbol}-associated-diseases`}
                  fields={[
                    { key: 'diseaseTerm', label: 'Disease' },
                    { key: 'phenodigmScore', label: 'Phenodigm Score' },
                    { key: 'diseaseMatchedPhenotypes', label: 'Matching phenotypes' },
                    { key: 'diseaseId', label: 'Source', getValueFn: item => `https://omim.org/entry/${item.diseaseId.replace('OMIM:', '')}` },
                    { key: 'associationCurated', label: 'Gene association', getValueFn: item => item.associationCurated ? 'Curated' : 'Predicted' },
                    { key: 'modelDescription', label: 'Model description' },
                    { key: 'modelGeneticBackground', label: 'Model genetic background' },
                    { key: 'modelMatchedPhenotypes', label: 'Model matched phenotypes' },
                  ]}
                />
              }
            >
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
                    <Row key={`${d.diseaseId}-${d.mgiGeneAccessionId}-${d.phenodigmScore}`} rowData={d} data={pageData} />
                  ))}
                </SortableTable>
              )}
            </Pagination>
          </>
        )}
      </Card>
    </>
  );
};

export default sectionWithErrorBoundary(HumanDiseases, 'Human diseases', 'human-diseases');
