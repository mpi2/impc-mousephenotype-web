import { Alert, Button, Col, Row, Spinner, Tab, Tabs } from "react-bootstrap";
import Select from "react-select";
import { AlleleSymbol, Pagination, SortableTable } from "@/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import {
  BatchQueryItem,
  DownloadButtonsState,
  GoTerm,
  SelectedAlleleData,
  SelectOptions,
  SortType,
} from "@/models";
import { PropsWithChildren, useMemo, useState } from "react";
import Link from "next/link";
import { formatAlleleSymbol } from "@/utils";
import { BodySystem } from "@/components/BodySystemIcon";

const formatOptionLabel = ({ value, label, numHits }, { context }) => {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <BodySystem
        name={value}
        color="grey"
        noSpacing
        noMargin={context === "value"}
      />
      {context === "menu" && (
        <>
          <span>{label}</span>
          &nbsp;-&nbsp;<i className="grey small">{numHits} gene(s)</i>
        </>
      )}
    </div>
  );
};

const formatPhenotypeLabel = (option, { context }) => (
  <div>
    <span>{option.label}</span>
    {context === "menu" && (
      <>
        &nbsp;-&nbsp;<i className="grey small">{option.numHits} gene(s)</i>
      </>
    )}
  </div>
);

type DataRowProps = {
  geneData: BatchQueryItem;
  onPhenotypeLinkClick: (data: SelectedAlleleData) => void;
};

const DataRow = ({ geneData, onPhenotypeLinkClick }: DataRowProps) => {
  const [openAlleleView, setOpenAlleleView] = useState(false);
  const [openGOView, setOpenGoView] = useState(false);
  const { mouseGeneSymbol, geneId, humanGeneIds, humanGeneSymbols } = geneData;
  const sortGoTerms = (terms: Array<GoTerm>) => {
    return terms.sort((a, b) => b.go_term_specificity - a.go_term_specificity);
  };
  return (
    <>
      <tr>
        <td>
          <Link className="link primary" href={`/genes/${geneData.geneId}`}>
            {geneId}
          </Link>
        </td>
        <td>{mouseGeneSymbol}</td>
        <td>{humanGeneIds?.toString() || "data not available"}</td>
        <td>{humanGeneSymbols?.toString() || "data not available"}</td>
        <td>{geneData.allSignificantPhenotypes.length}</td>
        <td>{geneData.allSignificantSystems.length}</td>
        <td>
          <Button
            className="impc-secondary-button small"
            onClick={() => {
              setOpenGoView(!openGOView);
              setOpenAlleleView(false);
            }}
          >
            {openGOView ? "Close" : `${geneData.goTerms.length} term(s)`}
            &nbsp;
            <FontAwesomeIcon
              className="link"
              icon={openGOView ? faChevronUp : faChevronDown}
            />
          </Button>
        </td>
        <td>
          <Button
            className="impc-secondary-button small"
            onClick={() => {
              setOpenAlleleView(!openAlleleView);
              setOpenGoView(false);
            }}
          >
            {openAlleleView ? "Close" : `${geneData.alleles.length} allele(s)`}
            &nbsp;
            <FontAwesomeIcon
              className="link"
              icon={openAlleleView ? faChevronUp : faChevronDown}
            />
          </Button>
        </td>
      </tr>
      {openGOView && (
        <tr>
          <td></td>
          <td colSpan={6} style={{ padding: 0 }}>
            <SortableTable
              withMargin={false}
              headers={[
                {
                  width: 1,
                  label: "GO ID",
                  field: "go_id",
                  disabled: true,
                },
                {
                  width: 1,
                  label: "GO term",
                  field: "go_name",
                  disabled: true,
                },
                {
                  width: 1,
                  label: "Aspect",
                  field: "aspect",
                  disabled: true,
                },
                {
                  width: 1,
                  label: "Evidence code",
                  field: "evidence_code",
                  disabled: true,
                },
                {
                  width: 2,
                  label: "Number of ancestors in ontology",
                  field: "go_term_specificity",
                  disabled: true,
                },
              ]}
            >
              {sortGoTerms(geneData.goTerms).map((goTerm, i) => {
                return (
                  <tr key={goTerm.go_id}>
                    <td>
                      <a
                        className="link primary"
                        href={`https://amigo.geneontology.org/amigo/term/${goTerm.go_id}`}
                        target="_blank"
                      >
                        {goTerm.go_id}
                      </a>
                    </td>
                    <td>{goTerm.go_name}</td>
                    <td>{goTerm.aspect}</td>
                    <td>{goTerm.evidence_code}</td>
                    <td>{goTerm.go_term_specificity}</td>
                  </tr>
                );
              })}
            </SortableTable>
          </td>
        </tr>
      )}
      {openAlleleView && (
        <tr key={"phenotype-terms-" + geneId}>
          <td></td>
          <td colSpan={6} style={{ padding: 0 }}>
            <SortableTable
              withMargin={false}
              headers={[
                {
                  width: 1,
                  label: "Allele symbol",
                  field: "allele",
                  disabled: true,
                },
                {
                  width: 2,
                  label: "Significant systems",
                  field: "significantSystems",
                  disabled: true,
                },
                {
                  width: 1,
                  label: "# of significant phenotypes",
                  field: "significantPhenotypes",
                  disabled: true,
                },
              ]}
            >
              {geneData.alleles.map((alleleData) => {
                return (
                  <tr>
                    <td>
                      <Link
                        className="link primary"
                        href={`alleles/${geneData.geneId}/${
                          formatAlleleSymbol(alleleData.allele)[1]
                        }`}
                      >
                        <AlleleSymbol
                          symbol={alleleData.allele}
                          withLabel={false}
                        />
                      </Link>
                    </td>
                    <td>
                      {alleleData.significantSystems.map((system, index) => (
                        <BodySystem
                          key={index}
                          name={system}
                          color="system-icon in-table"
                          noSpacing
                        />
                      ))}
                      {alleleData.significantSystems.length === 0 &&
                        "No significant system associated"}
                    </td>
                    <td>
                      {alleleData.significantPhenotypes.length > 0 ? (
                        <Button
                          className="impc-secondary-button small"
                          onClick={() =>
                            onPhenotypeLinkClick({
                              alelleSymbol: alleleData.allele,
                              phenotypes: alleleData.significantPhenotypes,
                            })
                          }
                        >
                          View {alleleData.significantPhenotypes.length}{" "}
                          phenotype(s)
                        </Button>
                      ) : (
                        0
                      )}
                    </td>
                  </tr>
                );
              })}
            </SortableTable>
          </td>
        </tr>
      )}
    </>
  );
};

type BatchQueryResultsProps = PropsWithChildren<{
  sortedData: Array<any>;
  hasMoreThan1000Ids: boolean;
  isFetching: boolean;
  numberTotalGenes: number;
  actualResults: number;
  isDataAvailable: boolean;
  downloadButtonsState: DownloadButtonsState;
  fetchFilteredDataset: (
    payload: any,
    pathUrl: string,
    zippedFile: boolean,
  ) => Promise<void>;
  selectOptions: {
    systemSelectOptions: SelectOptions;
    phenotypeSelectOptions: SelectOptions;
    allSignificantSystems: SelectOptions;
  };
  selectedSystems: Array<string>;
  selectedPhenotypes: Array<string>;
  updateSelectedSystems: (data: any) => void;
  updateSelectedPhenotypes: (data: any) => void;
  setSortOptions: (data: any) => void;
  setSelectedAlleleData: (data: any) => void;
}>;

export const BatchQueryResults = ({
  sortedData,
  hasMoreThan1000Ids,
  isFetching,
  numberTotalGenes,
  actualResults,
  isDataAvailable,
  downloadButtonsState: state,
  fetchFilteredDataset,
  selectOptions,
  selectedSystems,
  selectedPhenotypes,
  updateSelectedSystems,
  updateSelectedPhenotypes,
  setSortOptions,
  setSelectedAlleleData,
}: BatchQueryResultsProps) => {
  const defaultSort: SortType = useMemo(() => ["mouseGeneSymbol", "asc"], []);

  const downloadButtons = [
    {
      key: "Summary data JSON",
      isBusy: state.isBusyJSON,
      toogleFlag: () =>
        fetchFilteredDataset("JSON", "download-preprocessed-data", false),
    },
    {
      key: "Summary data TSV",
      isBusy: state.isBusyTSV,
      toogleFlag: () =>
        fetchFilteredDataset("TSV", "download-preprocessed-data", false),
    },
    {
      key: "Full results JSON",
      isBusy: state.isBusyJSON,
      toogleFlag: () =>
        fetchFilteredDataset("JSON", "download-full-results", true),
    },
  ];

  return (
    <>
      {isDataAvailable ? (
        <>
          <Tabs defaultActiveKey="geneResults">
            <Tab eventKey="geneResults" title="Full details" className="mt-2">
              <span>
                <b>Displaying a total of {numberTotalGenes} genes</b>
              </span>
              <Row>
                <Col>
                  <div>
                    <span className="small grey">
                      Filter genes by physiological system&nbsp;
                    </span>
                    <Select
                      isMulti
                      options={selectOptions.systemSelectOptions}
                      formatOptionLabel={formatOptionLabel}
                      onChange={updateSelectedSystems}
                    />
                  </div>
                </Col>
                <Col>
                  <div>
                    <span className="small grey">
                      Filter genes by significant phenotype&nbsp;
                    </span>
                    <Select
                      isMulti
                      options={selectOptions.phenotypeSelectOptions}
                      formatOptionLabel={formatPhenotypeLabel}
                      onChange={updateSelectedPhenotypes}
                    />
                  </div>
                </Col>
              </Row>
              {isDataAvailable ? (
                <>
                  <Pagination
                    data={sortedData}
                    topControlsWrapperCSS={{ marginTop: "1rem" }}
                    additionalTopControls={
                      <>
                        {(!!selectedSystems.length ||
                          !!selectedPhenotypes.length) && (
                          <div>
                            <b className="small grey">
                              Showing {sortedData?.length || 0} result(s)
                              of&nbsp;
                              {actualResults}
                            </b>
                          </div>
                        )}
                      </>
                    }
                  >
                    {(pageData) => (
                      <SortableTable
                        defaultSort={defaultSort}
                        doSort={(sort) =>
                          setSortOptions({ prop: sort[0], order: sort[1] })
                        }
                        headers={[
                          {
                            width: 1,
                            label: "MGI accession id",
                            field: "geneId",
                          },
                          {
                            width: 1,
                            label: "Marker symbol",
                            field: "mouseGeneSymbol",
                          },
                          {
                            width: 1,
                            label: "Human gene id",
                            field: "humanGeneIds",
                          },
                          {
                            width: 1,
                            label: "Human gene symbol",
                            field: "humanGeneSymbols",
                          },
                          {
                            width: 1,
                            label: "# of significant phenotypes",
                            field: "allSignificantPhenotypes",
                          },
                          {
                            width: 1,
                            label: "# of systems impacted",
                            field: "allSignificantSystems",
                          },
                          {
                            width: 1,
                            label: "View Gene Ontology terms",
                            disabled: true,
                          },
                          {
                            width: 1,
                            label: "View allele info",
                            disabled: true,
                          },
                        ]}
                      >
                        {pageData.map((geneData) => (
                          <DataRow
                            key={geneData.geneId}
                            geneData={geneData}
                            onPhenotypeLinkClick={setSelectedAlleleData}
                          />
                        ))}
                      </SortableTable>
                    )}
                  </Pagination>
                  <div>
                    <div
                      className="grey"
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                        alignItems: "center",
                      }}
                    >
                      {downloadButtons.map((button) => (
                        <button
                          key={button.key}
                          className="btn impc-secondary-button small"
                          onClick={button.toogleFlag}
                          disabled={button.isBusy}
                        >
                          {button.isBusy ? (
                            <Spinner animation="border" size="sm" />
                          ) : (
                            <>
                              <FontAwesomeIcon icon={faDownload} size="sm" />
                              &nbsp;
                              {button.key}
                            </>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <h3 className="mt-3">No genes match the filters selected</h3>
              )}
            </Tab>
            <Tab eventKey="summary" title="Summary" className="mt-2">
              <Row>
                <Col>
                  <Pagination
                    data={selectOptions.allSignificantSystems}
                    buttonsPlacement="bottom"
                    additionalTopControls={
                      <h3>Impacted physiological systems</h3>
                    }
                  >
                    {(pageData) => (
                      <SortableTable
                        headers={[
                          { width: 1, label: "System", field: "value" },
                          {
                            width: 1,
                            label: "# of genes associated",
                            field: "numHits",
                          },
                        ]}
                      >
                        {pageData.map((phenotype) => (
                          <tr>
                            <td>{phenotype.label}</td>
                            <td>{phenotype.numHits}</td>
                          </tr>
                        ))}
                      </SortableTable>
                    )}
                  </Pagination>
                </Col>
                <Col>
                  <h3>Gene ontology summary</h3>
                </Col>
              </Row>
            </Tab>
          </Tabs>
        </>
      ) : hasMoreThan1000Ids ? (
        <>
          <Alert variant="warning">
            Because your list has more than 1,000 IDs, results won't be
            displayed. You can download the filtered data or the entire dataset.
          </Alert>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignSelf: "flex-start",
            }}
          >
            <button
              className="btn impc-primary-button mb-3"
              onClick={() =>
                fetchFilteredDataset("JSON", "download-full-results", true)
              }
            >
              {state.isBusyJSON ? (
                <Spinner animation="border" size="sm" />
              ) : (
                <FontAwesomeIcon icon={faDownload} size="sm" />
              )}
              &nbsp; Download filtered dataset JSON
            </button>
            <button className="btn impc-primary-button mb-3">
              <FontAwesomeIcon icon={faDownload} size="sm" />
              &nbsp; Download entire dataset (3.39GB) TSV
            </button>
            <button className="btn impc-primary-button mb-3">
              <FontAwesomeIcon icon={faDownload} size="sm" />
              &nbsp; Download entire dataset (6.47GB) JSON
            </button>
          </div>
        </>
      ) : !isFetching ? (
        <i className="grey">
          Data will appear here after clicking the submit button.
        </i>
      ) : null}
    </>
  );
};
