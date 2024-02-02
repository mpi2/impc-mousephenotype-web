import { GenePhenotypeHits } from "@/models/gene";
import { Alert, Form } from "react-bootstrap";
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
  const [field, setField] = useState<keyof GenePhenotypeHits>('alleleSymbol');
  const [selection, setSelection] = useState(null);
  const [clickSelection, setClickSelection] = useState(null);

  const getLabel = (field: keyof GenePhenotypeHits, plural: boolean = false) => {
    switch (field) {
      case "alleleSymbol":
        return plural ? 'alleles' : 'allele';
      case "sex":
        return plural ? 'sexes' : 'sex';
      case "zygosity":
        return plural ? 'zygosities' : 'zygosity';
    }
  }

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
  const allelesByField = {};
  phenotypeData.forEach(phenotype => {
    if (allelesByField[phenotype.phenotypeName] === undefined) {
      allelesByField[phenotype.phenotypeName] = [];
    }
    if (!allelesByField[phenotype.phenotypeName].includes(phenotype[field])) {
      allelesByField[phenotype.phenotypeName].push(phenotype[field]);
    }
  });
  console.log(allelesByField);
  const data = Object.keys(allelesByField).map(phenotype => {
    return {
      name: phenotype,
      sets: allelesByField[phenotype]
    }
  });

  const sets = useMemo(() => extractSets(data), [data]);
  const combinations = useMemo(() => generateCombinations(sets), [sets]);

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
        <div>
          <Form.Label htmlFor="fieldSelector">Group by</Form.Label>
          <Form.Select
            id="fieldSelector"
            value={field}
            onChange={event => {
              setClickSelection(null);
              setSelection(null);
              setField(event.target.value as keyof GenePhenotypeHits);
            }}
          >
            <option value="alleleSymbol">Allele</option>
            <option value="sex">Sex</option>
            <option value="zygosity">Zygosity</option>
          </Form.Select>
        </div>
        {clickSelection ? (
          <>
            {Array.from(clickSelection.sets).length === 1 ? (
              <>
                The {getLabel(field)}&nbsp;
              </>
            ) : (
              <>
                The following {getLabel(field, true)}:&nbsp;<br/>
              </>
            )}
            {Array.from(clickSelection.sets).map((set: any) => set.name).map(value => (
              <>
                {field === 'alleleSymbol' ? (
                  <AlleleSymbol symbol={value} withLabel={false}/>
                ) : (
                  <span>{value}</span>
                )}
                <br/>
              </>
            ))}
            {Array.from(clickSelection.sets).length === 1 ? (
              <>
                has these phenotypes:
              </>
            ) : (
              <>
                have these phenotypes in common:
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
        ): <span>Click in any segment to view the intersection details</span>}
      </div>
    </div>
  );

};

export default AllelePhenotypeDiagram;