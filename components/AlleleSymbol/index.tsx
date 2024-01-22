import { formatAlleleSymbol } from "@/utils";

const AlleleSymbol = ({ symbol, withLabel = true }) => {
  const allele = formatAlleleSymbol(symbol);
  return <span>{!!withLabel ? 'Allele: ' : ''}{allele[0]}<sup>{allele[1]}</sup></span>
}

export default AlleleSymbol;