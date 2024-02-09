import { createContext } from "react";

type GeneAlellesContext = {
  numOfAlleles: number;
  setNumOfAlleles: (newValue: number) => void
}

export const GeneAllelesContext = createContext<GeneAlellesContext>({
  numOfAlleles: null,
  setNumOfAlleles: () => {}
});
