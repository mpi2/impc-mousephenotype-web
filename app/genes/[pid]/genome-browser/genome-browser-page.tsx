"use client";
import { GenomeBrowser, Search } from "@/components";
import { Container } from "react-bootstrap";
import { ChartNav } from "@/components/Data";
import Card from "@/components/Card";
import { GeneSummary } from "@/models/gene";

type GenomeBrowserPageProps = {
  mgiGeneAccessionId: string;
  geneSummary: GeneSummary;
};

const GenomeBrowserPage = ({
  mgiGeneAccessionId,
  geneSummary,
}: GenomeBrowserPageProps) => {
  return (
    <>
      <Search />
      <Container className="page">
        <Card>
          <ChartNav
            className="mb-3"
            mgiGeneAccessionId={mgiGeneAccessionId}
            geneSymbol={geneSummary.geneSymbol}
            isFetching={false}
          />
          <GenomeBrowser
            geneSymbol={geneSummary.geneSymbol}
            mgiGeneAccessionId={mgiGeneAccessionId}
            noContainer={true}
          />
        </Card>
      </Container>
    </>
  );
};

export default GenomeBrowserPage;
