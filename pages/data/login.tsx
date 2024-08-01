import { useRouter } from "next/router";
import Link from "next/link";
import { Container } from "react-bootstrap";
import { Card, Search } from "@/components";
import LoginForm from "@/components/MyGenes/Login";

const Login = () => {
  const router = useRouter();

  const afterLogin = () => {
    router.push("/data/summary");
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
            <strong>Log into My Genes Account</strong>
          </h1>
          <div style={{ maxWidth: 400 }}>
            <p className="grey mb-4">
              Log in to your My Genes account to view and manage the list of
              genes you've followed.
            </p>
            <LoginForm onLogin={afterLogin} />
            <p className="mt-5 grey">
              Don’t have an account?{" "}
              <Link href="/data/newAccountRequest" className="secondary">
                Sign up
              </Link>
            </p>
          </div>
        </Card>
      </Container>
    </>
  );
};

export default Login;
