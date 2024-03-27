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
  const mgiAccessionId = _.get(props.value, "mgiGeneAccessionId") as string;
  const mpTermKey = !!props.mpTermIdKey ? props.mpTermIdKey : "id";
  const mpTermpId = _.get(props.value, mpTermKey) as string;

  let url = `/data/charts?mgiGeneAccessionId=${mgiAccessionId}&mpTermId=${mpTermpId}`;
  const isAssociatedToPWG = props.value?.["projectName"] === "PWG" || false;
  if (isAssociatedToPWG) {
    url =
      "https://www.mousephenotype.org/publications/data-supporting-impc-papers/pain/";
  }
  return (
    <>
      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <span>
          {phenotypes.map(({ name }) => (
            <BodySystem name={name} color="system-icon in-table primary" noSpacing />
          ))}
        </span>
        <Link href={url}>
          <span className={`link primary small float-right`}>
            Supporting data&nbsp;
          </span>
        </Link>
      </span>
    </>
  )
};

export default PhenotypeIcons;