import { Image } from "@/models/gene";
import { Card, Container, Row } from "react-bootstrap";


type Props = {
  images: Array<Image>;
}

const FlowCytometryImages = (props: Props) => {
  const { images } = props;
  return (
    <Card>
      <h2>Flow cytometry results:</h2>
      <Container>
        <Row>
          {images.map((image, i) => (
            <Card key={i} style={{ maxWidth: '50%' }}>
              <Card.Img variant="top" src={image.jpegUrl} />
            </Card>
          ))}
        </Row>
      </Container>
    </Card>
  )
};

export default FlowCytometryImages;