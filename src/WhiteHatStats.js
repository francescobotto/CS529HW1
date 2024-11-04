import React, { useEffect, useRef } from "react";
import useSVGCanvas from "./useSVGCanvas.js";
import * as d3 from "d3";

export default function WhiteHatStats(props) {
  const d3Container = useRef(null);
  const [svg, height, width, tTip] = useSVGCanvas(d3Container);
  const { ToolTip } = props;

  const margin = 50;

  useEffect(() => {
    if (svg === undefined || props.data === undefined) {
      console.warn("SVG container or data is not available yet.");
      return;
    }

    const data = props.data.states;
    console.log("Data received by WhiteHatStats:", data);

    // Compute `female_count` using `count - male_count` and use `abreviation` for state name
    const plotData = data.map((state) => {
      const stateAbbreviation = state.abreviation || "Unknown";
      const maleCount = state.male_count ?? 0;
      const femaleCount = (state.count ?? 0) - maleCount;

      console.log(
        `State: ${stateAbbreviation}, Female count: ${femaleCount}, Male count: ${maleCount}`
      );

      return {
        name: stateAbbreviation, // Use abbreviation instead of full name
        values: [
          { gender: "male", count: maleCount },
          { gender: "female", count: femaleCount },
        ],
      };
    });

    console.log("Formatted plot data with abbreviations:", plotData);

    const xScale = d3
      .scaleBand()
      .domain(plotData.map((d) => d.name)) // Now using abbreviation
      .range([margin, width - margin])
      .padding(0.1);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(plotData, (d) => d3.sum(d.values, (v) => v.count))])
      .range([height - margin, margin]);

    const colorScale = d3
      .scaleOrdinal()
      .domain(["male", "female"])
      .range(["#1f77b4", "#ff7f0e"]);

    svg.selectAll(".bar").remove();

    const stateGroups = svg
      .selectAll(".bar")
      .data(plotData)
      .enter()
      .append("g")
      .attr("class", "bar")
      .attr("transform", (d) => `translate(${xScale(d.name)}, 0)`);

    stateGroups
      .selectAll("rect")
      .data((d) => d.values)
      .enter()
      .append("rect")
      .attr("x", 0)
      .attr("y", (d, i, nodes) => {
        const total = d3.sum(
          nodes.slice(0, i + 1).map((n) => n.__data__.count)
        );
        console.log(
          `Setting y position for ${d.gender} in ${d.name}:`,
          yScale(total)
        );
        return yScale(total);
      })
      .attr("height", (d) => {
        const barHeight = height - margin - yScale(d.count);
        console.log(`Bar height for ${d.gender} in ${d.name}:`, barHeight);
        return barHeight;
      })
      .attr("width", xScale.bandwidth())
      .attr("fill", (d) => colorScale(d.gender))
      .on("mouseover", (e, d) => {
        const text = `${d.gender === "male" ? "Male" : "Female"} Gun Deaths: ${
          d.count
        }`;
        tTip.html(text);
        ToolTip.moveTTipEvent(tTip, e);
      })
      .on("mousemove", (e) => ToolTip.moveTTipEvent(tTip, e))
      .on("mouseout", () => ToolTip.hideTTip(tTip));

    svg.selectAll("g.axis").remove();

    svg
      .append("g")
      .attr("class", "axis")
      .attr("transform", `translate(0,${height - margin})`)
      .call(d3.axisBottom(xScale).tickSizeOuter(0))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    svg
      .append("g")
      .attr("class", "axis")
      .attr("transform", `translate(${margin},0)`)
      .call(d3.axisLeft(yScale).ticks(5));

    svg.selectAll(".title").remove();
    svg
      .append("text")
      .attr("class", "title")
      .attr("x", width / 2)
      .attr("y", margin / 2)
      .attr("text-anchor", "middle")
      .attr("font-size", 16)
      .attr("font-weight", "bold")
      .text("Gun Deaths by Gender per State");

    svg.selectAll(".legend").remove();
    const legend = svg
      .append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${width - margin - 100},${margin})`);

    legend
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", 20)
      .attr("height", 20)
      .attr("fill", colorScale("male"));
    legend.append("text").attr("x", 30).attr("y", 15).text("Male");

    legend
      .append("rect")
      .attr("x", 0)
      .attr("y", 30)
      .attr("width", 20)
      .attr("height", 20)
      .attr("fill", colorScale("female"));
    legend.append("text").attr("x", 30).attr("y", 45).text("Female");
  }, [props.data, svg, height, width, ToolTip, tTip]);

  return (
    <div
      className={"d3-component"}
      style={{ height: "99%", width: "99%" }}
      ref={d3Container}
    ></div>
  );
}
