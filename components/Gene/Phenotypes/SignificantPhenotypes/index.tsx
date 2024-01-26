import { useContext, useState } from "react";
import { Alert } from "react-bootstrap";
import { useSignificantPhenotypesQuery } from "@/hooks/significant-phenotypes.query";
import { GeneContext } from "@/contexts";
import { useRouter } from "next/router";
import {
  PlainTextCell,
  SmartTable,
  PhenotypeIconsCell,
  AlleleCell, SignificantSexesCell, SignificantPValueCell
} from "@/components/SmartTable";
import { GenePhenotypeHits } from "@/models/gene";

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

  const filterPhenotype = ({phenotypeName, phenotypeId}: GenePhenotypeHits, query: string) =>
    (!query || `${phenotypeName} ${phenotypeId}`.toLowerCase().includes(query));

  return (
    <SmartTable<GenePhenotypeHits>
      data={phenotypeData}
      defaultSort={["phenotypeName", "asc"]}
      filterFn={filterPhenotype}
      columns={[
        { width: 2.2, label: "Phenotype", field: "phenotypeName", cmp: <PlainTextCell style={{ fontWeight: 'bold' }} /> },
        { width: 1, label: "System", field: "topLevelPhenotypeName", cmp: <PhenotypeIconsCell allPhenotypesField="topLevelPhenotypes" /> },
        { width: 1, label: "Allele", field: "alleleSymbol", cmp: <AlleleCell /> },
        { width: 1, label: "Zyg", field: "zygosity", cmp: <PlainTextCell style={{ textTransform: "capitalize" }} /> },
        { width: 1, label: "Life stage", field: "lifeStageName", cmp: <PlainTextCell /> },
        { width: 1, label: "Significant sexes", field: "sex", cmp: <SignificantSexesCell /> },
        { width: 2, label: "Most significant P-value", field: "pValue", cmp: <SignificantPValueCell /> },
      ]}
    />
  );
};

export default SignificantPhenotypes;
