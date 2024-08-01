import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";

const GeneComparatorContext = React.createContext(null);

export const GeneComparatorProvider = ({ children }) => {
  const [genes, setGenes] = useState([]);

  const addGene = (gene) => {
    if (gene && !genes.includes(gene)) {
      const newGenes = [...genes, gene];
      setGenes(newGenes);
      return newGenes;
    }
    return genes;
  };

  const removeGene = (gene) => {
    if (gene && genes.includes(gene)) {
      genes.splice(genes.indexOf(gene));
      setGenes(genes);
    }
  };

  const resetGenes = (genes: string[]) => {
    setGenes(genes);
  };

  return (
    <GeneComparatorContext.Provider
      value={{ genes, addGene, removeGene, resetGenes }}
    >
      {children}
    </GeneComparatorContext.Provider>
  );
};

export const useGeneComparator = () => React.useContext(GeneComparatorContext);

export const GeneComparatorTrigger = ({ current }: { current?: string }) => {
  const { addGene, genes } = useGeneComparator();
  const router = useRouter();
  return (
    <Button
      style={{
        position: "fixed",
        zIndex: 100,
        bottom: genes.length > 0 || current ? 0 : -100,
        right: 100,
        transition: ".3s ease transform",
      }}
      variant="primary"
      onClick={() => {
        if (current) {
          const updatedGenes = addGene(current);
          return router.push(`/data/compareGenes/?genes=${updatedGenes.join("_")}`);
        }
        router.push(`/data/compareGenes/?genes=${genes.join("_")}`);
      }}
    >
      Compare Genes{" "}
      <span
        className="bg-white"
        style={{
          display: "inline-block",
          height: 22,
          padding: "0 7px",
          borderRadius: 11,
          marginLeft: 6,
          fontWeight: "bold",
          color: '#000',
        }}
      >
        {genes.length}
      </span>
    </Button>
  );
};
