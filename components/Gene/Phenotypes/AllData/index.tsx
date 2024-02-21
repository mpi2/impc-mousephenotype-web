import _ from "lodash";
import { useContext, useEffect, useState } from "react";
import {
  AlleleCell, OptionsCell, PhenotypeIconsCell,
  PlainTextCell,
  SmartTable
} from "@/components/SmartTable";
import { GeneStatisticalResult } from "@/models/gene";
import { Form } from "react-bootstrap";
import { allBodySystems } from "../../Summary";
import { TableCellProps } from "@/models";
import { formatPValue } from "@/utils";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import styles from './styles.module.scss';
import { DownloadData, FilterBox } from "@/components";
import { AllelesStudiedContext, GeneContext } from "@/contexts";

const ParameterCell = <T extends GeneStatisticalResult>(props: TableCellProps<T>) => {
  return (
    <span className={styles.procedureName}>
      <small className="grey">{props.value.procedureName} /</small>
      <br />
      <strong>{props.value.parameterName}</strong>
    </span>
  )
};

const PValueCell = <T extends GeneStatisticalResult>(props: TableCellProps<T>) => {
  const {
    pValue,
    mgiGeneAccessionId,
    alleleAccessionId,
    zygosity,
    parameterStableId,
    pipelineStableId,
    procedureStableId,
    phenotypingCentre,
  } = props.value;
  let url = `/data/charts?mgiGeneAccessionId=${mgiGeneAccessionId}&alleleAccessionId=${alleleAccessionId}&zygosity=${zygosity}&parameterStableId=${parameterStableId}&pipelineStableId=${pipelineStableId}&procedureStableId=${procedureStableId}&phenotypingCentre=${phenotypingCentre}`;
  if (
    procedureStableId.includes('IMPC_PAT') &&
    parameterStableId
  ) {
    url = `/data/gross-pathology/${mgiGeneAccessionId}/?grossPathParameterStableId=${parameterStableId}`
  }
  return (
    <div
      className="bold"
      style={{
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <span className="">
        {!!pValue ? formatPValue(Number.parseFloat(pValue)) : "-"}
      </span>
      <Link
        href={url}
      >
        <strong className={`link primary small float-right`}>
          <FontAwesomeIcon icon={faChartLine} /> Supporting
          data <FontAwesomeIcon icon={faChevronRight} />
        </strong>
      </Link>
    </div>
  )
}

const AllData = ({ data }: { data: GeneStatisticalResult[] }) => {
  const gene = useContext(GeneContext);
  const { setAlleles } = useContext(AllelesStudiedContext);
  const [sorted, setSorted] = useState<any[]>(null);
  const [procedure, setProcedure] = useState(undefined);
  const [query, setQuery] = useState(undefined);
  const [system, setSystem] = useState(undefined);
  const [selectedLifeStage, setSelectedLifeStage] = useState<string>(undefined);

  useEffect(() => {
    const newData = _.orderBy(data, "pValue", "asc");
    setAlleles(_.uniq(_.map(newData, "alleleSymbol")));
    setSorted(newData);
  }, [data]);

  const filtered = (sorted ?? []).filter(
    ({
      procedureName,
      parameterName,
      parameterStableId,
      procedureStableId,
      topLevelPhenotypes,
      lifeStageName
    }) =>
      (!procedure || procedureName === procedure) &&
      (!query ||
        `${procedureName} ${parameterName} ${parameterStableId} ${procedureStableId}`
          .toLowerCase()
          .includes(query)) &&
      (!system || (topLevelPhenotypes ?? []).some(({ name }) => name === system)) &&
      (!selectedLifeStage || lifeStageName === selectedLifeStage)
  );

  const procedures = _.sortBy(_.uniq(_.map(data, "procedureName")));
  const systems = _.sortBy(_.uniq(data.flatMap(p => p.topLevelPhenotypes.map(p => p.name).filter(Boolean))));
  const lifestages = _.sortBy(_.uniq(_.map(data, "lifeStageName")));

  const getLabel = (name) => _.capitalize(name.replace(/ phenotype/g, ""));

  if (!data) {
    return null;
  }

  return (
    <>
      <SmartTable<GeneStatisticalResult>
        data={filtered}
        defaultSort={["pValue", "asc"]}
        customFiltering
        additionalTopControls={
          <>
            <FilterBox
              controlId="queryFilterAD"
              hideLabel
              onChange={setQuery}
              ariaLabel="Filter by parameters"
              controlStyle={{ width: 150 }}
            />
            <FilterBox
              controlId="procedureFilterAD"
              label="Procedure"
              onChange={setProcedure}
              ariaLabel="Filter by procedures"
              options={procedures}
            />
            <FilterBox
              controlId="systemFilterAD"
              label="Phy. System"
              onChange={setSystem}
              ariaLabel="Filter by physiological system"
              options={systems}
            />
            <FilterBox
              controlId="lifeStageFilter"
              label="Life Stage"
              onChange={setSelectedLifeStage}
              ariaLabel="Filter by life stage"
              options={lifestages}
              controlStyle={{ display: 'inline-block', width: 100 }}
            />
          </>
        }
        additionalBottomControls={
          <DownloadData<GeneStatisticalResult>
            data={sorted}
            fileName={`${gene.geneSymbol}-all-phenotype-data`}
            fields={[
              { key: 'alleleSymbol', label: 'Allele' },
              { key: 'phenotypingCentre', label: 'Phenotyping center' },
              { key: 'procedureName', label: 'Procedure' },
              { key: 'parameterName', label: 'Parameter' },
              { key: 'zygosity', label: 'Zygosity' },
              { key: 'femaleMutantCount', label: 'Female mutant count', getValueFn: (item) => item?.femaleMutantCount?.toString() || '0'},
              { key: 'maleMutantCount', label: 'Male mutant count', getValueFn: (item) => item?.maleMutantCount?.toString() || 'N/A' },
              { key: 'lifeStageName', label: 'Life stage' },
              { key: 'significant', label: 'Significant', getValueFn: item => item.significant ? 'Yes' : 'No' },
              { key: 'pValue', label: 'Most significant P-value', getValueFn: (item) => item?.pValue?.toString() || 'N/A' },
            ]}
          />
        }
        columns={[
          {
            width: 2,
            label: "Procedure/parameter",
            field: "procedureName",
            cmp: <ParameterCell />
          },
          {
            width: 1.3,
            label: "System",
            field: "topLevelPhenotypes",
            cmp: <PhenotypeIconsCell allPhenotypesField="topLevelPhenotypes" />
          },
          { width: 1, label: "Allele", field: "alleleSymbol", cmp: <AlleleCell /> },
          { width: 1, label: "Zygosity", field: "zygosity", cmp: <PlainTextCell style={{ textTransform: "capitalize" }} /> },
          { width: 1, label: "Life stage", field: "lifeStageName", cmp: <PlainTextCell /> },
          { width: 1, label: "Center", field: "phenotypingCentre", cmp: <PlainTextCell /> },
          { width: 0.7, label: "Mutants", field: "mutantCount", cmp: <PlainTextCell /> },
          { width: 0.5, label: "Significant", field: "significant", cmp: <OptionsCell options={{ true: 'Yes', false: 'No' }} /> },
          { width: 2, label: "P value", field: "pValue", cmp: <PValueCell /> },
        ]}
      />
    </>
  );
};

export default AllData;
