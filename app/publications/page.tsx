import { Container, Tab, Tabs, Modal } from "react-bootstrap";
import styles from "./styles.module.scss";
import { useQuery } from "@tanstack/react-query";
import { fetchPublicationEndpoint } from "@/api-service";

import dynamic from "next/dynamic";
import { Card, PublicationListProps, Search } from "@/components";
import { Metadata } from "next";
import {
  PublicationsIncreaseChart,
  PublicationsByYearChart,
  GrantSection,
} from "./charts";
import { PublicationAggregationDataResponse } from "@/models";

const PublicationsList = dynamic<PublicationListProps>(
  () => import("@/components/PublicationsList"),
  { ssr: false }
);

export const metadata: Metadata = {
  title:
    "Publications with IMPC alleles | International Mouse Phenotyping Consortium",
};

const PublicationsPage = () => {
  const { data } = useQuery({
    queryKey: ["publications", "aggregation"],
    queryFn: () => fetchPublicationEndpoint(`/api/v1/publications/aggregation`),
    select: (aggregationData: PublicationAggregationDataResponse) => {
      const yearlyIncrementData = aggregationData.incrementalCountsByYear;
      const allGrantsData = aggregationData.publicationsByGrantAgency;
      const publicationsByGrantsChartData = allGrantsData.filter(
        (pubCount) => pubCount.count > 8
      );
      const publicationsByQuarter = aggregationData.publicationsByQuarter.map(
        (year) => {
          return {
            ...year,
            byQuarter: year.byQuarter.sort((q1, q2) => q1.quarter - q2.quarter),
          };
        }
      );

      return {
        yearlyIncrementData,
        publicationsByGrantsChartData,
        publicationsByQuarter,
        allGrantsData,
      };
    },
  });

  return (
    <>
      <Search />
      <Container className="page">
        <Card>
          <h1 className="mb-4 mt-2">
            <strong>IKMC/IMPC related publications</strong>
          </h1>
          <Tabs defaultActiveKey="all-publications">
            <Tab eventKey="all-publications" title="All publications">
              <div className="mt-5">
                <PublicationsList />
              </div>
            </Tab>
            <Tab eventKey="publications-stats" title="Publications stats">
              <Card>
                <div className="tab-content-container">
                  <h2>Yearly increase of IKMC/IMPC related publications</h2>
                  <div className={styles.chartContainer}>
                    <PublicationsIncreaseChart
                      data={data.yearlyIncrementData}
                    />
                  </div>
                </div>
              </Card>
              <Card>
                <div className="tab-content-container">
                  <h2>IKMC/IMPC related publications by year of publication</h2>
                  <div className={styles.chartContainer}>
                    <PublicationsByYearChart
                      data={data.publicationsByQuarter}
                      yearlyIncrementData={data.yearlyIncrementData}
                    />
                  </div>
                </div>
              </Card>
              <Card>
                <div className="tab-content-container">
                  <GrantSection data={data} />
                </div>
              </Card>
            </Tab>
            <Tab
              eventKey="consortium-publications"
              title="Consortium publications"
            >
              <div className="mt-5">
                <PublicationsList onlyConsortiumPublications />
              </div>
            </Tab>
          </Tabs>
        </Card>
      </Container>
    </>
  );
};

export default PublicationsPage;
