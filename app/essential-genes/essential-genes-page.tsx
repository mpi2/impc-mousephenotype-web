"use client";

import { Card, Search } from "@/components";
import { Suspense, useEffect, useState } from "react";
import { Breadcrumb, Container } from "react-bootstrap";
import styles from "./styles.module.scss";
import * as d3 from "d3";

const cellIconPath =
  "M461.002,136.27c-4.371-21.861-13.701-53.804-33.32-81.832c-21.237-30.337-48.936-48.14-82.326-52.909    c-45.224-6.46-117.104,7.331-161.221,45.619c-23.259,20.187-35.543,44.916-35.524,71.509    c0.074,105.192,0.074,105.192-20.431,128.315c-10.002,11.278-25.117,28.322-46.42,61.798    c-63.154,99.241-32.39,154.252-8.433,178.21C82.003,495.655,98.339,512,149.352,512c11.359,0,24.447-0.811,39.543-2.699    c0.363-0.045,0.725-0.11,1.08-0.196c125.837-30.375,210.331-90.764,251.137-179.486    C476.623,252.413,468.817,175.341,461.002,136.27z M185.926,489.983c-72.942,9.012-90.391-8.423-98.786-16.818    c-34.222-34.222-30.278-88.882,11.103-153.909c20.467-32.164,34.389-47.863,44.553-59.325    c25.429-28.675,25.427-30.785,25.35-141.29c-0.014-21.053,9.673-40.144,28.794-56.74c32.517-28.222,84.882-42.376,125.365-42.376    c7.197,0,14.02,0.446,20.288,1.343c23.338,3.334,79.731,21.626,99.254,119.231C492.724,394.5,259.588,472.1,185.926,489.983z";

type FigureData = {
  name: string;
  label: string;
  value: number;
  bgc: string;
};
const figureData: Array<FigureData> = [
  { name: "cl", label: "Cellular\nLethal (CL)", value: 638, bgc: "#cd79a2" },
  {
    name: "dl",
    label: "Developmental\nLethal (DL)",
    value: 1232,
    bgc: "#d75b17",
  },
  { name: "sv", label: "Subviable\n(SV)", value: 606, bgc: "#e79d5d" },
  {
    name: "vp",
    label: "Viable with\nPhenotype (VP)",
    value: 3922,
    bgc: "#50b6e5",
  },
  {
    name: "vnp",
    label: "Viable with no\nPhenotype (VnP)",
    value: 507,
    bgc: "#0073ae",
  },
];

const reduceToObj = <T,>(array: Array<T>, keyToUse: keyof T, initialObj: T) => {
  return array.reduce((obj, bucket) => {
    return {
      ...obj,
      value: (obj[keyToUse] as number) + (bucket[keyToUse] as number),
    };
  }, initialObj);
};
const aggregateToObj = (data: Array<FigureData>, initialObj: FigureData) =>
  reduceToObj(data, "value", initialObj);

const generateCellEssentialData = (data) => {
  const cellEssentialData = data.filter((d) => d.name === "cl");
  const cellNonEssentialData = data.filter((d) => d.name !== "cl");
  return [
    aggregateToObj(cellEssentialData, {
      label: "Cell Essential",
      value: 0,
      name: "ce",
      bgc: "#ac0009",
    }),
    aggregateToObj(cellNonEssentialData, {
      label: "Cell Non-Essential",
      value: 0,
      name: "c-ne",
      bgc: "#c6b7b7",
    }),
  ];
};

const generateMouseData = (data) => {
  const comPenetranceData = data.filter(
    (d) => d.name === "cl" || d.name === "dl",
  );
  const incomPenetranceData = data.filter((d) => d.name === "sv");
  const mouseViableData = data.filter(
    (d) => d.name === "vp" || d.name === "vnp",
  );
  return [
    aggregateToObj(comPenetranceData, {
      label: "Mouse Lethal\n(Complete Penetrance)",
      value: 0,
      name: "mlcp",
      bgc: "#ac0009",
    }),
    aggregateToObj(incomPenetranceData, {
      label: "Mouse Lethal\n(Incomplete Penetrance)",
      value: 0,
      name: "mlcp",
      bgc: "#d65e60",
    }),
    aggregateToObj(mouseViableData, {
      label: "Mouse Viable",
      value: 0,
      name: "mlcp",
      bgc: "#c6b7b7",
    }),
  ];
};

const getXPos = (data: Array<FigureData>, i: number, scale) => {
  const prevXMax = data
    .slice(0, i)
    .reduce((acc, bucket) => acc + bucket.value, 0);
  return scale(prevXMax);
};

const drawBars = (
  chartRef,
  data: Array<FigureData>,
  height: number,
  xScale,
) => {
  chartRef
    .append("g")
    .attr("class", "fusil-groups")
    .attr("transform", `translate(200, ${height})`)
    .selectAll("rect")
    .data(data)
    .join("rect")
    .attr("width", (d) => xScale(d.value) - 20)
    .attr("height", 100)
    .attr("x", (_, i) => getXPos(data, i, xScale))
    .attr("y", 20)
    .style("fill", (d) => d.bgc);
};

const drawLabels = (
  chartRef,
  data: Array<FigureData>,
  height: number,
  xScale,
) => {
  chartRef
    .append("g")
    .attr("class", "fusil-labels")
    .attr("transform", `translate(200, ${height})`)
    .selectAll("text")
    .data(data)
    .join("text")
    .attr("x", (_, i) => getXPos(data, i, xScale))
    .attr("y", 135)
    .attr("class", styles.label)
    .text(null)
    .selectAll("tspan")
    .data((d, i) => d.label.split("\n").map((text) => ({ text, i })))
    .enter()
    .append("tspan")
    .attr("dy", (d, i) => `${i * 1.1}em`)
    .attr("x", (d) => getXPos(data, d.i, xScale))
    .text((d) => d.text);
};

const EssentialGenesPage = () => {
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    const total = figureData.reduce((acc, bucket) => acc + bucket.value, 0);
    const cellEssentialData = generateCellEssentialData(figureData);
    const mouseData = generateMouseData(figureData);
    const svgEl = document.getElementById("svg-figure");
    console.log(cellEssentialData, mouseData);
    if (svgEl && !hasDrawn) {
      setHasDrawn(true);
      const width = svgEl.clientWidth;
      const xScale = d3.scaleLinear([0, total * 1.25], [10, width - 10]);
      const chart = d3.select(svgEl);

      // FUSIL bars and labels
      drawBars(chart, figureData, 0, xScale);
      drawLabels(chart, figureData, 0, xScale);

      chart
        .append("g")
        .attr("class", "fusil-numbers")
        .attr("transform", "translate(200, 0)")
        .selectAll("text")
        .data(figureData)
        .join("text")
        .attr("class", styles.label)
        .attr("x", (_, i) => getXPos(figureData, i, xScale) + 10)
        .attr("y", 18)
        .text((d) => {
          const percentage = ((d.value / total) * 100).toFixed(0);
          return `${percentage}% (${d.value})`;
        });

      // Cell bars and labels
      drawBars(chart, cellEssentialData, 150, xScale);
      drawLabels(chart, cellEssentialData, 150, xScale);

      // Mouse bars and labels
      drawBars(chart, mouseData, 300, xScale);
      drawLabels(chart, mouseData, 300, xScale);

      // All other labels and icons
      chart.append("text").attr("x", 150).attr("y", 85).text("FUSIL");
      chart
        .append("svg:image")
        .attr("xlink:href", "images/cell.svg")
        .attr("x", 150)
        .attr("y", 190)
        .attr("width", 50)
        .attr("height", 50);

      chart
        .append("svg:image")
        .attr("xlink:href", "images/mouse.svg")
        .attr("x", 150)
        .attr("y", 345)
        .attr("width", 50)
        .attr("height", 50);
    }
  }, [hasDrawn]);
  return (
    <>
      <Suspense>
        <Search />
      </Suspense>
      <Container className="page" style={{ lineHeight: 2 }}>
        <Card>
          <div className="subheading">
            <Breadcrumb>
              <Breadcrumb.Item active>Home</Breadcrumb.Item>
              <Breadcrumb.Item active>IMPC data collections</Breadcrumb.Item>
              <Breadcrumb.Item active>Essential Genes</Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <h1 className="mb-4 mt-2">
            <strong>Essential Genes</strong>
          </h1>
          <p>
            The identification of genes linked to a rare disease is one of the
            most difficult challenges geneticists face. The IMPC is seeking to
            identify and characterize genes that are essential for organism
            viability, and attempt to ascertain genes that are critical for
            development and health and, ultimately, associated to human disease.
          </p>
          <p>
            IMPC researchers have proposed a gene classification system, Full
            Spectrum of Intolerance to Loss-of-function (FUSIL), which can be
            used to identify genes associated with disease. Genes in these bins
            range from more to less essential. Genes are ascertain to a FUSIL
            bin by cross comparing viability and phenotyping data from knockout
            IMPC mice with human cell essentiality scores from the&nbsp;
            <a className="link primary" href="https://depmap.org/portal/">
              Cancer Dependency map
            </a>
            . In this way, genes can be categorised as to how essential they are
            for supporting life and the likelihood they are associated with de
            novo genetic disorders.
          </p>
          <p>
            In this portal, we present integrated views of viability data to
            help researchers explore the full genetic spectrum of essentiality
            and aid unvailing yet unknown genetic associations to human disease.
            More in our{" "}
            <a
              className="link primary"
              href="https://www.mousephenotype.org/news/how-impc-experts-are-categorically-analysing-gene-essentiality-to-find-new-possible-genetic-causes-of-disease/"
            >
              blog post here
            </a>
            .
          </p>
          <span>
            <b>IMPC associated publications</b>:
            <ul>
              <li>
                <a
                  className="link primary"
                  href="https://www.nature.com/articles/s41467-020-14284-2"
                >
                  Human and mouse essentiality screens as a resource for disease
                  gene discovery, Nature Communications 2020
                </a>
              </li>
              <li>
                <a
                  className="link primary"
                  href="https://link.springer.com/article/10.1007%2Fs10592-018-1072-9"
                >
                  The IMPC: a functional catalogue of the mammalian genome that
                  informs conservation, Conservation Genetics (Special Issue on
                  Adaptation) 2019
                </a>
              </li>
              <li>
                <a
                  className="link primary"
                  href="https://www.nature.com/articles/nature19356"
                >
                  High-throughput discovery of novel developmental phenotypes,
                  Nature 2016
                </a>
              </li>
            </ul>
          </span>
          <div className={styles.figure}>
            <svg id="svg-figure" width="100%" height="500px" />
          </div>
        </Card>
      </Container>
    </>
  );
};

export default EssentialGenesPage;
