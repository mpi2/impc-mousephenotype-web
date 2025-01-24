import { Card } from "@/components";
import { useContext } from "react";
import { GeneContext } from "@/contexts";
import { Alert, Col, Container, Row } from "react-bootstrap";
import { useGeneExternalLinksQuery } from "@/hooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { sectionWithErrorBoundary } from "@/hoc/sectionWithErrorBoundary";

const ExternalLinks = () => {
  const gene = useContext(GeneContext);

  const {
    data: providers,
    error,
    isError,
  } = useGeneExternalLinksQuery(
    gene.mgiGeneAccessionId,
    !!gene.mgiGeneAccessionId,
  );

  if (error || providers?.length === 0) {
    return (
      <Card id="external-links">
        <h2>External links</h2>
        <Alert variant="primary">
          No external links available for <i>{gene.geneSymbol}</i>.
        </Alert>
      </Card>
    );
  }

  return (
    <Card id="external-links">
      <h2>External links</h2>
      <Container>
        <Row>
          {providers?.map((provider, index) => (
            <Col
              key={index}
              className="mb-3"
              xs={12}
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-evenly",
              }}
            >
              <div>
                <b>{provider.providerName}</b>&nbsp;-&nbsp;
                {provider.links.map((link) => (
                  <a
                    key={link.href}
                    className="primary link"
                    href={link.href}
                    target="_blank"
                    title={`visit ${provider.providerName} website for more details of ${link.label}`}
                  >
                    <i>{link.label}</i>
                    <FontAwesomeIcon
                      icon={faExternalLinkAlt}
                      className="grey"
                      size="xs"
                      style={{ marginLeft: "0.3rem" }}
                    />
                  </a>
                ))}
              </div>
              <ul
                style={{ marginBottom: 0, display: "flex", columnGap: "1.3em" }}
              >
                {provider.links.map((link) => link.description)}
              </ul>
            </Col>
          ))}
        </Row>
      </Container>
    </Card>
  );
};

export default sectionWithErrorBoundary(
  ExternalLinks,
  "External links",
  "external-links",
);
