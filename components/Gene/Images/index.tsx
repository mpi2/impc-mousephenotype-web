import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import _ from "lodash";
import Link from "next/link";
import { useRouter } from "next/router";
import { Alert, Col, Row } from "react-bootstrap";
import Card from "../../Card";
import styles from "./styles.module.scss";
import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "@/api-service";
import { GeneImage } from "@/models/gene";
import { sectionWithErrorBoundary } from "@/hoc/sectionWithErrorBoundary";
import { SectionHeader } from "@/components";

interface ImageProps {
  parameterName: string;
  procedureName: string;
  parameterStableId: string;
  image: string;
  length: number;
  fileType: string;
  isSpecialFormat: boolean;
}

const embryo3DParametersIds = [
  "IMPC_EMA_001_001",
  "IMPC_EMO_001_001",
  "IMPC_EML_001_001",
  "IMPC_EOL_001_001",
  "ALTIMPC_EML_001_001",
  "ALTIMPC_EMA_001_001",
  "ALTIMPC_EMO_001_001",
  "ALTIMPC_EOL_001_001",
];

const Image = ({
  parameterName,
  procedureName,
  parameterStableId,
  image,
  length,
  fileType,
  isSpecialFormat,
}: ImageProps) => {

  const router = useRouter();
  const { pid } = router.query;
  const urlSegment = isSpecialFormat ? "download-images" : "images";
  let url = `/genes/${pid}/${urlSegment}/${parameterStableId}`;
  if (embryo3DParametersIds.includes(parameterStableId)) {
    url = `https://www.mousephenotype.org/embryoviewer/?mgi=${pid}`;
  }

  return (
    <Link href={url}>
      <div className={styles.card}>
        <div
          className={styles.cardImage}
          style={{ backgroundImage: `url(${isSpecialFormat ? null : image})` }}
          data-testid="image"
        >
          <div className={styles.cardImageOverlay}>
            {embryo3DParametersIds.includes(parameterStableId) ? (
              <span>View on Embryo Viewer</span>
            ) : isSpecialFormat ? (
              <span>Download files</span>
            ) : (
              <span>
                {length} images <FontAwesomeIcon icon={faChevronRight} />
              </span>
            )}
          </div>
        </div>
        <div className={styles.cardText}>
          <h4>{procedureName}</h4>
          <p>{parameterName}</p>
        </div>
      </div>
    </Link>
  );
};

const Images = ({ gene }: { gene: any }) => {
  const router = useRouter();
  const { isLoading, isError, data } = useQuery({
    queryKey: ["genes", router.query.pid, "images"],
    queryFn: () => fetchAPI(`/api/v1/genes/${router.query.pid}/images`),
    enabled: router.isReady,
    select: (data) => data as Array<GeneImage>,
  });

  if (isLoading) {
    return (
      <Card id="images">
        <SectionHeader
          containerId="#images"
          title="Associated images"
          href="https://dev.mousephenotype.org/help/programmatic-data-access/images/"
        />
        <p className="grey">Loading...</p>
      </Card>
    );
  }

  if (isError || !data) {
    return (
      <Card id="images">
        <SectionHeader
          containerId="#images"
          title="Associated images"
          href="https://dev.mousephenotype.org/help/programmatic-data-access/images/"
        />
        <Alert variant="primary">
          There are no images available for {gene.geneSymbol}.
        </Alert>
      </Card>
    );
  }

  const groups = Object.entries(
    _.groupBy(data, (item) => `${item.procedureName}-${item.parameterName}`)
  ).sort((a, b) => {
    const [param1] = a;
    const [param2] = b;
    return param1.localeCompare(param2);
  });

  return (
    <Card id="images">
      <SectionHeader
        containerId="#images"
        title="Associated images"
        href="https://dev.mousephenotype.org/help/programmatic-data-access/images/"
      />
      <div>
        <Row>
          {groups.map(([key, group]) => (
            <Col md={4} lg={3} key={key + group[0].procedureName}>
              <Image
                parameterName={group[0].parameterName}
                procedureName={group[0].procedureName}
                parameterStableId={group[0].parameterStableId}
                image={group[0].thumbnailUrl}
                length={group[0].count}
                fileType={group[0].fileType}
                isSpecialFormat={group[0].isSpecialFormat}
              />
            </Col>
          ))}
        </Row>
      </div>
    </Card>
  );
};

export default sectionWithErrorBoundary(Images, "Associated images", "images");
