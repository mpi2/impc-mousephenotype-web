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
      const res = await fetch(`/api/genes/${router.query.pid}/publications`);
      if (res.ok) {
        setPublicationData(await res.json());
      }
    })();
  }, [router.isReady]);

  if (!publicationData) {
    return <p>Loading...</p>;
  }

  return (
    <Card id="publications">
      <h2>IMPC related publications</h2>
      <p>
        The table below lists publications which used either products generated
        by the IMPC or data produced by the phenotyping efforts of the IMPC.
        These publications have also been associated to the gene.
      </p>
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
