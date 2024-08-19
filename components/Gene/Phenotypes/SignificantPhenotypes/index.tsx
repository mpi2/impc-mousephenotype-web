import { useContext, useEffect, useState } from "react";
import { GeneContext } from "@/contexts";
import {
  PlainTextCell,
  SmartTable,
  PhenotypeIconsCell,
  AlleleCell, SignificantSexesCell, SignificantPValueCell
} from "@/components/SmartTable";
import { GenePhenotypeHits } from "@/models/gene";
import _ from 'lodash';
import { DownloadData, FilterBox } from "@/components";
import { summarySystemSelectionChannel } from "@/eventChannels";
import { SupportingDataCell } from "./custom-cells";


const SignificantPhenotypes = (
  {
    phenotypeData = [],
    hasDataRelatedToPWG,
  }: {
    phenotypeData: Array<GenePhenotypeHits>,
    hasDataRelatedToPWG: boolean,
  }) => {
  const gene = useContext(GeneContext);
  const [query, setQuery] = useState(undefined);
  const [selectedAllele, setSelectedAllele] = useState<string>(undefined);
  const [selectedSystem, setSelectedSystem] = useState<string>(undefined);
  const [selectedLifeStage, setSelectedLifeStage] = useState<string>(undefined);
  const [selectedZygosity, setSelectedZygosity] = useState<string>(undefined);
  const [hoveringRef, setHoveringRef] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribeOnSystemSelection = summarySystemSelectionChannel.on(
      'onSystemSelection',
      (payload) => {
        setSelectedSystem(payload);
        document.querySelector('#data')?.scrollIntoView();
      });
    return () => {
      unsubscribeOnSystemSelection();
    }
  }, []);

  const alleles = _.uniq(phenotypeData.map(phenotype => phenotype.alleleSymbol));
  const systems = _.uniq(phenotypeData.flatMap(p => p.topLevelPhenotypes.map(tl => tl.name)));
  const lifeStages = _.uniq(phenotypeData.map(p => p.lifeStageName));
  const zygosities = _.uniq(phenotypeData.map(p => p.zygosity));
  const filteredPhenotypeData = phenotypeData.filter(
    ({
       phenotypeName,
       phenotypeId,
       alleleSymbol,
       lifeStageName,
       topLevelPhenotypes,
       zygosity,
     }) =>
      (!selectedAllele || alleleSymbol === selectedAllele) &&
      (!query || `${phenotypeName} ${phenotypeId}`.toLowerCase().includes(query)) &&
      (!selectedSystem || (topLevelPhenotypes ?? []).some(({ name }) => name === selectedSystem)) &&
      (!selectedLifeStage || lifeStageName === selectedLifeStage) &&
      (!selectedZygosity || zygosity === selectedZygosity)
  );

  const sortPhenotypes = (data: Array<GenePhenotypeHits>, field: keyof GenePhenotypeHits, order: "asc" | "desc") => {
    if (field === "pValue") {
      return data.sort((p1, p2) => {
        if (!p1.pValue) {
          return 1;
        } else if (!p2.pValue) {
          return -1;
        }
        return order === "asc" ? p1.pValue - p2.pValue : p2.pValue - p1.pValue;
      });
    }
    return _.orderBy(data, field, order);
  };

  const onRefHover = (ref: string, active: boolean) => {
    setHoveringRef(active);
  };

  return (
    <>
      <SmartTable<GenePhenotypeHits>
        data={filteredPhenotypeData}
        defaultSort={["phenotypeName", "asc"]}
        customSortFunction={sortPhenotypes}
        customFiltering
        additionalTopControls={
          <>
            <FilterBox
              controlId="queryFilter"
              hideLabel
              onChange={setQuery}
              ariaLabel="Filter by parameters"
              controlStyle={{ width: 150 }}
            />
            <FilterBox
              controlId="zygosityFilterSP"
              label="Zygosity"
              onChange={setSelectedZygosity}
              ariaLabel="Filter by zygosity"
              options={zygosities}
              controlStyle={{ width: 100, textTransform: 'capitalize' }}
            />
            <FilterBox
              controlId="alleleFilter"
              label="Allele"
              onChange={setSelectedAllele}
              ariaLabel="Filter by allele"
              options={alleles}
            />
            <FilterBox
              controlId="systemFilter"
              label="Phy. System"
              value={selectedSystem}
              onChange={setSelectedSystem}
              ariaLabel="Filter by physiological system"
              options={systems}
            />
            <FilterBox
              controlId="lifeStageFilter-sph"
              label="Life Stage"
              onChange={setSelectedLifeStage}
              ariaLabel="Filter by life stage"
              options={lifeStages}
              controlStyle={{ display: 'inline-block', width: 100 }}
            />
          </>
        }
        additionalBottomControls={
          <>
            <div style={{ fontSize: '85%', flex: '1 0 100%', backgroundColor: hoveringRef ? "#FDF0E5" : "#FFF" }}>
              1. Does not have a P-value assigned because it was manually marked as significant
            </div>
            <DownloadData<GenePhenotypeHits>
              data={phenotypeData}
              fileName={`${gene.geneSymbol}-significant-phenotypes`}
              fields={[
                {key: 'phenotypeName', label: 'Phenotype'},
                {key: 'alleleSymbol', label: 'Allele'},
                {key: 'zygosity', label: 'Zygosity'},
                {key: 'sex', label: 'Sex'},
                {key: 'lifeStageName', label: 'Life stage'},
                {key: 'procedureName', label: 'Procedure'},
                {key: 'parameterName', label: 'Parameter'},
                {key: 'phenotypingCentre', label: 'Phenotyping center'},
                {
                  key: 'pValue',
                  label: 'Most significant P-value',
                  getValueFn: (item) => item?.pValue?.toString(10) || '-'
                },
              ]}
            />
            {hasDataRelatedToPWG && (
              <span style={{textAlign: 'right', fontSize: "90%" }}>
                  * Significant with a threshold of 1x10-3, check the&nbsp;
                <a className="primary link" href="https://www.mousephenotype.org/publications/data-supporting-impc-papers/pain/">
                    Pain Sensitivity page&nbsp;
                  </a>
                  for more information.
                </span>
            )}
          </>
        }
        columns={[
          {
            width: 2.2,
            label: "Phenotype",
            field: "phenotypeName",
            cmp: <PlainTextCell style={{ fontWeight: 'bold' }} />
          },
          {
            width: 1,
            label: "Supporting data",
            field: "numberOfDatasets",
            cmp: <SupportingDataCell />
          },
          {
            width: 0.8,
            label: "System",
            field: "topLevelPhenotypeName",
            cmp: <PhenotypeIconsCell allPhenotypesField="topLevelPhenotypes"/>
          },
          {width: 1, label: "Allele", field: "alleleSymbol", cmp: <AlleleCell/>},
          {width: 1, label: "Zygosity", field: "zygosity", cmp: <PlainTextCell style={{textTransform: "capitalize"}}/>},
          {width: 0.5, label: "Life stage", field: "lifeStageName", cmp: <PlainTextCell/>},
          {width: 0.5, label: "Significant sexes", field: "sex", cmp: <SignificantSexesCell/>},
          {width: 0.7, label: "Significant P-value", field: "pValue", cmp: <SignificantPValueCell onRefHover={onRefHover} />},
        ]}
      />
    </>
  );
};

export default SignificantPhenotypes;
