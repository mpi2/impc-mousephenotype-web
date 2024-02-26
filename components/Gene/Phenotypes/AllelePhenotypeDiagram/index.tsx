import { GenePhenotypeHits } from "@/models/gene";
import { Alert, Button, Form } from "react-bootstrap";
import { useContext, useEffect, useMemo, useState } from "react";
import { GeneContext } from "@/contexts";
import { UpSetJS, extractCombinations, ISet } from '@upsetjs/react';
import Drawer from 'react-modern-drawer'
import styles from './styles.module.scss';
import 'react-modern-drawer/dist/index.css';
import { ISetCombinations } from "@upsetjs/model";

type Allele = {
  significantPhenotypes: Set<string>;
  zygosities: Set<string>;
  topLevelPhenotypes: Set<string>;
}

const getAlleleDataObject = (phenotypeData: Array<GenePhenotypeHits>, selectedZyg: Array<string>) => {
  const result: Record<string, Allele> = {};
  phenotypeData.forEach(phenotype => {
    if (selectedZyg.length === 0 || selectedZyg.includes(phenotype.zygosity)) {
      if (result[phenotype.alleleSymbol] === undefined) {
        result[phenotype.alleleSymbol] = {
          significantPhenotypes: new Set(),
          zygosities: new Set(),
          topLevelPhenotypes: new Set(),
        }
      }
      result[phenotype.alleleSymbol].significantPhenotypes.add(phenotype.phenotypeName);
      result[phenotype.alleleSymbol].topLevelPhenotypes.add(phenotype.topLevelPhenotypeName);
      result[phenotype.alleleSymbol].zygosities.add(phenotype.zygosity);
    }
  });
  return result;
};
const generateSets = (alleleData: Record<string, Allele>, field: keyof Allele, selectedAlleles: Array<string>) => {
  const allelesByValues: Record<string, { name: string, sets: Array<string> }> = {};
  Object.entries(alleleData).forEach(([allele, alleleData]) => {
    if (selectedAlleles.length === 0 || selectedAlleles.includes(allele)) {
      alleleData[field].forEach(value => {
        if (allelesByValues[value] === undefined) {
          allelesByValues[value] = { name: value, sets: [] };
        }
        allelesByValues[value].sets.push(allele);
      });
    }
  });
  return Object.values(allelesByValues);
};

const simplifySets = (combinations: ISetCombinations) => {
  const result = combinations.toSorted((c1, c2) => c2.degree - c1.degree);
  console.dir(result);
  return combinations.toSorted((c1, c2) => c1.degree - c2.degree);
}

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
  const [field, setField] = useState<keyof Allele>('significantPhenotypes');
  const [selection, setSelection] = useState(null);
  const [clickSelection, setClickSelection] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAlleles, setSelectedAlleles] = useState([]);
  const [availableZyg, setAvailableZyg] = useState([]);
  const [selectedZyg, setSelectedZyg] = useState([]);

  const toggleDrawer = () => {
    setIsOpen(prevState => !prevState);
  };
  const toggleAllele = (allele: string) => {
    if (selectedAlleles.includes(allele) && selectedAlleles.length > 1) {
      setSelectedAlleles(prevState => prevState.filter(a => a !== allele));
    } else {
      setSelectedAlleles(prevState => prevState.concat([allele]));
    }
  }
  const toggleZygosity = (zyg: string) => {
    if (selectedZyg.includes(zyg)) {
      setSelectedZyg(prevState => prevState.filter(z => z !== zyg));
    } else {
      setSelectedZyg(prevState => prevState.concat([zyg]));
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

  const allelesData: Record<string, Allele> = useMemo(() => {
    const data = getAlleleDataObject(phenotypeData, selectedZyg);
    setSelectedAlleles(Object.keys(data));
    return data;
  }, [phenotypeData, selectedZyg]);
  const dataByField = useMemo(() => {
    return generateSets(allelesData, field, selectedAlleles);
  }, [phenotypeData, field, selectedAlleles]);
  const { sets, combinations } =
    useMemo(() => {
      const results = extractCombinations(dataByField);
      return {
        sets: results.sets,
        combinations: simplifySets(results.combinations),
      }
    }, [dataByField]);

  useEffect(() => {
    const zygosities = generateSets(allelesData, 'zygosities', []).map(z => z.name);
    setAvailableZyg(zygosities);
    setSelectedZyg(zygosities);
  }, [phenotypeData]);

  useEffect(() => {
    if (field === 'zygosities') {
      setSelectedZyg(availableZyg);
    }
  }, [field]);

  return (
    <>
      <div className={styles.selectorsWrapper}>
        <div className={styles.selector}>
          <Form.Label style={{ marginBottom: 0 }} htmlFor="fieldSelector">View by</Form.Label>
          <Form.Select
            id="fieldSelector"
            value={field}
            style={{ width: 220 }}
            onChange={event => {
              setClickSelection(null);
              setSelection(null);
              setField(event.target.value as keyof Allele);
            }}
          >
            <option value="significantPhenotypes">Significant Phenotypes</option>
            <option value="zygosities">Zygosity</option>
            <option value="topLevelPhenotypes">Physiological System</option>
          </Form.Select>
        </div>
        <div className={styles.selector}>
          <Button variant="secondary" onClick={toggleDrawer}>
            <span className="white">Edit graph</span>
          </Button>
        </div>
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
                  The allele&nbsp;
                </>
              ) : (
                <>
                  The following intersection of alleles:&nbsp;
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
      <Drawer
        open={isOpen}
        onClose={toggleDrawer}
        direction="right"
        enableOverlay={false}
        size={350}
      >
        <div className={styles.drawerContent}>
          <Form.Group>
            <Form.Label>Visible alleles</Form.Label>
            {Object.keys(allelesData).sort().map(allele =>
              <Form.Check
                style={{ userSelect: 'none' }}
                checked={selectedAlleles.includes(allele)}
                type="checkbox"
                id={`checkbox-${allele}`}
                label={allele}
                onChange={() => toggleAllele(allele)}
              />
            )}
          </Form.Group>
          <Form.Group className="mt-3">
            <Form.Label>Zygosity</Form.Label>
            {availableZyg.map(zyg =>
              <Form.Check
                style={{ userSelect: 'none' }}
                checked={selectedZyg.includes(zyg)}
                type="checkbox"
                id={`checkbox-${zyg}`}
                label={zyg}
                onChange={() => toggleZygosity(zyg)}
                disabled={field === 'zygosities'}
              />
            )}
          </Form.Group>
        </div>
      </Drawer>
    </>
  );

};

export default AllelePhenotypeDiagram;