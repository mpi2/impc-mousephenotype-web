import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "@/api-service";
import Search from "@/components/Search";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong, faDownload } from "@fortawesome/free-solid-svg-icons";
import { Button, Container } from "react-bootstrap";
import { Card } from "@/components";
import Skeleton from "react-loading-skeleton";
import {
  SmartTable,
  AlleleCell,
  SexCell,
  PlainTextCell,
} from "@/components/SmartTable";
import { TableCellProps } from "@/models";
import _ from "lodash";
import { useMemo } from "react";
import Head from "next/head";

type Image = {
  alleleSymbol: string;
  sex: string;
  zygosity: string;
  procedureName: string;
  parameterName: string;
  downloadUrl: string;
  sampleGroup: string;
  ageInWeeks: number;
};

const DownloadButtonCell = <T extends Image>(props: TableCellProps<T>) => {
  return (
    <Button href={_.get(props.value, props.field) as string}>
      <FontAwesomeIcon className="white" icon={faDownload} />
      &nbsp;
      <span className="white">Download</span>
    </Button>
  );
};

const DownloadImagesPage = () => {
  const router = useRouter();
  const { parameterStableId = "", pid } = router.query;
  const { data: mutantImages } = useQuery({
    queryKey: ["genes", pid, "images", parameterStableId],
    queryFn: () =>
      fetchAPI(
        `/api/v1/images/find_by_mgi_and_stable_id?mgiGeneAccessionId=${pid}&parameterStableId=${parameterStableId}`
      ),
    enabled: router.isReady,
    select: (data) => {
      const selectedDataset = data.find((d) =>
        d.pipelineStableId.includes("IMPC")
      );
      const dataset = !!selectedDataset ? selectedDataset : data[0];
      return {
        ...dataset,
        images: dataset.images.map((i) => ({
          ...i,
          procedureName: dataset.procedureName,
          parameterName: dataset.parameterName,
          sampleGroup: dataset.biologicalSampleGroup,
        })),
      };
    },
  });

  const { data: controlImages } = useQuery({
    queryKey: ["control", pid, "images", parameterStableId],
    queryFn: () =>
      fetchAPI(
        `/api/v1/images/find_by_stable_id_and_sample_id?biologicalSampleGroup=control&parameterStableId=${parameterStableId}`
      ),
    enabled: router.isReady,
    select: (data) => {
      const selectedDataset = data.find((d) =>
        d.pipelineStableId.includes("IMPC")
      );
      const dataset = !!selectedDataset ? selectedDataset : data[0];
      return {
        ...dataset,
        images: dataset.images.map((i) => ({
          ...i,
          procedureName: dataset.procedureName,
          parameterName: dataset.parameterName,
          sampleGroup: dataset.biologicalSampleGroup,
        })),
      };
    },
  });

  return (
    <>
      <Head>
        <title>{mutantImages?.geneSymbol} Image Comparator | International Mouse Phenotyping Consortium</title>
      </Head>
      <Search />
      <Container className="page">
        <Card>
          <Link href={`/genes/${pid}#images`} className="grey mb-3 small">
            <FontAwesomeIcon icon={faArrowLeftLong} />
            &nbsp; BACK TO GENE
          </Link>
          <h1 className="mb-4 mt-2" style={{ display: "flex", gap: "1rem" }}>
            <strong>
              {mutantImages?.procedureName || (
                <Skeleton style={{ width: "50px" }} inline />
              )}
            </strong>{" "}
            /&nbsp;
            {mutantImages?.parameterName || (
              <Skeleton style={{ width: "50px" }} inline />
            )}
          </h1>
          <h2>Mutant Files</h2>
          {!!mutantImages?.images && (
            <SmartTable<Image>
              data={mutantImages?.images}
              defaultSort={["alleleSymbol", "asc"]}
              columns={[
                {
                  width: 1,
                  label: "Allele Symbol",
                  field: "alleleSymbol",
                  cmp: <AlleleCell />,
                },
                {
                  width: 1,
                  label: "Age",
                  field: "ageInWeeks",
                  cmp: <PlainTextCell />,
                },
                { width: 1, label: "Sex", field: "sex", cmp: <SexCell /> },
                {
                  width: 1,
                  label: "Zygosity",
                  field: "zygosity",
                  cmp: <PlainTextCell />,
                },
                {
                  width: 1,
                  label: "Sample group",
                  field: "sampleGroup",
                  cmp: <PlainTextCell />,
                },
                {
                  width: 1,
                  label: "Procedure",
                  field: "procedureName",
                  cmp: <PlainTextCell />,
                },
                {
                  width: 1,
                  label: "Parameter",
                  field: "parameterName",
                  cmp: <PlainTextCell />,
                },
                {
                  width: 1,
                  label: "",
                  field: "downloadUrl",
                  cmp: <DownloadButtonCell />,
                  disabled: true,
                },
              ]}
            />
          )}
          <h2 className="mt-2">Control Files</h2>

          {!!controlImages?.images && (
            <SmartTable<Image>
              data={controlImages?.images}
              defaultSort={["alleleSymbol", "asc"]}
              columns={[
                {
                  width: 1,
                  label: "Zygosity",
                  field: "zygosity",
                  cmp: <PlainTextCell />,
                },
                {
                  width: 1,
                  label: "Age",
                  field: "ageInWeeks",
                  cmp: <PlainTextCell />,
                },
                { width: 1, label: "Sex", field: "sex", cmp: <SexCell /> },
                {
                  width: 1,
                  label: "Procedure",
                  field: "procedureName",
                  cmp: <PlainTextCell />,
                },
                {
                  width: 1,
                  label: "Parameter",
                  field: "parameterName",
                  cmp: <PlainTextCell />,
                },
                {
                  width: 1,
                  label: "",
                  field: "downloadUrl",
                  cmp: <DownloadButtonCell />,
                  disabled: true,
                },
              ]}
            />
          )}
        </Card>
      </Container>
    </>
  );
};

export default DownloadImagesPage;
