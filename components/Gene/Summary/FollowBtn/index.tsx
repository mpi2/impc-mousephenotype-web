import {
  faAdd,
  faCheckCircle,
  faListDots,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Button, OverlayTrigger } from "react-bootstrap";
import styles from "./styles.module.scss";
import Login from "../../../MyGenes/Login";
import Link from "next/link";

export default () => {
  const [following, setFollowing] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  const follow = () => {
    setFollowing(true);
  };

  const unfollow = () => {
    setFollowing(false);
  };

  const login = () => {
    setLoggedIn(true);
    follow();
  };

  const followBtn = (
    <Button
      size="sm"
      variant="secondary"
      style={{ marginTop: "1em", border: 0, fontWeight: 500 }}
      className="bg-blue-light-x"
      onClick={follow}
    >
      <FontAwesomeIcon
        className="secondary"
        icon={faAdd}
        style={{ marginRight: 2 }}
      />{" "}
      Follow
    </Button>
  );

  const followAndLoginBtn = (
    <OverlayTrigger
      placement="bottom-end"
      trigger={["click"]}
      key="follow-btn"
      offset={[8, 0]}
      rootClose
      overlay={
        <div className={styles.inlineModal}>
          <h2 className="h2 mb-2">My Genes account</h2>
          <p className="small grey mb-4">
            Log in to your My Genes account to view and manage the list of genes
            you've followed
          </p>
          <Login onLogin={login} />
          <p className="mt-5 small grey">
            Don’t have an account?{" "}
            <Link href="/data/newAccountRequest" className="secondary">
              Sign up
            </Link>
          </p>
        </div>
      }
    >
      {({ ref, ...triggerHandler }) => (
        <Button
          {...triggerHandler}
          ref={ref}
          size="sm"
          variant="secondary"
          style={{ marginTop: "1em", border: 0, fontWeight: 500 }}
          className="bg-blue-light-x"
        >
          <FontAwesomeIcon
            className="secondary"
            icon={faAdd}
            style={{ marginRight: 2 }}
          />{" "}
          Follow
        </Button>
      )}
    </OverlayTrigger>
  );
  const followingBtn = (
    <OverlayTrigger
      placement="bottom-end"
      trigger={["click"]}
      offset={[8, 0]}
      rootClose
      overlay={
        <div className={styles.inlineModal}>
          <p>
            You are following this gene. Any updates on the page will be sent to
            your email address.
          </p>
          <p>
            <Link href="/data/summary">
              <Button
                variant="light"
                className="secondary-x"
                style={{ marginLeft: -12 }}
              >
                <FontAwesomeIcon icon={faListDots} />
                &nbsp;&nbsp;Manage subscriptions
              </Button>
            </Link>
            <Button
              variant="light"
              className="grey-x"
              style={{ marginLeft: -12 }}
              onClick={unfollow}
            >
              <FontAwesomeIcon icon={faMinus} />
              &nbsp;&nbsp;Unfollow
            </Button>
          </p>
        </div>
      }
      key="following-btn"
    >
      {({ ref, ...triggerHandler }) => (
        <Button
          {...triggerHandler}
          ref={ref}
          size="sm"
          variant="light"
          style={{ marginTop: "1em", border: 0, fontWeight: 500 }}
          className="bg-grey-light-x grey-x"
        >
          <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: 2 }} />{" "}
          Following
        </Button>
      )}
    </OverlayTrigger>
  );

  return !loggedIn ? followAndLoginBtn : following ? followingBtn : followBtn;
};
