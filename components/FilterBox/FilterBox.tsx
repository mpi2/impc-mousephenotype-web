import { Form } from "react-bootstrap";
import { CSSProperties } from "react";

type LabelProps = | {
  hideLabel?: true,
  label?: never
} | {
  hideLabel?: false;
  label: string;
};
type CommonProps = {
  controlId: string;
  onChange: (value: string) => void;
  ariaLabel: string;
  options?: Array<string>;
  labelStyle?: CSSProperties;
  controlStyle?: CSSProperties;
  controlClassName?: string;
  value?: string;
};

type Props = CommonProps & LabelProps;
const FilterBox = (props: Props) => {
  const {
    controlId,
    options,
    label,
    ariaLabel,
    onChange,
    labelStyle = { marginRight: "0.5rem" },
    controlStyle = { display: "inline-block", width: 200 },
    controlClassName = 'bg-white',
    hideLabel = false,
    value,
  } = props;

  if (options?.length === 1) {
    return null;
  }

  return (
    <div>
      {!hideLabel && (
        <label htmlFor={controlId} className="grey" style={labelStyle}>
          {label}:
        </label>
      )}
      {!!options && options.length > 0 ? (
        <Form.Select
          style={controlStyle}
          aria-label={ariaLabel}
          defaultValue={undefined}
          id={controlId}
          className={controlClassName}
          value={value}
          onChange={el =>
            onChange(el.target.value === "all" ? undefined : el.target.value)
          }
        >
          <option value={"all"}>All</option>
          {
            options.map((p) => <option value={p} key={p}>{p}</option>)
          }
        </Form.Select>
      ) : (
        <Form.Control
          type="text"
          placeholder="Search"
          style={controlStyle}
          aria-label={ariaLabel}
          defaultValue={undefined}
          id={controlId}
          className={controlClassName}
          onChange={el =>
            onChange(el.target.value.toLowerCase() || undefined)
          }
        >
        </Form.Control>
      )}
    </div>
  )
};
export default FilterBox;