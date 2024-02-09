import { createContext } from "react";

type NumAllelesContext = {
  numOfAlleles: number;
  setNumOfAlleles: (newValue: number) => void
}

export const NumAllelesContext = createContext<NumAllelesContext>({
  numOfAlleles: null,
  setNumOfAlleles: () => {}
});
