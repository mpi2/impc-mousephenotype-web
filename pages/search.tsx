import Link from "next/link";
import { Container, Row } from "react-bootstrap";
import Search from "../components/Search";

const SearchResults = () => {
  return (
    <>
      <Search />
      <Container style={{ maxWidth: 920 }}>
        <Row>
          <div
            className=""
            style={{
              background: "white",
              padding: 100,
              marginTop: -100,
              fontSize: 20,
              fontWeight: "bold",
            }}
          >
            <Link href="/gene/12345">Mavs &gt;</Link>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default SearchResults;
