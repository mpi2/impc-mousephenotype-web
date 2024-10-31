type State = {
  isBusyJSON: boolean;
  isBusyXLSX: boolean;
  isBusyTSV: boolean;
};
export type toogleFlagPayload = "application/JSON" | "XLSX" | "TSV";
type toogleFlag = { type: "toggle"; payload: toogleFlagPayload };

type Actions = toogleFlag;

export const initialState: State = {
  isBusyJSON: false,
  isBusyXLSX: false,
  isBusyTSV: false,
};

export function reducer(state: State, action: Actions) {
  switch (action.type) {
    case "toggle":
      const key: keyof State = `isBusy${action.payload}`;
      return {
        ...state,
        [key]: !state[key],
      };
    default:
      return state;
  }
}
