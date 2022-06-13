import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Table } from "react-bootstrap";
import Card from "../../Card";
import styles from "./styles.module.scss";

const Publications = () => {
  const router = useRouter();

  const [publicationData, setPublicationData] = useState(null);
  useEffect(() => {
    if (!router.isReady) return;

    (async () => {
      const pData = await fetch(`/api/genes/${router.query.pid}/publications`);
      setPublicationData(await pData.json());
    })();
  }, [router.isReady]);

  if (!publicationData) {
    return <p>Loading...</p>;
  }

  return (
    <Card id="publications">
      <h2>Publications</h2>
      <Table striped bordered className={styles.table}>
        <thead>
          <tr>
            <th>Allele</th>
            <th>Journal</th>
            <th>Title</th>
            <th>Date</th>
            <th>DOI</th>
          </tr>
        </thead>
        <tbody>
          {publicationData.map((p) => (
            <tr>
              <td>
                {p.alleleSymbol.split("<")[0]}
                <sup>{p.alleleSymbol.split("<")[1].replace(">", "")}</sup>
              </td>
              <td>{p.journalTitle}</td>
              <td>{p.title}</td>
              <td>
                {p.monthOfPublication}/{p.yearOfPublication}
              </td>
              <td>{p.doi}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Card>
  );
};

export default Publications;
