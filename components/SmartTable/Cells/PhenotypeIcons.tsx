import { Model, TableCellProps } from "@/models";
import _ from "lodash";
import { BodySystem } from "@/components/BodySystemIcon";

const PhenotypeIcons = <T extends Model>(props: TableCellProps<T> & { allPhenotypesField: keyof T }) => {
  const phenotypes = (_.get(props.value, props.allPhenotypesField) || []) as Array<{ name: string }>
  return (
    <>
      {phenotypes.map(({ name }) => (
        <BodySystem name={name} color="system-icon black in-table" noSpacing />
      ))}
    </>
  )
};

export default PhenotypeIcons;