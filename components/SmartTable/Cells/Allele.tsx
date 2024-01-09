import { Model, TableCellProps } from "@/models";
import _ from "lodash";
import { formatAlleleSymbol } from "@/utils";

const AlleleCell = <T extends Model>(props: TableCellProps<T>) => {
  const allele = formatAlleleSymbol(_.get(props.value, props.field) as string);
  return (
    <span style={props.style}>
      {allele[0]}
      <sup>{allele[1]}</sup>
    </span>
  )
};

export default AlleleCell;