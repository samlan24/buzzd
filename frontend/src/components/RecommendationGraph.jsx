import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import './RecommendationGraph.css';

const RecommendationGraph = ({ artists, onArtistClick }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!artists || artists.length === 0) return;

    const svg = d3.select(svgRef.current);
    const width = 900;
    const height = 600;
    const radius = Math.min(width, height) / 2;

    svg.attr("width", width).attr("height", height).selectAll("*").remove();

    const g = svg.append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const tree = d3.tree()
      .size([2 * Math.PI, radius - 100]);

    const root = d3.hierarchy({ name: artists[0], children: artists.slice(1).map(artist => ({ name: artist })) });

    tree(root);

    const link = g.selectAll(".link")
      .data(root.links())
      .enter().append("path")
      .attr("class", "link")
      .attr("d", d3.linkRadial()
        .angle(d => d.x)
        .radius(d => d.y));

    const node = g.selectAll(".node")
      .data(root.descendants())
      .enter().append("g")
      .attr("class", "node")
      .attr("transform", d => `
        rotate(${d.x * 180 / Math.PI - 90})
        translate(${d.y},0)
      `);

    node.append("circle")
      .attr("r", 10)
      .attr("class", "clickable")
      .on("click", (event, d) => {
        event.stopPropagation();
        onArtistClick(d.data.name);
      });

    node.append("text")
      .attr("dy", "0.35em")
      .attr("x", d => d.x < Math.PI === !d.children ? 15 : -15)
      .attr("text-anchor", d => d.x < Math.PI === !d.children ? "start" : "end")
      .attr("transform", d => d.x >= Math.PI ? "rotate(180)" : null)
      .style("font-size", "12px")
      .style("cursor", "pointer")
      .text(d => d.data.name.length > 12 ? d.data.name.slice(0, 12) + '...' : d.data.name)
      .on("click", (event, d) => {
        event.stopPropagation();
        onArtistClick(d.data.name);
      });

    // Rotate the entire group continuously
    const rotateGraph = () => {
      g.transition()
        .duration(400) // Duration of rotation
        .attr("transform", function () {
          const angle = parseFloat(d3.select(this).attr("data-rotation") || 0);
          return `translate(${width / 2},${height / 2}) rotate(${angle + 1})`;
        })
        .on("end", rotateGraph); // Loop the rotation
    };

    rotateGraph(); // Start the rotation
  }, [artists]);

  return <svg ref={svgRef}></svg>;
};

export default RecommendationGraph;
