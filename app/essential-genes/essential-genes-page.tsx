"use client";

import { Card, Search } from "@/components";
import { Suspense, useEffect, useRef } from "react";
import { Breadcrumb, Container } from "react-bootstrap";
import styles from "./styles.module.scss";
import * as d3 from "d3";

const figureData = [
  { name: "cl", label: "Cellular Lethal (CL)", value: 638, bgc: "#cd79a2" },
  {
    name: "dl",
    label: "Developmental Lethal (DL)",
    value: 1232,
    bgc: "#d75b17",
  },
  { name: "sv", label: "Subviable (SV)", value: 606, bgc: "#e79d5d" },
  {
    name: "vp",
    label: "Viable with Phenotype (VP)",
    value: 3922,
    bgc: "#50b6e5",
  },
  {
    name: "vnp",
    label: "Viable with no Phenotype (VnP)",
    value: 507,
    bgc: "#0073ae",
  },
];

const EssentialGenesPage = () => {
  useEffect(() => {
    const total = figureData.reduce((acc, bucket) => acc + bucket.value, 0);
    const svgEl = document.getElementById("svg-figure");
    if (svgEl) {
      const width = svgEl.clientWidth;
      const xScale = d3.scaleLinear([0, total * 1.3], [10, width - 10]);
      d3.select(svgEl)
        .append("g")
        .attr("class", "fusil-groups")
        .attr("transform", "translate(200, 0)")
        .selectAll("rect")
        .data(figureData)
        .join("rect")
        .attr("width", (d) => {
          return xScale(d.value) - 20;
        })
        .attr("height", 100)
        .attr("x", (d, i) => {
          const prevXMax = figureData
            .slice(0, i)
            .reduce((acc, bucket) => acc + bucket.value, 0);
          return xScale(prevXMax);
        })
        .attr("y", 20)
        .style("fill", (d) => d.bgc);
    }
  }, []);
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
            <svg id="svg-figure" width="100%" height="400px"></svg>
          </div>
        </Card>
      </Container>
    </>
  );
};

export default EssentialGenesPage;
