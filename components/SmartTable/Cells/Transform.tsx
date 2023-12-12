import { Model, TableCellProps } from "@/models";
import _ from "lodash";

type Props = {
  options: Record<string, string>;
}
const LinkCell = <T extends Model>(props: TableCellProps<T> & Props) => {
  return <span>{props.options[_.get(props.value, props.field) as string]}</span>
};

export default LinkCell;