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
import { PhenotypeGenotypes } from "@/models/phenotype";
import { DownloadData } from "@/components";
import { GeneContext } from "@/contexts";

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
  const [sorted, setSorted] = useState<any[]>(null);
  const [procedure, setProcedure] = useState(undefined);
  const [query, setQuery] = useState(undefined);
  const [system, setSystem] = useState(undefined);

  useEffect(() => {
    setSorted(_.orderBy(data, "pValue", "asc"));
  }, [data]);

  const filtered = (sorted ?? []).filter(
    ({
      procedureName,
      parameterName,
      parameterStableId,
      procedureStableId,
      topLevelPhenotypes,
    }) =>
      (!procedure || procedureName === procedure) &&
      (!query ||
        `${procedureName} ${parameterName} ${parameterStableId} ${procedureStableId}`
          .toLowerCase()
          .includes(query)) &&
      (!system ||
        (topLevelPhenotypes ?? []).some(({ name }) => name === system))
  );

  const procedures = _.sortBy(_.uniq(_.map(data, "procedureName")));
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
          <div>
            <p>
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
              <label
                htmlFor="procedureFilter"
                className="grey"
                style={{ marginRight: "0.5rem" }}
              >
                Procedure:
              </label>
              <Form.Select
                style={{
                  display: "inline-block",
                  width: 200,
                  marginRight: "2rem",
                }}
                aria-label="Filter by procedures"
                defaultValue={undefined}
                id="procedureFilter"
                className="bg-white"
                onChange={(el) => {
                  setProcedure(
                    el.target.value === "all" ? undefined : el.target.value
                  );
                }}
              >
                <option value={"all"}>All</option>
                {procedures.map((p) => (
                  <option value={p} key={`procedure_${p}`}>
                    {p}
                  </option>
                ))}
              </Form.Select>
              <label
                htmlFor="systemFilter"
                className="grey"
                style={{ marginRight: "0.5rem" }}
              >
                Physiological system:
              </label>
              <Form.Select
                style={{
                  display: "inline-block",
                  width: 200,
                  marginRight: "2rem",
                }}
                aria-label="Filter by physiological system"
                defaultValue={undefined}
                id="systemFilter"
                className="bg-white"
                onChange={(el) => {
                  setSystem(
                    el.target.value === "all" ? undefined : el.target.value
                  );
                }}
              >
                <option value={"all"}>All</option>
                {allBodySystems.map((p) => (
                  <option value={p} key={`system_${p}`}>
                    {getLabel(p)}
                  </option>
                ))}
              </Form.Select>
            </p>
          </div>
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
            width: 2.5,
            label: "Procedure/parameter",
            field: "procedureName",
            cmp: <ParameterCell />
          },
          {
            width: 1.5,
            label: "System",
            field: "topLevelPhenotypes",
            cmp: <PhenotypeIconsCell allPhenotypesField="topLevelPhenotypes" />
          },
          { width: 1, label: "Allele", field: "alleleSymbol", cmp: <AlleleCell /> },
          { width: 1, label: "Zygosity", field: "zygosity", cmp: <PlainTextCell style={{ textTransform: "capitalize" }} /> },
          { width: 1, label: "Life stage", field: "lifeStageName", cmp: <PlainTextCell /> },
          { width: 1, label: "Center", field: "phenotypingCentre", cmp: <PlainTextCell /> },
          { width: 0.5, label: "Significant", field: "significant", cmp: <OptionsCell options={{ true: 'Yes', false: 'No' }} /> },
          { width: 2, label: "P value", field: "pValue", cmp: <PValueCell /> },
        ]}
      />
    </>
  );
};

export default AllData;
