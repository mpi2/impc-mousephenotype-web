import { Model, TableCellProps } from "@/models";
import _ from "lodash";
import Link from "next/link";

type Props = {
  prefix: string;
}
const LinkCell = <T extends Model>(props: TableCellProps<T> & Props) => {
  return (
    <Link className="primary link" href={`${props.prefix}/${_.get(props.value, props.field) as string}`}>
      {_.get(props.value, props.field) as string}
    </Link>
  )
};

export default LinkCell;