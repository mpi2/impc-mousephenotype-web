import styles from "@/components/ManhattanPlot/styles.module.scss";
import { formatPValue } from "@/utils";

type Gene = { mgiGeneAccessionId: string, geneSymbol: string, pValue: number };

type TooltipProps = {
  tooltip: {
    opacity: number;
    top: number;
    left: number;
    chromosome: string,
    genes: Array<Gene>,
  };
  offsetX: number;
  offsetY: number;
  onClick: () => void;
};

const DataTooltip = ({tooltip, offsetY, offsetX, onClick}: TooltipProps) => {
  const getChromosome = () => {
    if (tooltip.chromosome === '20') {
      return 'X';
    } else if (tooltip.chromosome === '21') {
      return 'Y';
    }
    return tooltip.chromosome;
  }
  return (
    <div
      className={`${styles.tooltip} ${tooltip.opacity === 0 ? styles.noVisible: styles.visible }`}
      style={{ top: tooltip.top + offsetX, left: tooltip.left + offsetY, opacity: tooltip.opacity }}
    >
      <button className={styles.closeBtn} onClick={onClick}>×</button>
      <span><strong>Chr: </strong>{ getChromosome() }</span>
      <ul>
        { tooltip.genes.map(gene => (
          <li key={gene.mgiGeneAccessionId}>
            Gene:&nbsp;
            <a className="primary link" target="_blank" href={`/genes/${gene.mgiGeneAccessionId}`}>
              {gene.geneSymbol}
            </a>
            <br/>
            P-value: {!!gene.pValue ? formatPValue(gene.pValue) : 0}
          </li>
        )) }
      </ul>
    </div>
  )
}
export default DataTooltip;