import { Card } from "@/components";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import { GeneContext } from "@/contexts";
import { Col, Container, Row } from "react-bootstrap";
import { useGeneExternalLinksQuery } from "@/hooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";


const ExternalLinks = () => {
  const router = useRouter();
  const gene = useContext(GeneContext);

  const { data: providers } = useGeneExternalLinksQuery(gene.mgiGeneAccessionId, router.isReady);

  return (
    <Card>
      <h2>External links</h2>
      <Container>
        <Row>
          {providers.map(provider => (
            <Col className="mb-3" xs={6} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly' }}>
              <div>
                <b>{provider.providerName}</b>&nbsp;-&nbsp;
                <span style={{fontSize: '80%'}}>{provider.providerDescription}</span>
              </div>
              <ul style={{marginBottom: 0, display: 'flex', columnGap: '1.3em'}}>
                {provider.links.map(link => (
                  <a className="primary link" href={link.href}>
                    {link.label}
                    &nbsp;
                    <FontAwesomeIcon
                      icon={faExternalLinkAlt}
                      className="grey"
                      size="xs"
                    />
                  </a>
                ))}
              </ul>
            </Col>
          ))}
        </Row>
      </Container>
    </Card>
  )
}

export default ExternalLinks;