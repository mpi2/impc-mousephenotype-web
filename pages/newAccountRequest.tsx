import Search from "../components/Search";
import Card from "../components/Card";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button, Container, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import styles from "./register.module.scss";

const Register = () => {
  const router = useRouter();

  const handleRegister = () => {
    router.push("/summary");
  };

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
          <h1 className="h1">
            <strong>Create new account</strong>
          </h1>
          <div style={{ maxWidth: 400 }}>
            <p className="grey mb-4">
              Enter your email address below. We will send you an email with
              instructions to set up your login details.
            </p>

            <Form>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" required />
              </Form.Group>
              <Button
                variant="secondary"
                onClick={handleRegister}
                className={`${styles.loginBtn} mt-4`}
                type="submit"
                size="lg"
              >
                Create an account
                <FontAwesomeIcon icon={faArrowRight} />
              </Button>
            </Form>
            <p className="mt-5 grey">
              Already have an account?{" "}
              <Link href="/login" className="secondary">
                Log in
              </Link>
            </p>
          </div>
        </Card>
      </Container>
    </>
  );
};

export default Register;
