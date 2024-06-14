import _ from "lodash";
import { useContext, useEffect, useState } from "react";
import {
  AlleleCell,
  OptionsCell,
  PlainTextCell,
  SignificantPValueCell,
  SmartTable,
} from "@/components/SmartTable";
import { GeneStatisticalResult } from "@/models/gene";
import { DownloadData, FilterBox } from "@/components";
import { AllelesStudiedContext, GeneContext } from "@/contexts";
import { MutantCountCell, ParameterCell, PhenotypeIconsCell, SupportingDataCell } from './custom-cells';
import { orderPhenotypedSelectionChannel } from "@/eventChannels";

const AllData = ({ data }: { data: GeneStatisticalResult[] }) => {
  const gene = useContext(GeneContext);
  const { setAlleles } = useContext(AllelesStudiedContext);
  const [sorted, setSorted] = useState<any[]>(null);
  const [procedure, setProcedure] = useState(undefined);
  const [query, setQuery] = useState(undefined);
  const [system, setSystem] = useState(undefined);
  const [selectedLifeStage, setSelectedLifeStage] = useState<string>(undefined);
  const [selectedZygosity, setSelectedZygosity] = useState<string>(undefined);
  const [selectedAllele, setSelectedAllele] = useState<string>(undefined);

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
      lifeStageName,
      zygosity,
      alleleSymbol
    }) =>
      (!procedure || procedureName === procedure) &&
      (!query ||
        `${procedureName} ${parameterName} ${parameterStableId} ${procedureStableId}`
          .toLowerCase()
          .includes(query)) &&
      (!system ||
        (topLevelPhenotypes ?? []).some(({ name }) => name === system)) &&
      (!selectedLifeStage || lifeStageName === selectedLifeStage) &&
      (!selectedZygosity || zygosity === selectedZygosity) &&
      (!selectedAllele || alleleSymbol === selectedAllele)
  );

  const procedures = _.sortBy(_.uniq(_.map(data, "procedureName")));
  const systems = _.sortBy(
    _.uniq(
      data.flatMap((p) => p.topLevelPhenotypes?.map((p) => p.name))
    ).filter(Boolean)
  );
  const lifestages = _.sortBy(_.uniq(_.map(data, "lifeStageName")));
  const zygosities = _.sortBy(_.uniq(_.map(data, "zygosity")));
  const alleles = _.sortBy(_.uniq(_.map(data, "alleleSymbol")));

  useEffect(() => {
    const unsubscribeOnAlleleSelection = orderPhenotypedSelectionChannel.on(
      "onAlleleSelected",
      (newAllele) => {
        if (newAllele !== selectedAllele && alleles.length > 1) {
          setSelectedAllele(newAllele);
        }
      });
    return () => {
      unsubscribeOnAlleleSelection();
    }
  }, [selectedAllele, alleles]);

  const sortPhenotypes = (data: Array<GeneStatisticalResult>, field: keyof GeneStatisticalResult, order: "asc" | "desc") => {
    if (field === "pValue") {
      return data.sort((p1, p2) => {
        const p1PValue = parseFloat(p1.pValue);
        const p2PValue = parseFloat(p2.pValue);
        if (!p1PValue) {
          return 1;
        } else if (!p2PValue) {
          return -1;
        }
        return order === "asc" ? p1PValue - p2PValue : p2PValue - p1PValue;
      });
    }
    return _.orderBy(data, field, order);
  };

  if (!data) {
    return null;
  }

  return (
    <>
      <SmartTable<GeneStatisticalResult>
        data={filtered}
        defaultSort={["pValue", "asc"]}
        customFiltering
        customSortFunction={sortPhenotypes}
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
              controlId="alleleFilterAD"
              label="Allele"
              value={selectedAllele}
              onChange={setSelectedAllele}
              ariaLabel="Filter by allele"
              options={alleles}
            />
            <FilterBox
              controlId="zygosityFilterAD"
              label="Zygosity"
              onChange={setSelectedZygosity}
              ariaLabel="Filter by zygosity"
              options={zygosities}
              controlStyle={{ width: 100, textTransform: 'capitalize' }}
            />
            <FilterBox
              controlId="systemFilterAD"
              label="Phy. System"
              onChange={setSystem}
              ariaLabel="Filter by physiological system"
              options={systems}
            />
            <FilterBox
              controlId="lifeStageFilterAD"
              label="Life Stage"
              onChange={setSelectedLifeStage}
              ariaLabel="Filter by life stage"
              options={lifestages}
              controlStyle={{ display: "inline-block", width: 100 }}
            />
          </>
        }
        additionalBottomControls={
          <DownloadData<GeneStatisticalResult>
            data={sorted}
            fileName={`${gene.geneSymbol}-all-phenotype-data`}
            fields={[
              { key: "alleleSymbol", label: "Allele" },
              { key: "phenotypingCentre", label: "Phenotyping center" },
              { key: "procedureName", label: "Procedure" },
              { key: "parameterName", label: "Parameter" },
              { key: "zygosity", label: "Zygosity" },
              {
                key: "femaleMutantCount",
                label: "Female mutant count",
                getValueFn: (item) =>
                  item?.femaleMutantCount?.toString() || "0",
              },
              {
                key: "maleMutantCount",
                label: "Male mutant count",
                getValueFn: (item) =>
                  item?.maleMutantCount?.toString() || "N/A",
              },
              { key: "lifeStageName", label: "Life stage" },
              {
                key: "significant",
                label: "Significant",
                getValueFn: (item) => (item.significant ? "Yes" : "No"),
              },
              {
                key: "pValue",
                label: "Most significant P-value",
                getValueFn: (item) => item?.pValue?.toString() || "N/A",
              },
            ]}
          />
        }
        columns={[
          {
            width: 2,
            label: "Procedure/parameter",
            field: "procedureName",
            cmp: <ParameterCell />,
          },
          {
            width: 1,
            label: "Supporting data",
            cmp: <SupportingDataCell />,
          },
          {
            width: 0.8,
            label: "System",
            field: "topLevelPhenotypes",
            cmp: <PhenotypeIconsCell allPhenotypesField="topLevelPhenotypes" />,
          },
          {
            width: 1,
            label: "Allele",
            field: "alleleSymbol",
            cmp: <AlleleCell />,
          },
          {
            width: 1,
            label: "Zygosity",
            field: "zygosity",
            cmp: <PlainTextCell style={{ textTransform: "capitalize" }} />,
          },
          {
            width: 1,
            label: "Life stage",
            field: "lifeStageName",
            cmp: <PlainTextCell />,
          },
          {
            width: 1,
            label: "Center",
            field: "phenotypingCentre",
            cmp: <PlainTextCell />,
          },
          {
            width: 0.7,
            label: "Mutants",
            field: "mutantCount",
            cmp: <MutantCountCell />,
          },
          {
            width: 0.5,
            label: "Significant",
            field: "significant",
            cmp: <OptionsCell options={{ true: "Yes", false: "No" }} />,
          },
          { width: 1, label: "P value", field: "pValue", cmp: <SignificantPValueCell /> },
        ]}
        highlightRowFunction={(item) =>
          item.maleMutantCount < item.procedureMinMales && item.femaleMutantCount < item.procedureMinFemales
        }
      />
    </>
  );
};

export default AllData;
