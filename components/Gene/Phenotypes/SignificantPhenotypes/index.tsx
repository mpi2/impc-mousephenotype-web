import { useContext, useState } from "react";
import { Alert, Form } from "react-bootstrap";
import { GeneContext } from "@/contexts";
import {
  PlainTextCell,
  SmartTable,
  PhenotypeIconsCell,
  AlleleCell, SignificantSexesCell, SignificantPValueCell
} from "@/components/SmartTable";
import { GenePhenotypeHits } from "@/models/gene";
import _ from 'lodash';

const SignificantPhenotypes = (
  {
    phenotypeData,
    isPhenotypeLoading,
    isPhenotypeError
  }: {
    phenotypeData: Array<GenePhenotypeHits>,
    isPhenotypeLoading: boolean,
    isPhenotypeError: boolean,
  }) => {
  const gene = useContext(GeneContext);
  const [query, setQuery] = useState(undefined);
  const [selectedAllele, setSelectedAllele] = useState(undefined);

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
  const filteredPhenotypeData = phenotypeData.filter(
    ({
       phenotypeName,
       phenotypeId,
       alleleSymbol
    }) =>
    (!selectedAllele || alleleSymbol === selectedAllele) &&
    (!query || `${phenotypeName} ${phenotypeId}`.toLowerCase().includes(query))
  );

  return (
    <SmartTable<GenePhenotypeHits>
      data={filteredPhenotypeData}
      defaultSort={["phenotypeName", "asc"]}
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
            >
            </Form.Control>
            <label
              htmlFor="procedureFilter"
              className="grey"
              style={{marginRight: "0.5rem"}}
            >
              Allele:
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
                setSelectedAllele(
                  el.target.value === "all" ? undefined : el.target.value
                );
              }}
            >
              <option value={"all"}>All</option>
              {alleles.map((p) => (
                <option value={p} key={`alelle_${p}`}>
                  {p}
                </option>
              ))}
            </Form.Select>
          </p>
        </div>
      }
      columns={[
        {width: 2.2, label: "Phenotype", field: "phenotypeName", cmp: <PlainTextCell style={{fontWeight: 'bold'}}/>},
        {
          width: 1,
          label: "System",
          field: "topLevelPhenotypeName",
          cmp: <PhenotypeIconsCell allPhenotypesField="topLevelPhenotypes"/>
        },
        {width: 1, label: "Allele", field: "alleleSymbol", cmp: <AlleleCell/>},
        {width: 1, label: "Zyg", field: "zygosity", cmp: <PlainTextCell style={{textTransform: "capitalize"}}/>},
        {width: 1, label: "Life stage", field: "lifeStageName", cmp: <PlainTextCell/>},
        {width: 1, label: "Significant sexes", field: "sex", cmp: <SignificantSexesCell/>},
        {width: 2, label: "Most significant P-value", field: "pValue", cmp: <SignificantPValueCell/>},
      ]}
    />
  );
};

export default SignificantPhenotypes;
