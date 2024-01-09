import { useContext, useState } from "react";
import { Alert } from "react-bootstrap";
import { useGeneAssociationsQuery } from "@/hooks";
import { PhenotypeContext } from "@/contexts";
import { useRouter } from "next/router";
import {
  AlleleCell,
  PlainTextCell,
  SignificantPValueCell,
  SignificantSexesCell, SmartTable
} from "@/components/SmartTable";
import { PhenotypeGenotypes } from "@/models/phenotype";
import { TableCellProps } from "@/models";

const ParameterCell = <T extends PhenotypeGenotypes>(props: TableCellProps<T>) => {
  return (
    <>
      {props.value?.parameterName}
      <br/>
      <span className="small">{props.value?.procedureName}</span>
    </>
  )
};

const PhenotypingCentreCell = <T extends PhenotypeGenotypes>(props: TableCellProps<T>) => {
  return (
    <>
      {props.value?.phenotypingCentre}
      <br/>
      <span className="small">{props.value?.projectName}</span>
    </>
  )
};


type Props = {};

const Associations = (props: Props) => {
  const phenotype = useContext(PhenotypeContext);

  const router = useRouter();
  const [query, setQuery] = useState(undefined);
  const [sortOptions, setSortOptions] = useState<string>('');
  const { data, isLoading } = useGeneAssociationsQuery(phenotype.phenotypeId, router.isReady, sortOptions);

  const filtered = data.filter(({phenotypeName, phenotypeId, alleleSymbol, mgiGeneAccessionId}) =>
      (!query || `${mgiGeneAccessionId} ${alleleSymbol} ${phenotypeName} ${phenotypeId}`.toLowerCase().includes(query))
  );

  if (!data) {
    return (
      <Alert style={{ marginTop: "1em" }} variant="primary">
        All data not available
      </Alert>
    );
  }

  return (
    <>
      <h2>IMPC Gene variants with {phenotype.phenotypeName}</h2>
      <p>
        Total number of significant genotype-phenotype associations:&nbsp;
        {data.length}
      </p>
      <SmartTable<PhenotypeGenotypes>
        data={filtered}
        defaultSort={["alleleSymbol", "asc"]}
        columns={[
          { width: 2, label: "Gene / allele", field: "alleleSymbol", cmp: <AlleleCell style={{ fontWeight: 'bold' }} /> },
          { width: 1.3, label: "Phenotype", field: "phenotypeName", cmp: <PlainTextCell />  },
          { width: 1, label: "Zygosity", field: "zygosity", cmp: <PlainTextCell /> },
          { width: 0.7, label: "Sex", field: "sex", cmp: <SignificantSexesCell /> },
          { width: 1, label: "Life stage", field: "lifeStageName", cmp: <PlainTextCell /> },
          { width: 1.5, label: "Parameter", field: "parameterName", cmp: <ParameterCell /> },
          {
            width: 1.5,
            label: "Phenotyping Center",
            field: "phenotypingCentre",
            cmp: <PhenotypingCentreCell />
          },
          { width: 2, label: "Most significant P-value", field: "pValue", cmp: <SignificantPValueCell /> },
        ]}
      />
    </>
  );
};

export default Associations;