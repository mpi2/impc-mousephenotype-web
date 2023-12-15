import { useContext, useState } from "react";
import { Alert, Tab, Tabs } from "react-bootstrap";
import Card from "../../Card";
import { GeneExpression } from "@/models/gene";
import { PlainTextCell, SmartTable } from "@/components/SmartTable";
import { useGeneExpressionQuery } from "@/hooks";
import { GeneContext } from "@/contexts";
import { useRouter } from "next/router";
import { AnatomyCell, ExpressionCell, ImagesCell } from './custom-cells';

const Expressions = () => {
  const router = useRouter();
  const gene = useContext(GeneContext);
  const [tab, setTab] = useState("adultExpressions");
  const [sortOptions, setSortOptions] = useState<string>('');
  const { isLoading, isError, data, error } = useGeneExpressionQuery(
    gene.mgiGeneAccessionId,
    router.isReady,
    sortOptions,
  );

  const adultData = data.filter((x) => x.lacZLifestage === "adult");
  const embryoData = data.filter((x) => x.lacZLifestage === "embryo");

  const selectedData = tab === "adultExpressions" ? adultData : embryoData;

  if (isLoading) {
    return (
      <Card id="expressions">
        <h2>lacZ Expression</h2>
        <p className="grey">Loading...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card id="expressions">
        <h2>lacZ Expression</h2>
        <Alert variant="primary">
          No expression data available for {gene.geneSymbol}.
        </Alert>
      </Card>
    );
  }

  return (
    <Card id="expressions">
      <h2>lacZ Expression</h2>

      <Tabs defaultActiveKey="adultExpressions" onSelect={(e) => setTab(e)} className="mb-3">
        <Tab
          eventKey="adultExpressions"
          title={`Adult expressions (${adultData.length})`}
        ></Tab>
        <Tab
          eventKey="embryoExpressions"
          title={`Embryo expressions (${embryoData.length})`}
        ></Tab>
      </Tabs>
      {selectedData.length > 0 ? (
        <SmartTable<GeneExpression>
          data={selectedData}
          defaultSort={["parameterName", "asc"]}
          filteringEnabled={false}
          columns={[
            { width: 3, label: "Anatomy", field: "parameterName", cmp: <AnatomyCell /> },
            {
              width: 3,
              label: "Images",
              field: "expressionImageParameters",
              cmp: <ImagesCell mgiGeneAccessionId={gene.mgiGeneAccessionId}/>
            },
            { width: 2, label: "Zygosity", field: "zygosity", cmp: <PlainTextCell /> },
            {
              width: 1,
              label: "Mutant Expr",
              field: "expressionRate",
              cmp: <ExpressionCell expressionRateField="expressionRate" countsField="mutantCounts" />
            },
            {
              width: 3,
              label: "Background staining in controls (WT)",
              field: "expressionRate",
              cmp: <ExpressionCell expressionRateField="wtExpressionRate" countsField="controlCounts" />
            },
          ]}
        />
      ) : (
        <Alert variant="primary">
          No {tab === 'adultExpressions' ? 'adult' : 'embryo'} expression data available for {gene.geneSymbol}.
        </Alert>
      )}
    </Card>
  );
};

export default Expressions;
