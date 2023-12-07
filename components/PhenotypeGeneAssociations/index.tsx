import { useContext, useState } from "react";
import { Alert, Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import Pagination from "../Pagination";
import SortableTable from "../SortableTable";
import {formatAlleleSymbol, formatPValue} from "@/utils";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faChevronRight,
  faMars,
  faMarsAndVenus,
  faVenus,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useGeneAssociationsQuery } from "@/hooks";
import { PhenotypeContext } from "@/contexts";
import { useRouter } from "next/router";

type Props = {}

const Associations = (props: Props) => {
  const phenotype = useContext(PhenotypeContext);

  const router = useRouter();
  const [query, setQuery] = useState(undefined);
  const [sortOptions, setSortOptions] = useState<string>('');
  const { data, isLoading } = useGeneAssociationsQuery(phenotype.phenotypeId, router.isReady, sortOptions);

  const getIcon = (sex) => {
    switch (sex) {
      case "male":
        return faMars;
      case "female":
        return faVenus;
      default:
        return faMarsAndVenus;
    }
  };

  const getSexLabel = (sex) => {
    switch (sex) {
      case "male":
        return "Male";
      case "female":
        return "Female";
      default:
        return "Combined";
    }
  };

  const filtered = data.filter(({phenotypeName, phenotypeId, alleleSymbol, mgiGeneAccessionId}) =>
      (!query || `${mgiGeneAccessionId} ${alleleSymbol} ${phenotypeName} ${phenotypeId}`.toLowerCase().includes(query))
  );

  if (!data) {
    return (
      <Alert style={{ marginTop: "1em" }} variant="primary">
        All data not available
      </Alert>
    );
  }

  return (
    <>
      <h2>IMPC Gene variants with {phenotype.phenotypeName}</h2>
      <p>
        Total number of significant genotype-phenotype associations:&nbsp;
        {data.length}
      </p>
      <Pagination
        data={filtered}
        additionalTopControls={
          <Form.Control
            type="text"
            style={{
              display: "inline-block",
              width: 200,
              marginRight: "2rem",
            }}
            aria-label="Filter by parameters"
            id="parameterFilter"
            className="bg-white"
            placeholder="Search "
            onChange={(el) => {
              setQuery(el.target.value.toLowerCase() || undefined);
            }}
          />
        }
        topControlsWrapperCSS={{ flexWrap: 'nowrap', alignItems: 'flex-start'}}
      >
        {(currentPage) => (
          <SortableTable
            doSort={([field, order]) => setSortOptions(`${field};${order}`)}
            defaultSort={["alleleSymbol", "asc"]}
            headers={[
              { width: 2, label: "Gene / allele", field: "alleleSymbol" },
              { width: 1.3, label: "Phenotype", field: "phenotype" },
              { width: 1, label: "Zygosity", field: "zygosity" },
              { width: 0.7, label: "Sex", field: "sex" },
              { width: 1, label: "Life stage", field: "lifeStage" },
              { width: 1.5, label: "Parameter", field: "parameterName" },
              {
                width: 1.5,
                label: "Phenotyping Center",
                field: "phenotypingCentre",
              },
              { width: 2, label: "Most significant P-value", field: "pValue" },
            ]}
          >
            {currentPage.map((d, i) => {
              const allele = formatAlleleSymbol(d.alleleSymbol);
              return (
                <tr key={`tr-${d.alleleSymbol}-${i}`}>
                  <td>
                    <strong>
                      {allele[0]}
                      <sup>{allele[1]}</sup>
                    </strong>
                  </td>
                  <td>{d.phenotypeName}</td>
                  <td>{d.zygosity}</td>
                  <td>
                    {["male", "female", "not_considered"].map((col) => {
                      const hasSignificant = d[`pValue_${col}`];
                      return hasSignificant ? (
                        <OverlayTrigger
                          placement="top"
                          trigger={["hover", "focus"]}
                          overlay={<Tooltip>{getSexLabel(col)}</Tooltip>}
                        >
                          <span className="me-2">
                            <FontAwesomeIcon icon={getIcon(col)} size="lg" />
                          </span>
                        </OverlayTrigger>
                      ) : null;
                    })}
                  </td>
                  <td>{d.lifeStageName}</td>
                  <td>
                    {d.parameterName}
                    <br/>
                    <span className="small">{d.procedureName}</span>
                  </td>
                  <td>
                    {d.phenotypingCentre}
                    <br/>
                    <span className="small">{d.projectName}</span>
                  </td>
                  <td>
                    <span className="me-2 bold" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between'}}>
                      <span className="">
                        {!!d.pValue ? formatPValue(d.pValue) : 0}&nbsp;
                      </span>
                      <Link
                        href={`/data/charts?mgiGeneAccessionId=${d.mgiGeneAccessionId}&mpTermId=${d.phenotypeId}`}
                      >
                        <strong className="link primary small float-right">
                          <FontAwesomeIcon icon={faChartLine} /> Supporting data&nbsp;
                          <FontAwesomeIcon icon={faChevronRight} />
                        </strong>
                      </Link>
                    </span>
                  </td>
                </tr>
              );
              }
            )}
            {currentPage.length === 0 && (
              <tr>
                <td colSpan={8}>
                  <b>We couldn't find any results matching the filter</b>
                </td>
              </tr>
            )}
          </SortableTable>
        )}
      </Pagination>
    </>
  );
};

export default Associations;