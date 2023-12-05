import {
  faVenus,
  faMars,
  faMarsAndVenus,
  faChevronRight,
  faChartLine,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useContext, useState } from "react";
import { BodySystem } from "@/components/BodySystemIcon";
import Pagination from "@/components/Pagination";
import SortableTable from "@/components/SortableTable";
import styles from "./styles.module.scss";
import { formatAlleleSymbol, formatPValue } from "@/utils";
import { Alert, Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useSignificantPhenotypesQuery } from "@/hooks/significant-phenotypes.query";
import { GeneContext } from "@/contexts";
import { useRouter } from "next/router";

const SignificantPhenotypes = () => {
  const router = useRouter();
  const gene = useContext(GeneContext);
  const [query, setQuery] = useState(undefined);
  const [sortOptions, setSortOptions] = useState<string>('');

  const {
    phenotypeData,
    isPhenotypeLoading,
    isPhenotypeError
  } = useSignificantPhenotypesQuery(gene.mgiGeneAccessionId, router.isReady, sortOptions);

  const getIcon = (sex: string) => {
    switch (sex) {
      case "male":
        return faMars;
      case "female":
        return faVenus;
      default:
        return faMarsAndVenus;
    }
  };

  const getSexLabel = (sex: string) => {
    switch (sex) {
      case "male":
        return "Male";
      case "female":
        return "Female";
      default:
        return "Combined";
    }
  };

  const filtered = phenotypeData.filter(({phenotype, phenotypeId}) =>
    (!query || `${phenotype} ${phenotypeId}`.toLowerCase().includes(query))
  );

  if (isPhenotypeLoading) {
    return <p className="grey" style={{ padding: '1rem' }}>Loading...</p>
  }
  if (isPhenotypeError) {
    return (
      <Alert variant="primary" className="mt-3">
        No significant phenotypes for {gene.geneSymbol}.
      </Alert>
    )
  }

  return (
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
        ></Form.Control>
      }
    >
      {(pageData) => (
        <SortableTable
          doSort={([field, order]) => {
            setSortOptions(`${field};${order}`);
          }}
          defaultSort={["phenotypeName", "asc"]}
          headers={[
            { width: 2.2, label: "Phenotype", field: "phenotypeName" },
            {
              width: 1,
              label: "System",
              field: "topLevelPhenotypeName",
            },
            { width: 1, label: "Allele", field: "alleleSymbol" },
            { width: 1, label: "Zyg", field: "zygosity" },
            { width: 1, label: "Life stage", field: "lifeStageName" },
            {
              width: 1,
              label: "Significant sexes",
              field: "pValue",
            },
            {
              width: 2,
              label: "Most significant P-value",
              field: "sex",
            },
          ]}
        >
          {pageData.map((d) => {
            const allele = formatAlleleSymbol(d.alleleSymbol);
            return (
              <tr>
                <td><strong>{d.phenotypeName}</strong></td>
                <td>
                  {d.topLevelPhenotypes?.map(({ name }) => (
                    <BodySystem name={name} color="system-icon black in-table" noSpacing />
                  ))}
                </td>
                <td>
                  {allele[0]}
                  <sup>{allele[1]}</sup>
                </td>
                <td style={{ textTransform: "capitalize" }}>{d.zygosity}</td>
                <td>{d.lifeStageName}</td>
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
                <td>
                  <span className={`me-2 bold ${styles.pValueCell}`}>
                    <span className="">
                      {!!d.pValue ? formatPValue(d.pValue) : 0}&nbsp;
                    </span>
                    <Link href={`/data/charts?mgiGeneAccessionId=${d.mgiGeneAccessionId}&mpTermId=${d.id}`}>
                      <strong className={`link primary small float-right`}>
                        <FontAwesomeIcon icon={faChartLine} /> Supporting data&nbsp;
                        <FontAwesomeIcon icon={faChevronRight} />
                      </strong>
                    </Link>
                  </span>
                </td>
              </tr>
            );
          })}
          {pageData.length === 0 && (
            <tr>
              <td colSpan={7}>
                <b>We couldn't find any results matching the filter</b>
              </td>
            </tr>
          )}
        </SortableTable>
      )}
    </Pagination>
  );
};

export default SignificantPhenotypes;
