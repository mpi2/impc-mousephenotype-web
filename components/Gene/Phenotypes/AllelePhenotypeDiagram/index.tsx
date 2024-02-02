import { GenePhenotypeHits } from "@/models/gene";
import { Alert } from "react-bootstrap";
import { useContext, useMemo, useState } from "react";
import { GeneContext } from "@/contexts";
import { extractSets, generateCombinations, VennDiagram } from '@upsetjs/react';
import { AlleleSymbol } from "@/components";

const AllelePhenotypeDiagram = (
  {
    phenotypeData,
    isPhenotypeLoading,
    isPhenotypeError
  }: {
    phenotypeData: Array<GenePhenotypeHits>,
    isPhenotypeLoading: boolean,
    isPhenotypeError: boolean,
  }
) => {
  const gene = useContext(GeneContext);
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
  const allelesByPhenotype = {};
  phenotypeData.forEach(phenotype => {
    if (allelesByPhenotype[phenotype.phenotypeName] === undefined) {
      allelesByPhenotype[phenotype.phenotypeName] = [];
    }
    if (!allelesByPhenotype[phenotype.phenotypeName].includes(phenotype.alleleSymbol)) {
      allelesByPhenotype[phenotype.phenotypeName].push(phenotype.alleleSymbol);
    }
  });
  const data = Object.keys(allelesByPhenotype).map(phenotype => {
    return {
      name: phenotype,
      sets: allelesByPhenotype[phenotype]
    }
  });

  const sets = useMemo(() => extractSets(data), [data]);
  const combinations = useMemo(() => generateCombinations(sets), [sets]);
  const [selection, setSelection] = useState(null);
  const [clickSelection, setClickSelection] = useState(null);
  return (
    <div style={{ position: 'relative', display: 'flex', paddingTop: '1rem' }}>
      <VennDiagram
        sets={sets}
        combinations={combinations}
        width={780}
        height={400}
        selection={selection || clickSelection}
        onHover={setSelection}
        onClick={setClickSelection}
        tooltips
      />
      <div className="selection">
        {clickSelection ? (
          <>
            {Array.from(clickSelection.sets).length === 1 ? (
              <>
                The allele&nbsp;
              </>
            ) : (
              <>
                The following alleles:&nbsp;<br/>
              </>
            )}
            {Array.from(clickSelection.sets).map((set: any) => set.name).map(allele => (
              <>
                <AlleleSymbol symbol={allele} withLabel={false}/>
                <br/>
              </>
            ))}
            {Array.from(clickSelection.sets).length === 1 ? (
              <>
                has these phenotypes:
              </>
            ) : (
              <>
                has these phenotypes in common:
              </>
            )}
            <ul>
              {clickSelection.elems
                .map(phenotype => phenotype.name)
                .sort()
                .map(phenotypeName => (
                  <li>{phenotypeName}</li>
                ))}
            </ul>
          </>
        ): <span>Please click in any segment that has a value &gt;0</span>}
      </div>
    </div>
  );

};

export default AllelePhenotypeDiagram;