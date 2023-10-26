import {useEffect, useState} from "react";
import _ from "lodash";
import { Alert, Badge, OverlayTrigger, Tooltip } from "react-bootstrap";
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
  faXmark
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";


const Associations = ({ data, selectedGenes, onRemoveSelection }: { data: any, selectedGenes: Array<any>, onRemoveSelection: (gene: any) => void, }) => {
  const groups = data?.reduce((acc, d) => {
    const {
      phenotype: { id, name },
      alleleAccessionId,
      zygosity,
      sex,
      pValue,
    } = d;

    const key = `${id}-${alleleAccessionId}-${zygosity}`;
    if (acc[key]) {
      if (acc[key].pValue > pValue) {
        acc[key].pValue = Number(pValue);
        acc[key].sex = sex;
      }
    } else {
      acc[key] = { ...d };
    }
    acc[key][`pValue_${sex}`] = Number(pValue);

    return acc;
  }, {});
  const isGeneSelected = selectedGenes.length > 0;

  const processed =
    (groups ? Object.values(groups) : []).map((d: any) => ({
      ...d,
      phenotype: d.phenotype.name,
      id: d.phenotype.id,
    })) || [];

  const [sorted, setSorted] = useState<any[]>(null);

  useEffect(() => {
    let orderedData = _.orderBy(processed, "alleleSymbol", "asc");

    if (selectedGenes.length > 0) {
      const listOfSymbols = selectedGenes.map(g => g.mgiGeneAccessionId);
      orderedData = orderedData.filter(item => listOfSymbols.includes(item.mgiGeneAccessionId));
    }
    setSorted(orderedData);
  }, [data, selectedGenes.length]);

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

  const GeneSelectedBadge = () => (
    <>
      Filtering data by gene{selectedGenes.length > 1 ? 's' : ''}:
      {selectedGenes.map(gene => (
        <Badge
          key={gene.mgiGeneAccessionId}
          style={{ fontSize: '1em', backgroundColor: '#00b0b0', fontWeight: 'normal', cursor: 'pointer' }}
          pill
          bg="light"
          onClick={() => onRemoveSelection(gene)}
        >
          {gene.geneSymbol}
          &nbsp;
          <FontAwesomeIcon icon={faXmark} />
        </Badge>
      ))}
    </>
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
      <Pagination
        data={sorted}
        additionalTopControls={isGeneSelected ? <GeneSelectedBadge /> : null}
      >
        {(currentPage) => (
          <SortableTable
            doSort={(sort) => setSorted(_.orderBy(processed, sort[0], sort[1]))}
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
                  <td>{d.phenotype}</td>
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
                        href="/data/charts?accession=MGI:2444773&allele_accession_id=MGI:6276904&zygosity=homozygote&parameter_stable_id=IMPC_DXA_004_001&pipeline_stable_id=UCD_001&procedure_stable_id=IMPC_DXA_001&parameter_stable_id=IMPC_DXA_004_001&phenotyping_center=UC%20Davis"
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
          </SortableTable>
        )}
      </Pagination>
    </>
  );
};

export default Associations;