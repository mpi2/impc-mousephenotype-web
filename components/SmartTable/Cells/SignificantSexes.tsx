import { Model, TableCellProps } from "@/models";
import _ from "lodash";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMars, faMarsAndVenus, faVenus } from "@fortawesome/free-solid-svg-icons";

const getSexLabel = (sex: string) => {
  switch (sex) {
    case "male":
      return "Male";
    case "female":
      return "Female";
    default:
      return "Combined";
  }
};

const getIcon = (sex: string) => {
  switch (sex) {
    case "male":
      return faMars;
    case "female":
      return faVenus;
    default:
      return faMarsAndVenus;
  }
};


const SignificantSexes = <T extends Model>(props: TableCellProps<T> & {  }) => {
  return (
    <>
      {["male", "female", "not_considered"]
        .filter(sex => _.has(props.value, `pValue_${sex}`))
        .map(significantSex => (
          <OverlayTrigger
            placement="top"
            trigger={["hover", "focus"]}
            overlay={<Tooltip>{getSexLabel(significantSex)}</Tooltip>}
          >
            <span className="me-2">
              <FontAwesomeIcon icon={getIcon(significantSex)} size="lg" />
            </span>
          </OverlayTrigger>
        ))}
    </>
  )
};

export default SignificantSexes;