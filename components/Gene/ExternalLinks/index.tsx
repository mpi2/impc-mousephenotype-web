import { Card } from "@/components";
import { useRouter } from "next/router";
import { useContext } from "react";
import { GeneContext } from "@/contexts";
import { Col, Container, Row } from "react-bootstrap";
import { useGeneExternalLinksQuery } from "@/hooks";


const ExternalLinks = () => {
  const router = useRouter();
  const gene = useContext(GeneContext);

  const { data } = useGeneExternalLinksQuery(gene.mgiGeneAccessionId, router.isReady);

  console.log(data);

  return (
    <Card>
      <h2>External links</h2>
      <Container>
        <Row>
          <Col></Col>
          <Col></Col>
        </Row>
      </Container>
    </Card>
  )
}

export default ExternalLinks;