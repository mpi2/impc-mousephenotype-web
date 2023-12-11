import { Model, TableCellProps } from "@/models";
import _ from "lodash";

const SimpleTextCell = <T extends Model>(props: TableCellProps<T>) => {
  return <span>{_.get(props.value, props.field) as string}</span>
};

export default SimpleTextCell;