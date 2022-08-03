export interface UnidimensionalSeries {
    sex: "male" | "female";
    sampleGroup: "experimental" | "control";
    data: Array<number>;
  }