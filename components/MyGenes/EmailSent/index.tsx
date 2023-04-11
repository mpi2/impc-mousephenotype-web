import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const EmailSent = ({ emailAddress }) => {
  return (
    <div style={{ textAlign: "center", padding: "5rem 0" }}>
      <FontAwesomeIcon icon={faPaperPlane} className="secondary" size="5x" />
      <p className="h2 mt-5" style={{ fontWeight: 400 }}>
        An email with instructions has been sent to <br />
        <strong>{emailAddress}</strong>.
      </p>
      <p className="small grey">
        The email contains a link valid for 3 hours. Any previous links are no
        longer valid.
      </p>
    </div>
  );
};

export default EmailSent;
