import Search from "../components/Search";
import Card from "../components/Card";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button, Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import styles from "./register.module.scss";

const ResetPassword = () => {
  const router = useRouter();

  const handleRegister = () => {
    router.push("/summary");
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
            / RESET PASSWORD
          </p>
          <h1 className="h1 mb-3">
            Reset password for <strong>johnnyluuu@gmail.com</strong>
          </h1>
          <p className="grey mb-5">
            Click button below and we will send you an email with instructions
            to reset your password.
          </p>
          <div style={{ maxWidth: 400 }}>
            <Button
              variant="secondary"
              onClick={handleRegister}
              className={`${styles.loginBtn} mt-4`}
              type="submit"
              size="lg"
            >
              Reset password
              <FontAwesomeIcon icon={faArrowRight} />
            </Button>
          </div>
        </Card>
      </Container>
    </>
  );
};

export default ResetPassword;
