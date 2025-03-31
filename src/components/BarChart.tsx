import React from "react";
import * as d3 from "d3";
import { DataPoint } from "../types";

export interface BarChartProps {
  data: DataPoint[];
}

export const BarChart: React.FC<BarChartProps> = ({ data }) => {
  const width = 500;
  const height = 300;
  const margin = { top: 20, right: 20, bottom: 30, left: 40 };

  // Crear escala de bandas para el eje X
  const x = d3
    .scaleBand<string>()
    .domain(data.map((d) => d.name))
    .range([margin.left, width - margin.right])
    .padding(0.1);

  // Crear escala lineal para el eje Y
  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.value) ?? 0])
    .nice()
    .range([height - margin.bottom, margin.top]);

  return (
    <svg width={width} height={height}>
      {/* Eje X */}
      <g transform={`translate(0, ${height - margin.bottom})`}>
        {x.domain().map((d, i) => (
          <text
            key={i}
            x={(x(d) ?? 0) + x.bandwidth() / 2}
            y={15}
            textAnchor="middle"
            style={{ fontSize: "0.8rem" }}
          >
            {d}
          </text>
        ))}
      </g>
      {/* Eje Y */}
      <g>
        {y.ticks().map((tick, i) => (
          <text
            key={i}
            x={margin.left - 10}
            y={y(tick)}
            textAnchor="end"
            style={{ fontSize: "0.8rem" }}
          >
            {tick}
          </text>
        ))}
      </g>
      {/* Barras */}
      {data.map((d, i) => (
        <rect
          key={i}
          x={x(d.name) ?? 0}
          y={y(d.value)}
          width={x.bandwidth()}
          height={y(0) - y(d.value)}
          fill="steelblue"
        />
      ))}
    </svg>
  );
};
