import { useContext, useEffect, useState } from "react";
import { Alert } from "react-bootstrap";
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


const SignificantPhenotypes = (
  {
    phenotypeData,
    isPhenotypeLoading,
    isPhenotypeError,
    hasDataRelatedToPWG,
  }: {
    phenotypeData: Array<GenePhenotypeHits>,
    isPhenotypeLoading: boolean,
    isPhenotypeError: boolean,
    hasDataRelatedToPWG: boolean,
  }) => {
  const gene = useContext(GeneContext);
  const [query, setQuery] = useState(undefined);
  const [selectedAllele, setSelectedAllele] = useState<string>(undefined);
  const [selectedSystem, setSelectedSystem] = useState<string>(undefined);
  const [selectedLifeStage, setSelectedLifeStage] = useState<string>(undefined);

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

  const alleles = _.uniq(phenotypeData.map(phenotype => phenotype.alleleSymbol));
  const systems = _.uniq(phenotypeData.flatMap(p => p.topLevelPhenotypes.map(tl => tl.name)));
  const lifeStages = _.uniq(phenotypeData.map(p => p.lifeStageName));
  const filteredPhenotypeData = phenotypeData.filter(
    ({
       phenotypeName,
       phenotypeId,
       alleleSymbol,
       lifeStageName,
       topLevelPhenotypes,
    }) =>
    (!selectedAllele || alleleSymbol === selectedAllele) &&
    (!query || `${phenotypeName} ${phenotypeId}`.toLowerCase().includes(query)) &&
    (!selectedSystem || (topLevelPhenotypes ?? []).some(({ name }) => name === selectedSystem)) &&
    (!selectedLifeStage || lifeStageName === selectedLifeStage)
  );

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

  return (
    <SmartTable<GenePhenotypeHits>
      data={filteredPhenotypeData}
      defaultSort={["phenotypeName", "asc"]}
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
            controlId="lifeStageFilter"
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
                getValueFn: (item) => item?.pValue?.toString(10) || '1'
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
          label: "System",
          field: "topLevelPhenotypeName",
          cmp: <PhenotypeIconsCell allPhenotypesField="topLevelPhenotypes"/>
        },
        {width: 1, label: "Allele", field: "alleleSymbol", cmp: <AlleleCell/>},
        {width: 1, label: "Zygosity", field: "zygosity", cmp: <PlainTextCell style={{textTransform: "capitalize"}}/>},
        {width: 1, label: "Life stage", field: "lifeStageName", cmp: <PlainTextCell/>},
        {width: 1, label: "Significant sexes", field: "sex", cmp: <SignificantSexesCell/>},
        {width: 2, label: "Most significant P-value", field: "pValue", cmp: <SignificantPValueCell linkToGrossPathChart />},
      ]}
    />
  );
};

export default SignificantPhenotypes;
