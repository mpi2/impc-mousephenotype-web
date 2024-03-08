import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";

const Check = ({ isChecked }) => {
  const styles = isChecked ? {} : { backgroundColor: '#8E8E8E' }
  return (
    <span style={styles}>
      <FontAwesomeIcon icon={isChecked ? faCheck : faXmark} style={{ color: '#000' }} />
    </span>
  )
};

export default Check;
