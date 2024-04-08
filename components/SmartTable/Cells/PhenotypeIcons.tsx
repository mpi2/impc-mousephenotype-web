import { Model, TableCellProps } from "@/models";
import _ from "lodash";
import { BodySystem } from "@/components/BodySystemIcon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

type Props<T> = {
  allPhenotypesField: keyof T;
  mpTermIdKey?: keyof T;
} & TableCellProps<T>;

const PhenotypeIcons = <T extends Model>(props: Props<T>) => {
  const phenotypes = (_.get(props.value, props.allPhenotypesField) || []) as Array<{ name: string }>;

  return (
    <span style={{display: 'inline-flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem'}}>
      <span>
        {phenotypes.map(({name}) => (
          <BodySystem name={name} color="system-icon in-table" noSpacing/>
        ))}
      </span>
    </span>
  )
};

export default PhenotypeIcons;