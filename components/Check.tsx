import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import {
  faCheckCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";

const Check = ({ isChecked }) => {
  return isChecked ? (
    <FontAwesomeIcon icon={faCheckCircle} />
  ) : (
    <FontAwesomeIcon icon={faTimesCircle} className="grey" />
  );
};

export default Check;
