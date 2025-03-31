import React from "react";
import { TimeSeriesDataPoint } from "../types";
import {
  extent,
  line,
  max,
  scaleLinear,
  scaleTime,
  timeFormat,
  timeParse,
} from "d3";

interface TimeSeriesChartProps {
  data: TimeSeriesDataPoint[];
}

export const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({ data }) => {
  // Dimensiones de referencia para el viewBox
  const width = 800;
  const height = 400;
  const margin = { top: 20, right: 60, bottom: 40, left: 35 };

  // Convertir el año (string) a Date
  const parseYear = timeParse("%Y");
  const dataParsed = data.map((d) => ({
    year: parseYear(d.year.toString())!,
    totalTurismo: d.totalTurismo,
    totalHipotecas: d.totalHipotecas,
  }));

  // Escala X: escala de tiempo
  const x = scaleTime()
    .domain(extent(dataParsed, (d) => d.year) as [Date, Date])
    .range([margin.left, width - margin.right]);

  // Escala Y izquierda para turismo (personas)
  const maxYTurismo = max(dataParsed, (d) => d.totalTurismo) || 0;
  const yLeft = scaleLinear()
    .domain([0, maxYTurismo])
    .nice()
    .range([height - margin.bottom, margin.top]);

  // Escala Y derecha para hipotecas (euros)
  const maxYHipotecas = max(dataParsed, (d) => d.totalHipotecas) || 0;
  const yRight = scaleLinear()
    .domain([0, maxYHipotecas])
    .nice()
    .range([height - margin.bottom, margin.top]);

  // Generador de línea para turismo
  const lineTurismo = line<{ year: Date; totalTurismo: number }>()
    .x((d) => x(d.year))
    .y((d) => yLeft(d.totalTurismo));

  // Generador de línea para hipotecas
  const lineHipotecas = line<{ year: Date; totalHipotecas: number }>()
    .x((d) => x(d.year))
    .y((d) => yRight(d.totalHipotecas));

  return (
    <div style={{ width: "100%", height: "70%", margin: "1rem 1rem" }}>
      <svg viewBox={`0 0 ${width} ${height}`} width="auto" height="100%">
        {/* Eje X */}
        <g transform={`translate(0, ${height - margin.bottom})`}>
          {x.ticks(6).map((tick, i) => (
            <text
              key={i}
              x={x(tick)}
              y={20}
              textAnchor="middle"
              style={{ fontSize: "0.8rem" }}
            >
              {timeFormat("%Y")(tick)}
            </text>
          ))}
        </g>
        {/* Eje Y izquierdo (Turismo - personas) */}
        <g transform={`translate(${margin.left}, 0)`}>
          {yLeft.ticks().map((tick, i) => (
            <text
              key={i}
              x={margin.left - 10}
              y={yLeft(tick)}
              textAnchor="end"
              style={{ fontSize: "0.8rem" }}
            >
              {tick} p
            </text>
          ))}
        </g>
        {/* Eje Y derecho (Hipotecas - euros) */}
        <g transform={`translate(${width - margin.right}, 0)`}>
          {yRight.ticks().map((tick, i) => (
            <text
              key={i}
              x={0}
              y={yRight(tick)}
              textAnchor="start"
              style={{ fontSize: "0.8rem" }}
            >
              {tick} h
            </text>
          ))}
        </g>
        {/* Línea de Turismo */}
        <path
          d={lineTurismo(dataParsed) ?? ""}
          fill="none"
          stroke="red"
          strokeWidth={2}
        />
        {/* Círculos de Turismo */}
        {dataParsed.map((d, i) => (
          <circle
            key={`turismo-${i}`}
            cx={x(d.year!)}
            cy={yLeft(d.totalTurismo)}
            r={4}
            fill="red"
          >
            <title>
              {`${timeFormat("%Y")(d.year!)} - ${d.totalTurismo} personas`}
            </title>
          </circle>
        ))}
        {/* Línea de Hipotecas */}
        <path
          d={lineHipotecas(dataParsed) ?? ""}
          fill="none"
          stroke="green"
          strokeWidth={2}
        />
        {/* Círculos de Hipotecas */}
        {dataParsed.map((d, i) => (
          <circle
            key={`hipotecas-${i}`}
            cx={x(d.year!)}
            cy={yRight(d.totalHipotecas)}
            r={4}
            fill="green"
          >
            <title>
              {`${timeFormat("%Y")(d.year!)} - ${d.totalHipotecas} euros`}
            </title>
          </circle>
        ))}
        {/* Leyenda */}
        <g transform={`translate(${width - 3.5*margin.right}, ${margin.top-20})`}>
          <rect x={0} y={0} width={15} height={15} fill="red" />
          <text x={20} y={12} style={{ fontSize: "0.8rem" }}>
            Nº Turistas
          </text>
          <rect x={0} y={20} width={15} height={15} fill="green" />
          <text x={20} y={32} style={{ fontSize: "0.8rem" }}>
            Nº Hipotecas
          </text>
        </g>
      </svg>
    </div>
  );
};
