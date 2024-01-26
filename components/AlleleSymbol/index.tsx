import { formatAlleleSymbol } from "@/utils";

const AlleleSymbol = ({ symbol, withLabel = true }: { symbol: string, withLabel: boolean }) => {
  const allele = formatAlleleSymbol(symbol);
  return <span>{!!withLabel ? 'Allele: ' : ''}{allele[0]}<sup>{allele[1]}</sup></span>
}

export default AlleleSymbol;