import { Model, TableCellProps } from "@/models";
import _ from "lodash";
import { formatAlleleSymbol } from "@/utils";

const AlleleCell = <T extends Model>(props: TableCellProps<T>) => {
  const allele = formatAlleleSymbol(_.get(props.value, props.field) as string);
  return (
    <>
      {allele[0]}
      <sup>{allele[1]}</sup>
    </>
  )
};

export default AlleleCell;