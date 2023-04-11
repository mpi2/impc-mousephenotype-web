import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "react-bootstrap";
import styles from "./styles.module.scss";
import Form from "react-bootstrap/Form";

const Login = ({ onLogin }) => {
  const handleLogin = (e) => {
    e.preventDefault();
    if (onLogin) {
      onLogin();
    }
  };

  return (
    <Form>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" required />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" required />
      </Form.Group>
      <Button
        variant="secondary"
        onClick={handleLogin}
        className={`${styles.loginBtn} mt-4`}
        type="submit"
        size="lg"
      >
        Log in
        <FontAwesomeIcon icon={faArrowRight} />
      </Button>
    </Form>
  );
};

export default Login;
