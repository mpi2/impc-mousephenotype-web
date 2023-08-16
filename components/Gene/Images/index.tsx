import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import _ from "lodash";
import Link from "next/link";
import { useRouter } from "next/router";
import { Alert, Col, Row } from "react-bootstrap";
import Card from "../../Card";
import styles from "./styles.module.scss";
import {useQuery} from "@tanstack/react-query";
import {fetchAPI} from "../../../api-service";

interface Props {
  parameterName: string;
  procedureName: string;
  image: string;
  length: number;
}

const Image = ({ parameterName, procedureName, image, length }: Props) => {
  const router = useRouter();
  const { pid } = router.query;

  return (
    <Link href={`/genes/${pid}/images/${parameterName}`} legacyBehavior>
      <div className={styles.card}>
        <div
          className={styles.cardImage}
          style={{ backgroundImage: `url(${image})` }}
        >
          <div className={styles.cardImageOverlay}>
            <span>
              {length} images <FontAwesomeIcon icon={faChevronRight} />
            </span>
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

const Images = () => {
  const router = useRouter();
  const { isLoading, isError, data } = useQuery({
    queryKey: ['genes', router.query.pid, 'images'],
    queryFn: () => fetchAPI(`/api/v1/genes/${router.query.pid}/images`),
  });

  if (isLoading) {
    return (
      <Card id="images">
        <h2>Associated Images</h2>
        <p className="grey">Loading...</p>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card id="images">
        <h2>Associated Images</h2>
        <Alert variant="yellow">No data available for this section.</Alert>
      </Card>
    );
  }

  const groups = Object.entries(_.groupBy(data, "parameterName"));
  return (
    <Card id="images">
      <h2>Associated Images</h2>
      {data ? (
        <div>
          <Row>
            {groups.map(([key, group]) => (
              <Col md={4} lg={3} key={key + group[0].precedureName}>
                <Image
                  parameterName={key}
                  procedureName={group[0].procedureName}
                  image={group[0].thumbnailUrl}
                  length={group.length}
                />
              </Col>
            ))}
          </Row>
        </div>
      ) : (
        <Alert variant="primary">Images not available</Alert>
      )}
    </Card>
  );
};

export default Images;
