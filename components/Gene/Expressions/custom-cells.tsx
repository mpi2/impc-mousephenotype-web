import { GeneExpression } from "@/models/gene";
import { TableCellProps } from "@/models";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import _ from "lodash";
import { GeneExpressionCounts } from "@/models/gene/expression";

export const AnatomyCell = <T extends GeneExpression>(props: TableCellProps<T>) => {
  return (
    <Link
      href="/data/charts?accession=MGI:2444773&allele_accession_id=MGI:6276904&zygosity=homozygote&parameter_stable_id=IMPC_DXA_004_001&pipeline_stable_id=UCD_001&procedure_stable_id=IMPC_DXA_001&parameter_stable_id=IMPC_DXA_004_001&phenotyping_center=UC%20Davis"
      legacyBehavior>
      <strong className="link">{props.value.parameterName}</strong>
    </Link>
  )
}
export const ImagesCell = <T extends GeneExpression>(props: TableCellProps<T> & { mgiGeneAccessionId: string; }) => {
  const imageParameters = props.value.expressionImageParameters;
  return (
    !!imageParameters
    ? imageParameters.map((p, index) => (
      <a
        key={index}
        className="primary small"
        href={`https://www.mousephenotype.org/data/imageComparator?acc=${props.mgiGeneAccessionId}&anatomy_id=MA:0000168&parameter_stable_id=${p.parameterStableId}`}
      >
        <FontAwesomeIcon icon={faImage} />{" "}
        {p.parameterName}
      </a>
    ))
    : "n/a"
  )
}
export const ExpressionCell = <T extends GeneExpression>(props: TableCellProps<T> & {
  expressionRateField: keyof T,
  countsField: keyof T;
}) => {
  const expressionRate = props.value[props.expressionRateField] as number;
  const expressionCounts = _.get(props.value, props.countsField) as GeneExpressionCounts;
  const totalCounts = expressionCounts.expression + expressionCounts.noExpression;
  return (
    expressionRate >= 0
      ? `${expressionRate}% (${expressionCounts.expression}/${totalCounts})`
      : "n/a"
  )
}