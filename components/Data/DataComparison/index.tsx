import { useState } from "react";
import Pagination from "../../Pagination";
import SortableTable from "../../SortableTable";
import _ from "lodash";
import { formatAlleleSymbol, formatPValue, getIcon, getSexLabel } from "@/utils";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dataset } from "@/models";


type LastColumnProps = {
  isViabilityChart: boolean,
  dataset: any
};

const LastColumn = ({ isViabilityChart, dataset }: LastColumnProps) => {
  return isViabilityChart ? (
    <td>
      {dataset.viability}
    </td>
  ) : (
    <>
      {["male", "female", "not_considered"].map((col) => {
        const pValue = dataset[`pValue_${col}`];
        const isMostSignificant = pValue < 0.0001;
        return (
          <td
            className={
              isMostSignificant
                ? "bold orange-dark-x bg-orange-light-x"
                : "bold"
            }
          >
            {!!dataset[`pValue_${col}`] ? (
              formatPValue(pValue)
            ) : (
              <OverlayTrigger
                placement="top"
                trigger={["hover", "focus"]}
                overlay={
                  <Tooltip>Not significant or not tested</Tooltip>
                }
              >
                <span className="grey">—</span>
              </OverlayTrigger>
            )}
          </td>
        );
      })}
    </>
  );
}


type Props = {
  data: Array<Dataset>;
  selectedParameter?: string | null;
  isViabilityChart?: boolean;
  initialSortByProp?: string;
  visibility: boolean;
}

type SortOptions = {
  prop: string | ((any) => void);
  order: 'asc' | 'desc',
}
const DataComparison = (props: Props) => {
  const {
    data,
    selectedParameter,
    isViabilityChart = false,
    initialSortByProp,
    visibility,
  } = props;
  const groups = data?.reduce((acc, d) => {
    const {
      alleleAccessionId,
      parameterStableId,
      zygosity,
      sex,
      reportedPValue,
      phenotypeSex,
      phenotypingCentre,
      colonyId,
    } = d;

    const key = `${alleleAccessionId}-${parameterStableId}-${zygosity}-${phenotypingCentre}-${colonyId}`;
    const statMethodPValueKey = sex === 'female' ? 'femaleKoEffectPValue' : 'maleKoEffectPValue';
    const pValueFromStatMethod = d.statisticalMethod?.attributes?.[statMethodPValueKey];
    if (acc[key]) {
      if (acc[key].reportedPValue < pValueFromStatMethod) {
        acc[key].reportedPValue = Number(pValueFromStatMethod);
        acc[key].sex = sex;
      }
    } else {
      acc[key] = { ...d, key, reportedPValue: pValueFromStatMethod };
    }
    if (sex) {
      const pValue = reportedPValue < pValueFromStatMethod ? reportedPValue : pValueFromStatMethod;
      acc[key][`pValue_${sex}`] = Number(pValue);
    }
    if(phenotypeSex?.length > 0) {
      if (!!d.statisticalMethod?.attributes?.maleKoEffectPValue) {
        acc[key][`pValue_male`] = d.statisticalMethod?.attributes?.maleKoEffectPValue;
      }
      if (!!d.statisticalMethod?.attributes?.femaleKoEffectPValue) {
        acc[key][`pValue_female`] = d.statisticalMethod?.attributes?.femaleKoEffectPValue;
      }
      if (phenotypeSex.length >= 2) {
        acc[key][`pValue_not_considered`] = Number(reportedPValue);
      }
    }
    return acc;
  }, {});

  console.log(data);

  const processed = (groups ? Object.values(groups) : []).map((d: any, index) => {
      const getLethality = () => {
        if (!d.significant) {
          return 'Viable';
        }
        if (d.significant && d.significantPhenotype?.id === 'MP:0011100') {
          return 'Lethal';
        }
        if (d.significant && d.significantPhenotype?.id === 'MP:0011110') {
          return 'Subviable'
        }
        return '-';
      };

      return {
        ...d,
        datasetNum: index + 1,
        topLevelPhenotype: d.topLevelPhenotypes?.[0]?.name,
        phenotype: d.significantPhenotype?.name,
        id: d.significantPhenotype?.id,
        viability: getLethality(),
      }
    }) || [];
  const [sortOptions, setSortOptions] = useState<SortOptions>({
    prop: !!initialSortByProp ? initialSortByProp : 'phenotype',
    order: 'asc' as const,
  })
  const sorted = _.orderBy(processed, sortOptions.prop, sortOptions.order);
  if (!data || !visibility) {
    return null;
  }

  const getPValueSortFn = (key: string) => {
    return (d) => {
      return d[`pValue_${key}`] ?? 0;
    };
  };

  const lastColumnHeader = isViabilityChart ? {
    width: 2,
    label: "Viability",
    field: "viability"
  } : {
    width: 2,
    label: "P Value",
    field: "pValue",
    children: [
      {
        width: 1,
        label: "Male",
        field: "pValue_male",
        sortFn: getPValueSortFn("male"),
      },
      {
        width: 1,
        label: "Female",
        field: "pValue_female",
        sortFn: getPValueSortFn("female"),
      },
      {
        width: 1,
        label: "Combined",
        field: "pValue_not_considered",
        sortFn: getPValueSortFn("not_considered"),
      },
    ],
  }

  return (
    <Pagination data={sorted}>
      {(pageData) => (
        <SortableTable
          doSort={(sort) => {
            setSortOptions({
              prop: sort[0],
              order: sort[1]
            })
          }}
          defaultSort={["parameter", "asc"]}
          headers={[
            { width: 0.5, label: "#", disabled: true },
            { width: 3, label: "Parameter", field: "parameter" },
            {
              width: 1,
              label: "Phenotyping Centre",
              field: "phenotypingCentre",
            },
            { width: 2, label: "Allele", field: "alleleSymbol" },
            { width: 1, label: "Zygosity", field: "zygosity" },
            { width: 1, label: "Significant sex", field: "sex" },
            { width: 1, label: "Life Stage", field: "lifeStageName" },
            { width: 1, label: "Colony Id", field: "colonyId",},
            lastColumnHeader,
          ]}
        >
          {pageData.map((d, i) => {
            const allele = formatAlleleSymbol(d.alleleSymbol);
            return (
              <tr key={d.key} style={d.key === selectedParameter ? { borderWidth: 3, borderColor: '#00B0B0' } : {} }>
                <td>{d.datasetNum}</td>
                <td>{d.parameterName}</td>
                <td>{d.phenotypingCentre}</td>
                <td>
                  {allele[0]}
                  <sup>{allele[1]}</sup>
                </td>
                <td>{d.zygosity}</td>
                <td>
                  {d.sex === 'not_considered' ? (
                    <OverlayTrigger
                      placement="top"
                      trigger={["hover", "focus"]}
                      overlay={<Tooltip>{getSexLabel(d.sex)}</Tooltip>}
                    >
                      <span className="me-2">
                        <FontAwesomeIcon icon={getIcon(d.sex)} size="lg" />
                      </span>
                    </OverlayTrigger>
                  ) : (
                    <>
                      {["male", "female", "not_considered"]
                        .filter(sex => d.sex === sex)
                        .map(significantSex => (
                          <OverlayTrigger
                            placement="top"
                            trigger={["hover", "focus"]}
                            overlay={<Tooltip>{getSexLabel(significantSex)}</Tooltip>}
                          >
                            <span className="me-2">
                              <FontAwesomeIcon icon={getIcon(significantSex)} size="lg" />
                            </span>
                          </OverlayTrigger>
                        ))}
                    </>
                  )}
                </td>
                <td>{d.lifeStageName}</td>
                <td>{d.colonyId}</td>
                <LastColumn dataset={d} isViabilityChart={isViabilityChart} />
              </tr>
            );
          })}
        </SortableTable>
      )}
    </Pagination>
  );
};

export default DataComparison;
