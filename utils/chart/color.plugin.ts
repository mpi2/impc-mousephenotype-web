// based on default colors plugin in Chart.js repo
// assumes the chart has only one dataset

import type {Chart, ChartDataset} from 'chart.js';

export interface ColorsPluginOptions {
  enabled?: boolean;
}

type DatasetColorizer = (dataset: ChartDataset, i: number) => void;

interface ColorsDescriptor {
  backgroundColor?: unknown;
  borderColor?: unknown;
}

const BORDER_COLORS = [
  'rgb(54, 162, 235)', // blue
  'rgb(255, 99, 132)', // red
  'rgb(255, 159, 64)', // orange
  'rgb(255, 205, 86)', // yellow
  'rgb(75, 192, 192)', // green
  'rgb(153, 102, 255)', // purple
  'rgb(201, 203, 207)' // grey
];

// Border colors with 50% transparency
const BACKGROUND_COLORS = /* #__PURE__ */ BORDER_COLORS.map(color => color.replace('rgb(', 'rgba(').replace(')', ', 0.5)'));

function getBorderColor(i: number) {
  return BORDER_COLORS[i % BORDER_COLORS.length];
}

function getBackgroundColor(i: number) {
  return BACKGROUND_COLORS[i % BACKGROUND_COLORS.length];
}

function colorize(dataset: ChartDataset) {
  dataset.backgroundColor = dataset.data.map((_, i) => getBackgroundColor(i));
  dataset.borderColor = dataset.data.map((_, i) => getBorderColor(i));
}

function containsColorsDefinitions(
  descriptors: ColorsDescriptor[] | Record<string, ColorsDescriptor>
) {
  let k: number | string;

  for (k in descriptors) {
    if (descriptors[k].borderColor || descriptors[k].backgroundColor) {
      return true;
    }
  }

  return false;
}

export default {
  id: 'colors',

  defaults: {
    enabled: true,
  },

  beforeLayout(chart: Chart, _args, options: ColorsPluginOptions) {
    if (!options.enabled) {
      return;
    }

    const {
      options: {elements},
      data: {datasets}
    } = chart.config;

    if (containsColorsDefinitions(datasets) || elements && containsColorsDefinitions(elements)) {
      return;
    }

    colorize(datasets[0]);
  }
};