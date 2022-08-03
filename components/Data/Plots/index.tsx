export interface UnidimensionalSeries {
  sex: "male" | "female";
  sampleGroup: "experimental" | "control";
  data: Array<number>;
}
export interface CategoricalSeries {
  sex: "male" | "female";
  sampleGroup: "experimental" | "control";
  category: string;
  value: number;
}

export const bgColors = {
  control: "rgba(239, 123, 11, 0.2)",
  experimental: "rgba(9, 120, 161, 0.7)",
};
export const boderColors = {
  control: "rgba(239, 123, 11, 0.5)",
  experimental: "rgba(9, 120, 161, 0.7)",
};
export const shapes = { male: "triangle", female: "circle" };
export const pointRadius = 5;
