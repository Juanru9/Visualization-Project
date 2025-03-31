import React from "react";
import * as d3 from "d3";
import { GroupedDataPoint } from "../types";

export interface GroupedBarChartProps {
  data: GroupedDataPoint[];
}

export const GroupedBarChart: React.FC<GroupedBarChartProps> = ({ data }) => {
  const width = 1000;
  const height = 300;
  const margin = { top: 20, right: 20, bottom: 60, left: 40 };

  // Grupos: nombre de la comunidad
  const groups = data.map(d => d.name);
  // Subgrupos: dos métricas
  const subgroups = ["foreigners", "hipotecas"];

  // Escala para grupos con mayor separación (paddingInner) para dejar espacio al nombre
  const x0 = d3.scaleBand<string>()
    .domain(groups)
    .range([margin.left, width - margin.right])
    .paddingInner(0.5)
    .paddingOuter(0.2);

  // Escala interna para subgrupos
  const x1 = d3.scaleBand<string>()
    .domain(subgroups)
    .range([0, x0.bandwidth()])
    .padding(0.05);

  // Escala Y: valor máximo entre ambas métricas
  const maxValue = d3.max(data, d => Math.max(d.valueForeigners, d.valueHipotecas)) ?? 0;
  const y = d3.scaleLinear()
    .domain([0, maxValue])
    .nice()
    .range([height - margin.bottom, margin.top]);

  // Colores para cada métrica
  const color = d3.scaleOrdinal<string>()
    .domain(subgroups)
    .range(["red", "green"]);

  return (
    <svg width={width} height={height}>
      {/* Eje X */}
      <g transform={`translate(0,${height - margin.bottom})`}>
        {groups.map((group, i) => (
          <text
            key={i}
            x={(x0(group) ?? 0) + x0.bandwidth() / 2}
            y={20}
            textAnchor="middle"
            style={{ fontSize: "0.8rem" }}
          >
            {group}
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
      {/* Barras agrupadas */}
      {data.map((d, i) => (
        <g key={i} transform={`translate(${x0(d.name) ?? 0},0)`}>
          {subgroups.map((key) => {
            const value = key === "foreigners" ? d.valueForeigners : d.valueHipotecas;
            return (
              <rect
                key={key}
                x={x1(key)}
                y={y(value)}
                width={x1.bandwidth()}
                height={y(0) - y(value)}
                fill={color(key)}
              />
            );
          })}
        </g>
      ))}
      {/* Leyenda */}
      <g transform={`translate(${width - margin.right - 120}, ${margin.top})`}>
        <rect x={0} y={0} width={15} height={15} fill="red" />
        <text x={20} y={12} style={{ fontSize: "0.8rem" }}>Total Turistas extranjeros</text>
        <rect x={0} y={20} width={15} height={15} fill="green" />
        <text x={20} y={32} style={{ fontSize: "0.8rem" }}>Importe Hipotecas</text>
      </g>
    </svg>
  );
};
