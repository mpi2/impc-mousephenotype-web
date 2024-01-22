import { Search } from "@/components";
import styles from "../styles.module.scss";
import { Badge, Card, Col, Container, Modal, Row } from "react-bootstrap";
import { useRouter } from "next/router";
import { useGeneSummaryQuery, useHistopathologyQuery } from "@/hooks";
import { PlainTextCell, SmartTable } from "@/components/SmartTable";
import { Histopathology, TableCellProps } from "@/models";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const DescriptionCell = <T extends Histopathology>(props: TableCellProps<T> & {maxChars?: number, onClick: (data: T) => void}) => {
  const maxChars = props.maxChars || 50;
  const truncated = props.value?.description.length > maxChars;
  const description = truncated ? props.value?.description.substring(0, maxChars) + '...' : props.value?.description;
  return (
    <span
      onClick={props.onClick.bind(this, props?.value)}
      style={ truncated ? { cursor: 'pointer', color: '#138181', textDecoration: 'underline' } : {}}
    >
      {description}
    </span>
  )
}


const HistopathChartPage = () => {
  const router = useRouter();
  const mgiGeneAccessionId = router.query.pid as string;
  const [selectedAnatomy, setSelectedAnatomy] = useState<string>(null);
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [showFullImageModal, setShowFullImageModal] = useState(false);
  const [selectedTissue, setSelectedTissue] = useState<Histopathology>(null);
  const [selectedImage, setSelectedImage] = useState<string>(null);
  const { data: gene} = useGeneSummaryQuery(mgiGeneAccessionId, router.isReady);
  const { data } = useHistopathologyQuery(mgiGeneAccessionId, router.isReady && !!gene);
  const anatomyParam = router.query?.anatomy as string;

  useEffect(() => {
    setSelectedAnatomy(anatomyParam as string)
  }, [anatomyParam]);

  const displayDescriptionModal = (item: Histopathology) => {
    setSelectedTissue(item);
    setShowDescriptionModal(true);
  };

  const hideDescriptionModal = () => {
    setShowDescriptionModal(false);
  };

  const displayFullImageModal = (url: string) => {
    setSelectedImage(url);
    setShowFullImageModal(true);
  }
  const hideFullImageModal = () => {
    setShowFullImageModal(false);
  }

  const filteredData = !!selectedAnatomy
    ? data?.histopathologyData?.filter(item => item.tissue.toLowerCase() === anatomyParam)
    : data?.histopathologyData;

  return (
    <>
      <Search />
      <Container className="page">
        <Card>
          <div className={styles.subheading}>
            <span className={`${styles.subheadingSection} primary`}>
              <button
                style={{
                  border: 0,
                  background: "none",
                  padding: 0,
                }}
                onClick={() => {
                  router.back();
                }}
              >
                <a href="#" className="grey mb-3">
                  {gene?.geneSymbol}
                </a>
              </button>{" "}
              / Histopathology
            </span>
          </div>
          <h1 className="mb-4 mt-2">
            <strong className="text-capitalize">
              Histopathology data for {gene?.geneSymbol}
            </strong>
          </h1>
          <Card style={{ padding: '0' }}>
            <Card.Header>Score Definitions</Card.Header>
            <Card.Body>
              <b>Severity Score:</b>
              <ul>
                <li>0 = Normal</li>
                <li>
                  1 = Mild (observation barely perceptible and not believed to have clinical significance)
                </li>
                <li>
                  2 = Moderate (observation visible but involves minor proportion of tissue and clinical
                  consequences of observation are most likely subclinical)
                </li>
                <li>
                  3 = Marked (observation clearly visible involves a significant proportion of tissue and
                  is likely to have some clinical manifestations generally expected to be minor)
                </li>
                <li>
                  4 = Severe (observation clearly visible involves a major proportion of tissue and clinical
                  manifestations are likely associated with significant tissue dysfunction or damage)
                </li>
              </ul>
              <b>Significance Score:</b>
              <ul>
                <li>
                  0 = <i>Not significant</i>: Interpreted by the histopathologist to be a
                  finding attributable to background strain (e.g. low-incidence hydrocephalus, microphthalmia) or
                  incidental to mutant phenotype (e.g. hair-induced glossitis,
                  focal hyperplasia, mild mononuclear cell infiltrate).
                </li>
                <li>
                  1 = <i>Significant</i>: Interpreted by the histopathologist as a finding
                  not attributable to background strain and not incidental to mutant phenotype.
                </li>
              </ul>
            </Card.Body>
          </Card>
          <SmartTable<Histopathology>
            data={filteredData}
            defaultSort={["phenotypeName", "asc"]}
            additionalTopControls={
              selectedAnatomy ? (
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => setSelectedAnatomy(null)}
                >
                  Showing only tissue data for:&nbsp;
                  <Badge pill bg="secondary" style={{ fontSize: '1.1rem', textTransform: "capitalize" }}>
                    {selectedAnatomy}
                    &nbsp;
                    <FontAwesomeIcon icon={faXmark} />
                  </Badge>
                </span>
              ) : null
            }
            columns={[
              { width: 1, label: "Zyg", field: "zygosity", cmp: <PlainTextCell style={{ textTransform: "capitalize" }} /> },
              { width: 1, label: "Mouse", field: "specimenNumber", cmp: <PlainTextCell /> },
              { width: 1, label: "Tissue", field: "tissue", cmp: <PlainTextCell /> },
              { width: 1, label: "Description", field: "description", cmp: <DescriptionCell onClick={displayDescriptionModal} /> },
              { width: 1, label: "MPATH Process Term", field: "mPathProcessTerm", cmp: <PlainTextCell /> },
              { width: 1, label: "Severity Score", field: "severityScore", cmp: <PlainTextCell /> },
              { width: 1, label: "Significance Score", field: "significanceScore", cmp: <PlainTextCell /> },
              { width: 1, label: "PATO Descriptor", field: "descriptorPATO", cmp: <PlainTextCell /> },
              { width: 1, label: "Free Text", field: "freeText", cmp: <PlainTextCell /> },
            ]}
          />
          <h2>Associated histopathology images</h2>
          <Row>
            {data?.images.map((image, index) => (
              <Col style={{ textAlign: 'center' }} key={index} xs={3}>
                <img
                  style={{ cursor: 'pointer' }}
                  src={image.thumbnailUrl} alt=""
                  onClick={() => displayFullImageModal(`//www.ebi.ac.uk/mi/media/omero/webgateway/render_image/${image.omeroId}`)}
                />
                <br/>
                Tissue: {image.tissue}
                <br/>
                MA term: {image.maTerm}
              </Col>
            ))}
          </Row>
          <Modal
            show={showDescriptionModal}
            onHide={hideDescriptionModal}
            onExited={() => setSelectedTissue(null)}
          >
            <Modal.Header closeButton>
              {selectedTissue?.tissue} description for mouse {selectedTissue?.specimenNumber}
            </Modal.Header>
            <Modal.Body>
              {selectedTissue?.description}
            </Modal.Body>
          </Modal>
          <Modal
            size="lg"
            centered
            show={showFullImageModal}
            onHide={hideFullImageModal}
            onExited={() => setSelectedImage(null)}
          >
            <Modal.Header closeButton />
            <Modal.Body>
              {selectedImage ? <img style={{ width: '100%' }} src={selectedImage} alt=""/> : null}
            </Modal.Body>
          </Modal>
        </Card>
      </Container>
    </>
  )
}

export default HistopathChartPage;