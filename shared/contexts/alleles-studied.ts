import { createContext } from "react";

type AllelesStudiedContext = {
  allelesStudied: Array<string>;
  setAlleles: (newValue: Array<string>) => void
}

export const AllelesStudiedContext = createContext<AllelesStudiedContext>({
  allelesStudied: [],
  setAlleles: () => {}
});