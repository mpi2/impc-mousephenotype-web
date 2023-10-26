import { BodySystem } from "../../../BodySystemIcon";
import styles from "./styles.module.scss";
import _ from "lodash";
import { useEffect, useState } from "react";
import Pagination from "../../../Pagination";
import SortableTable from "../../../SortableTable";
import { Form } from "react-bootstrap";
import { formatAlleleSymbol, formatPValue } from "@/utils";
import { allBodySystems } from "../../Summary";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine, faChevronRight } from "@fortawesome/free-solid-svg-icons";

const AllData = ({ data }: { data: any }) => {
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
  console.log(data[0]);

  return (
    <>
      <Pagination
        data={filtered}
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
      >
        {(currentPage) => (
          <SortableTable
            doSort={(sort) => {
              setSorted(_.orderBy(data, sort[0], sort[1]));
            }}
            defaultSort={["pValue", "asc"]}
            headers={[
              {
                width: 3,
                label: "Procedure/parameter",
                field: "procedureName",
              },
              {
                width: 1,
                label: "Phy. system",
                field: "topLevelPhenotypes",
              },
              { width: 1, label: "Life stage", field: "lifeStageName" },
              { width: 1, label: "Allele", field: "alleleSymbol" },
              { width: 1, label: "Center", field: "phenotypingCentre" },
              { width: 1, label: "Zygosity", field: "zygosity" },
              { width: 0.5, label: "Significant", field: "significant" },
              { width: 2, label: "P value", field: "pValue" },
            ]}
          >
            {currentPage.map(
              (
                {
                  mgiGeneAccessionId,
                  alleleAccessionId,
                  pipelineStableId,
                  procedureStableId,
                  parameterStableId,
                  phenotypingCentre,
                  procedureName,
                  parameterName,
                  lifeStageName,
                  zygosity,
                  significant,
                  pValue,
                  topLevelPhenotypes,
                  alleleSymbol,
                  phenotypingCentre,
                },
                i
              ) => {
                const allele = formatAlleleSymbol(alleleSymbol);
                return (
                  <tr key={`tr-${parameterName}-${i}`}>
                    <td className={styles.procedureName}>
                      <small className="grey">{procedureName} /</small>
                      <br />
                      <strong>{parameterName}</strong>
                    </td>
                    <td>
                      {(topLevelPhenotypes || []).map((x) => (
                        <BodySystem
                          name={x.name}
                          key={x.id}
                          color="system-icon black in-table"
                          noSpacing
                        />
                      ))}
                    </td>
                    <td>{lifeStageName}</td>
                    <td>
                      {allele[0]}
                      <sup>{allele[1]}</sup>
                    </td>
                    <td>{phenotypingCentre}</td>
                    <td style={{ textTransform: "capitalize" }}>{zygosity}</td>
                    <td>{significant ? "Yes" : "No"}</td>
                    <td className="bold">
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span className="">
                          {!!pValue ? formatPValue(pValue) : "-"}
                        </span>
                        <Link
                          href={`/data/charts?mgiGeneAccessionId=${mgiGeneAccessionId}&alleleAccessionId=${alleleAccessionId}&zygosity=${zygosity}&parameterStableId=${parameterStableId}&pipelineStableId=${pipelineStableId}&procedureStableId=${procedureStableId}&phenotypingCentre=${phenotypingCentre}`}
                          legacyBehavior
                        >
                          <strong className={`link primary small float-right`}>
                            <FontAwesomeIcon icon={faChartLine} /> Supporting
                            data <FontAwesomeIcon icon={faChevronRight} />
                          </strong>
                        </Link>
                      </div>
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

export default AllData;
