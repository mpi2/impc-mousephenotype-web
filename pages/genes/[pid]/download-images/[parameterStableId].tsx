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
import { SmartTable, AlleleCell, SexCell, PlainTextCell } from "@/components/SmartTable";
import { TableCellProps } from "@/models";
import _ from 'lodash';

type Image = {
  alleleSymbol: string;
  sex: string;
  zygosity: string;
  procedureName: string;
  parameterName: string;
  downloadUrl: string;
  sampleGroup: string;
}

const DownloadButtonCell = <T extends Image>(props: TableCellProps<T>) => {
  return (
    <Button href={_.get(props.value, props.field) as string}>
      <FontAwesomeIcon className="white" icon={faDownload} />&nbsp;
      <span className="white">Download</span>
    </Button>
  )
};

const DownloadImagesPage = () => {
  const router = useRouter();
  const { parameterStableId = "", pid } = router.query;
  const { data: images } = useQuery({
    queryKey: ['genes', pid, 'images', parameterStableId],
    queryFn: () => fetchAPI(`/api/v1/images/find_by_mgi_and_stable_id?mgiGeneAccessionId=${pid}&parameterStableId=${parameterStableId}`),
    enabled: router.isReady,
    select: data => {
      const selectedDataset = data.find(d => d.pipelineStableId.includes('IMPC'));
      const dataset = !!selectedDataset ? selectedDataset : data[0];
      return {
        ...dataset,
        images: dataset.images.map(i => ({ ...i, procedureName: dataset.procedureName, parameterName: dataset.parameterName, sampleGroup: dataset.biologicalSampleGroup }))
      }
    }
  });

  return (
    <>
      <Search />
      <Container className="page">
        <Card>
          <Link href={`/genes/${pid}#images`} className="grey mb-3 small">
            <FontAwesomeIcon icon={faArrowLeftLong} />&nbsp;
            BACK TO GENE
          </Link>
          <p className="subheading">Images</p>
          <h1 className="mb-4 mt-2" style={{ display: 'flex', gap: '1rem' }}>
            <strong>
              {images?.procedureName || <Skeleton style={{ width: '50px' }} inline />}
            </strong> /&nbsp;
            {images?.parameterName || <Skeleton style={{ width: '50px' }} inline />}
          </h1>
          {!!images?.images && (
            <SmartTable<Image>
              data={images?.images}
              defaultSort={['alleleSymbol', 'asc']}
              columns={[
                { width: 1, label: 'Allele Symbol', field: 'alleleSymbol', cmp: <AlleleCell />   },
                { width: 1, label: 'Sex', field: 'sex', cmp: <SexCell />   },
                { width: 1, label: 'Zygosity', field: 'zygosity', cmp: <PlainTextCell />   },
                { width: 1, label: 'Sample group', field: 'sampleGroup', cmp: <PlainTextCell />   },
                { width: 1, label: 'Procedure', field: 'procedureName', cmp: <PlainTextCell />   },
                { width: 1, label: 'Parameter', field: 'parameterName', cmp: <PlainTextCell />   },
                { width: 1, label: '', field: 'downloadUrl', cmp: <DownloadButtonCell />, disabled: true },
              ]}
            />
          )}
        </Card>
      </Container>
    </>
  );
}

export default DownloadImagesPage;