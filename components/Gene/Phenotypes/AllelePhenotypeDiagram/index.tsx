import { GenePhenotypeHits } from "@/models/gene";
import { Alert, Form } from "react-bootstrap";
import { useContext, useMemo, useState } from "react";
import { GeneContext } from "@/contexts";
import { UpSetJS, extractCombinations } from '@upsetjs/react';

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
    const keyValue: keyof GenePhenotypeHits = field === 'topLevelPhenotypeName' ? 'topLevelPhenotypeName' : 'phenotypeName';
    if (allelesByField[phenotype[keyValue]] === undefined) {
      allelesByField[phenotype[keyValue]] = [];
    }
    let value = field === 'topLevelPhenotypeName' ? phenotype.alleleSymbol: phenotype[field];
    if (field === 'sex' && value === 'not_considered') {
      value = 'both sexes';
    }
    if (!allelesByField[phenotype[keyValue]].includes(value)) {
      allelesByField[phenotype[keyValue]].push(value);
    }
  });
  const data = Object.keys(allelesByField).map(phenotype => {
    return {
      name: phenotype,
      sets: allelesByField[phenotype]
    }
  });

  const { sets, combinations } = useMemo(() => {
    const tempRes = extractCombinations(data);
    return {
      sets: tempRes.sets,
      combinations: tempRes.combinations.toSorted((a, b) => {
        if (a.degree === b.degree) {
          return b.cardinality - a.cardinality;
        }
        return a.degree - b.degree;
      }),
    }
  }, [data, field]);
  console.log({sets, combinations})
  return (
    <>
      <div style={{ maxWidth: "20%", paddingTop: '1rem' }}>
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
          <option value="zygosity">Zygosity</option>
          <option value="topLevelPhenotypeName">Physiological System</option>
        </Form.Select>
      </div>
      <div style={{position: 'relative', display: 'flex', paddingTop: '1rem'}}>
        <UpSetJS
          sets={sets}
          combinations={combinations}
          width={1200}
          height={400}
          selection={selection}
          onHover={setSelection}
          onClick={setClickSelection}
          widthRatios={[0, 0.2]}
          fontSizes={{
            barLabel: '10px'
          }}
        />
      </div>
      <div className="selection">
        {clickSelection ? (
            <>
              {clickSelection.name.split('∩').length === 1 ? (
                <>
                  The {getLabel(field)}&nbsp;
                </>
              ) : (
                <>
                  The following intersection of {getLabel(field, true)}:&nbsp;
                </>
              )}
              <strong>{clickSelection.name}</strong> <br/>
              {clickSelection.name.split('∩').length === 1 ? (
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
            </>) :
          <span>Please click in any segment that has a value &gt;0</span>
        }
      </div>
    </>
  );

};

export default AllelePhenotypeDiagram;