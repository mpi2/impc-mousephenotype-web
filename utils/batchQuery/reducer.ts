import { DownloadButtonsState } from "@/models";

export type toogleFlagPayload = "JSON" | "XLSX" | "TSV" | "SummaryJSON";
type toogleFlag = { type: "toggle"; payload: toogleFlagPayload };

type Actions = toogleFlag;

export const initialState: DownloadButtonsState = {
  isBusyJSON: false,
  isBusyXLSX: false,
  isBusyTSV: false,
  isBusySummaryJSON: false,
};

export function reducer(state: DownloadButtonsState, action: Actions) {
  switch (action.type) {
    case "toggle":
      const key: keyof DownloadButtonsState = `isBusy${action.payload}`;
      return {
        ...state,
        [key]: !state[key],
      };
    default:
      return state;
  }
}
