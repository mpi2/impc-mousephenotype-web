import Search from "../components/Search";
import Card from "../components/Card";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button, Container, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./register.module.scss";
import { useState } from "react";

const DeleteAccount = () => {
  const router = useRouter();
  const [validated, setValidated] = useState(false);

  const handleDeletion = () => {
    router.push("/login");
  };

  return (
    <>
      <Search />
      <Container style={{ maxWidth: 1240 }} className="page">
        <Card>
          <p className="small caps mb-2" style={{ letterSpacing: "0.1rem" }}>
            <Link href="/summary">
              <span className="primary">MY GENES</span>
            </Link>{" "}
            / DELETE ACCOUNT
          </p>
          <h1 className="h1 mb-3">
            Delete account <strong>johnnyluuu@gmail.com</strong>
          </h1>
          <p className="grey mb-4">
            <FontAwesomeIcon icon={faExclamationTriangle} className="red" />{" "}
            This action cannot be undone. This action will remove your My Genes
            account and all your followed genes.
          </p>
          <div style={{ maxWidth: 400 }}>
            <Form.Label>Type your email address to confirm</Form.Label>
            <Form.Control
              type="email"
              placeholder="Type 'johnnyluuu@gmail.com'"
              onChange={(e) => {
                if (e.target.value === "johnnyluuu@gmail.com") {
                  setValidated(true);
                } else {
                  setValidated(false);
                }
              }}
            />
            <Button
              variant="danger"
              onClick={handleDeletion}
              className={`${styles.loginBtn}`}
              style={{ marginTop: "2rem !important" }}
              type="submit"
              size="lg"
              disabled={!validated}
            >
              Delete account
              <FontAwesomeIcon icon={faArrowRight} />
            </Button>
          </div>
        </Card>
      </Container>
    </>
  );
};

export default DeleteAccount;
