import {useEffect, useState} from "react";
import _ from "lodash";
import {Alert, OverlayTrigger, Tooltip} from "react-bootstrap";
import Pagination from "../Pagination";
import SortableTable from "../SortableTable";
import {formatAlleleSymbol, formatPValue} from "../../utils";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMars, faMarsAndVenus, faVenus} from "@fortawesome/free-solid-svg-icons";

const Associations = ({ data }: { data: any }) => {
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

  const processed =
    (groups ? Object.values(groups) : []).map((d: any) => ({
      ...d,
      phenotype: d.phenotype.name,
      id: d.phenotype.id,
    })) || [];

  const [sorted, setSorted] = useState<any[]>(null);

  useEffect(() => {
    setSorted(_.orderBy(processed, "alleleSymbol", "asc"));
  }, [data]);

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

  if (!data) {
    return (
      <Alert style={{ marginTop: "1em" }} variant="primary">
        All data not available
      </Alert>
    );
  }

  return (
    <>
      <Pagination data={processed}>
        {(currentPage) => (
          <SortableTable
            doSort={(sort) => {
              setSorted(_.orderBy(data, sort[0], sort[1]));
            }}
            defaultSort={["alleleSymbol", "asc"]}
            headers={[
              {
                width: 2,
                label: "Gene / allele",
                field: "alleleSymbol",
              },
              {
                width: 1,
                label: "Zygosity",
                field: "zygosity",
              },
              { width: 1, label: "Sex", field: "sex" },
              { width: 1, label: "Life stage", field: "lifeStage" },
              { width: 2, label: "Phenotype", field: "phenotype" },
              { width: 2, label: "Parameter", field: "parameter" },
              {
                width: 2,
                label: "Phenotyping Center",
                field: "phephenotypingCenternotype",
              },
              { width: 2, label: "P-value", field: "pValue" },
            ]}
          >
            {currentPage.map((d, i) => {
              const allele = formatAlleleSymbol(d.alleleSymbol);
              return (
                <tr key={`tr-${d.alleleSymbol}-${i}`}>
                  <td>
                    {allele[0]}
                    <sup>{allele[1]}</sup>
                  </td>
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
                  <td>{d.phenotype}</td>
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
                    <span className="me2 bold">
                      <span className="orange-dark">
                        {formatPValue(d.pValue)}
                      </span>
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