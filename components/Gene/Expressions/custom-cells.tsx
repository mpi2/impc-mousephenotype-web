import { GeneExpression } from "@/models/gene";
import { TableCellProps } from "@/models";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import _ from "lodash";
import { GeneExpressionCounts } from "@/models/gene/expression";

export const ImagesCell = <T extends GeneExpression>(props: TableCellProps<T> & { mgiGeneAccessionId: string; }) => {
  const imageParameters = props.value.expressionImageParameters;
  return (
    !!imageParameters
    ? imageParameters.map((p, index) => (
      <Link
        key={index}
        className="primary small"
        href={`/data/genes/${props.mgiGeneAccessionId}/images/${p.parameterStableId}`}
      >
        <FontAwesomeIcon icon={faImage} />{" "}
        {p.parameterName}
      </Link>
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