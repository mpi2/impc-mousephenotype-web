export const verticalLinePlugin = {
  id: "verticalLinePlugin",
  afterDraw: (chart) => {
    const {
      ctx,
      chartArea: { top, bottom },
      scales: { x },
    } = chart;

    const opts = chart.options.plugins.verticalLinePlugin;
    console.log(opts);
    const value = opts?.value;
    const color = opts?.color ?? "red";

    if (value === undefined) return;

    const xPos = x.getPixelForValue(value);
    ctx.save();
    ctx.beginPath();
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.moveTo(xPos, top);
    ctx.lineTo(xPos, bottom);
    ctx.stroke();
    ctx.restore();
  },
};
