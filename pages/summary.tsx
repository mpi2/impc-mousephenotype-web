import Link from "next/link";
import Search from "../components/Search";
import { Button, Container } from "react-bootstrap";
import Card from "../components/Card";
import {
  faCog,
  faLock,
  faSignOut,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import SortableTable from "../components/SortableTable";
import _ from "lodash";

const subscriptions = [
  {
    symbol: "Mavs",
    accessionId: "MGI:1929293",
    assignment: "Selected for production",
    nullAlleleProductionStatus: "Genotype confirmed mice",
    conditionalAlleleProductionStatus: "Genotype confirmed mice",
    criprAlleleProductionStatus: "None",
    phenotypingData: "Available",
  },
  {
    symbol: "Cib2",
    accessionId: "MGI:2444773",
    assignment: "Selected for production",
    nullAlleleProductionStatus: "None",
    conditionalAlleleProductionStatus: "None",
    criprAlleleProductionStatus: "None",
    phenotypingData: "Available",
  },
];

const AccountSummary = () => {
  const EMAIL_PREFS = {
    HTML: "html",
    TEXT: "text",
  };
  const [emailPref, setEmailPref] = useState(EMAIL_PREFS.HTML);
  const [sorted, setSorted] = useState<any[]>(null);

  useEffect(() => {
    setSorted(_.orderBy(subscriptions, "symbol", "asc"));
  }, [subscriptions]);

  return (
    <>
      <Search />
      <Container style={{ maxWidth: 1240 }} className="page">
        <Card>
          <p
            className="small caps primary mb-2"
            style={{ letterSpacing: "0.1rem" }}
          >
            MY GENES
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h1 className="h1 mb-0">
              Logged in as <strong>johnnyluuu@gmail.com</strong>
            </h1>
            <Button
              as="a"
              href="#accountSettings"
              variant="light"
              className="grey-x me-3"
              style={{ marginLeft: -12 }}
            >
              <FontAwesomeIcon icon={faCog} />
              &nbsp;&nbsp;Manage account
            </Button>
          </div>
        </Card>
        <Card>
          <h2 className="h2">Genes you have followed</h2>
          <p>
            <span className="grey">Email format preference: </span>
            <label style={{ marginRight: "1em", marginLeft: "1em" }}>
              <input
                type="radio"
                onChange={() => {
                  setEmailPref(EMAIL_PREFS.HTML);
                }}
                checked={emailPref === EMAIL_PREFS.HTML}
              />{" "}
              HTML text
            </label>
            <label>
              <input
                type="radio"
                onChange={() => {
                  setEmailPref(EMAIL_PREFS.TEXT);
                }}
                checked={emailPref === EMAIL_PREFS.TEXT}
              />{" "}
              Plain text
            </label>
          </p>
          <Pagination data={sorted}>
            {(pageData) => (
              <SortableTable
                doSort={(sort) => {
                  setSorted(_.orderBy(subscriptions, sort[0], sort[1]));
                }}
                defaultSort={["symbol", "asc"]}
                headers={[
                  {
                    width: 2,
                    label: "Gene",
                    disabled: true,
                    children: [
                      { width: 1, label: "Symbol", field: "symbol" },
                      { width: 1, label: "Accession ID", field: "accessionId" },
                      { width: 1, label: "Assignment", field: "assignment" },
                    ],
                  },
                  {
                    width: 2,
                    label: "ES cell",
                    disabled: true,
                    children: [
                      {
                        width: 1,
                        label: "Null allele",
                        field: "nullAlleleProductionStatus",
                      },
                      {
                        width: 1,
                        label: "Conditional allele",
                        field: "conditionalAlleleProductionStatus",
                      },
                    ],
                  },
                  {
                    width: 1,
                    label: "Crispr Allele",
                    field: "criprAlleleProductionStatus",
                  },
                  {
                    width: 1,
                    label: "Phenotyping data",
                    field: "phenotypingData",
                  },
                  { width: 1, label: "Action", disabled: true },
                ]}
              >
                {pageData.map((d, i) => {
                  return (
                    <tr>
                      <td>{d.symbol}</td>
                      <td>{d.accessionId}</td>
                      <td>{d.assignment}</td>
                      <td>{d.nullAlleleProductionStatus}</td>
                      <td>{d.conditionalAlleleProductionStatus}</td>
                      <td>{d.criprAlleleProductionStatus}</td>
                      <td>{d.phenotypingData}</td>
                    </tr>
                  );
                })}
              </SortableTable>
            )}
          </Pagination>
        </Card>
        <Card id="accountSettings">
          <p>
            <Button
              variant="light"
              className="grey-x me-3"
              style={{ marginLeft: -12 }}
              onClick={() => {}}
            >
              <FontAwesomeIcon icon={faSignOut} />
              &nbsp;&nbsp;Log out
            </Button>
            <Link href="/reset-password">
              <Button
                variant="light"
                className="grey-x me-3"
                style={{ marginLeft: -12 }}
              >
                <FontAwesomeIcon icon={faLock} />
                &nbsp;&nbsp;Reset password
              </Button>
            </Link>
            <Link href="/delete-account">
              <Button
                variant="light"
                className="grey-x me-3"
                style={{ marginLeft: -12 }}
              >
                <FontAwesomeIcon icon={faTrash} />
                &nbsp;&nbsp;Delete account
              </Button>
            </Link>
          </p>
        </Card>
      </Container>
    </>
  );
};

export default AccountSummary;
