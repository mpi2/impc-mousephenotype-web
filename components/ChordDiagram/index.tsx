import * as d3 from 'd3';
import { useEffect, useRef } from "react";
import styles from './styles.module.scss';

interface Props  {
  // data: Array<Array<number>>;
  width: number;
  height: number;
  topTerms?: Array<string>;
}

function groupTicks(d, step) {
  var k = (d.endAngle - d.startAngle) / d.value;
  return d3.range(0, d.value, step).map(function (value) {
    return {value: value, angle: value * k + d.startAngle, index: d.index};
  });
}

const ChordDiagram = ({ width, height, topTerms }: Props) => {
  const ref = useRef();
  const outerRadius = Math.min(width, height) * 0.5 - 200;
  const innerRadius = outerRadius - 30;
  // TODO: to be removed after getting payload for landing pages
  const matrix = [
    [
      590,
      268,
      712,
      64,
      45
    ],
    [
      268,
      0,
      26,
      12,
      4
    ],
    [
      712,
      26,
      0,
      11,
      6
    ],
    [
      64,
      12,
      11,
      0,
      0
    ],
    [
      45,
      4,
      6,
      0,
      0
    ]
  ]
  let labels = "[{\"name\":\"cardiovascular system phenotype\",\"geneCount\":1622}, {\"name\":\"vision\\\/eye phenotype\",\"geneCount\":268}, {\"name\":\"growth\\\/size\\\/body region phenotype\",\"geneCount\":712}, {\"name\":\"embryo phenotype\",\"geneCount\":64}, {\"name\":\"muscle phenotype\",\"geneCount\":45}]";
  let labels_json = JSON.parse(labels);

  useEffect(() => {
    const svgElement = d3.select(ref.current);

    function fade(opacity) {
      return function (d, i) {
        const { index } = i;
        // hide other chords on mose over
        svgElement.selectAll("path.chord")
          .filter(chord => chord.source.index !== index && chord.target.index !== index)
          .transition()
          .style("stroke-opacity", opacity)
          .style("fill-opacity", opacity);
      };
    }
    const chord = d3.chord()
      .padAngle(0.05)
      .sortSubgroups(d3.descending);

    const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);

    const ribbon = d3.ribbon().radius(innerRadius);

    const color = d3.scaleOrdinal()
      .domain(d3.range(4))
      .range([
        "rgb(239, 123, 11)",
        "rgb(9, 120, 161)",
        "rgb(119, 119, 119)",
        "rgb(238, 238, 180)",
        "rgb(36, 139, 75)",
        "rgb(191, 75, 50)",
        "rgb(255, 201, 67)",
        "rgb(191, 151, 50)",
        "rgb(239, 123, 11)",
        "rgb(247, 157, 70)",
        "rgb(247, 181, 117)",
        "rgb(191, 75, 50)",
        "rgb(151, 51, 51)",
        "rgb(144, 195, 212)"
      ]);

    const g = svgElement.append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`)
      .datum(chord(matrix));

    const group = g.append("g")
      .attr("class", "groups")
      .selectAll("g")
      .data(chords => chords.groups)
      .enter().append("g")
      .attr("class", "group")
      .on("mouseover", fade(.02))
      .on("mouseout", fade(.80));

    group.append("path")
      .style("fill", d => color(d.index))
      .style("stroke", d => d3.rgb(color(d.index)).darker())
      .attr("d", arc);

    const groupTick = group.selectAll(".group-tick")
      .data(d => groupTicks(d, 1e3))
      .enter().append("g")
      .attr("class", "group-tick")
      .attr("transform", d => `rotate(${d.angle * 180 / Math.PI - 90}) translate(${outerRadius},0)`);

    groupTick.append("line")
      .attr("x2", 6);

    groupTick
      .filter(d => d.value % 5e3 === 0)
      .append("text")
      .attr("x", 8)
      .attr("dy", ".35em")
      .attr("transform", d => d.angle > Math.PI ? "rotate(180) translate(-16)" : null)
      .style("text-anchor", d => d.angle > Math.PI ? "end" : null)
      .text(d => labels_json[d.index].name.replace("phenotype", ""));

    g.append("g")
      .attr("class", "ribbons")
      .selectAll("path")
      .data(chords => chords)
      .enter()
      .append("path")
      .attr("d", ribbon)
      .attr("class", "chord")
      .style("fill", d => color(d.target.index))
      .style("stroke", d =>d3.rgb(color(d.target.index)).darker())
      .style("visibility", d => {
        if (topTerms && topTerms.length > 0) {
          if (topTerms.indexOf(labels_json[d.source.index].name) < 0 && topTerms.indexOf(labels_json[d.target.index].name) < 0) {
            return "hidden";
          } else {
            return "visible";
          }
        } else {
          return "visible";
        }
      })
      .append("title").text(d => {
        return d.source.value + " genes present " + labels_json[d.source.index].name + " and " + labels_json[d.target.index].name + ", " ;
      });

  }, []);

  return (
    <div className={styles.wrapper}>
      <svg
        width={width}
        height={height}
        ref={ref}
      />
    </div>
  )
};

export default ChordDiagram;