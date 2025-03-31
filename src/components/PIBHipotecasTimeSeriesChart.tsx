import React, { useState } from "react";
import { PIBHipotecasItem, TimeSeriesPIBHipotecasDataPoint } from "../types";
import {
  extent,
  line,
  max,
  scaleLinear,
  scaleTime,
  timeFormat,
  timeParse,
} from "d3";
import { Box, Typography, Slider } from "@mui/material";

interface PIBHipotecasTimeSeriesChartProps {
  data: PIBHipotecasItem[];
}

export const PIBHipotecasTimeSeriesChart: React.FC<PIBHipotecasTimeSeriesChartProps> = ({ data }) => {
  // Dimensiones del gráfico
  const width = 800;
  const height = 400;
  const margin = { top: 20, right: 60, bottom: 40, left: 35 };

  // Estado para el trimestre seleccionado (1 a 4)
  const [selectedQuarter, setSelectedQuarter] = useState<number>(1);

  // Función para parsear el año (string) a Date
  const parseYear = timeParse("%Y");

  // Filtrar los datos según el trimestre seleccionado
  const filteredData = data.filter((d) => d.Trimestre === selectedQuarter);

  // Mapear y ordenar los datos filtrados para la serie temporal
  const dataParsed: TimeSeriesPIBHipotecasDataPoint[] = filteredData
    .map((d) => ({
      year: parseYear(d.Año)!,
      normalizedPIB: d.PIB_Normalizado,
      normalizedHipotecas: d.Hipotecas_Normalizadas,
    }))
    .sort((a, b) => a.year.getTime() - b.year.getTime());

  // Escala X (tiempo) basada en los años
  const x = scaleTime()
    .domain(extent(dataParsed, (d) => d.year) as [Date, Date])
    .range([margin.left, width - margin.right]);

  // Escala Y izquierda para el PIB (normalizado)
  const maxYPIB = max(dataParsed, (d) => d.normalizedPIB) || 0;
  const yLeft = scaleLinear()
    .domain([0, maxYPIB])
    .nice()
    .range([height - margin.bottom, margin.top]);

  // Escala Y derecha para las hipotecas (normalizadas)
  const maxYHipotecas = max(dataParsed, (d) => d.normalizedHipotecas) || 0;
  const yRight = scaleLinear()
    .domain([0, maxYHipotecas])
    .nice()
    .range([height - margin.bottom, margin.top]);

  // Generador de línea para PIB
  const linePIB = line<TimeSeriesPIBHipotecasDataPoint>()
    .x((d) => x(d.year))
    .y((d) => yLeft(d.normalizedPIB));

  // Generador de línea para Hipotecas
  const lineHipotecas = line<TimeSeriesPIBHipotecasDataPoint>()
    .x((d) => x(d.year))
    .y((d) => yRight(d.normalizedHipotecas));

  return (
    <Box>
      <Typography variant="h5" align="center" gutterBottom>
        Serie Temporal Normalizada de PIB y Hipotecas
      </Typography>

      {/* Slider para seleccionar el trimestre */}
      <Box sx={{ width: 300, margin: "0 auto", mb: 2 }}>
        <Typography id="quarter-slider" gutterBottom>
          Trimestre: {selectedQuarter}
        </Typography>
        <Slider
          value={selectedQuarter}
          min={1}
          max={4}
          step={1}
          marks
          onChange={(e, value) => setSelectedQuarter(value as number)}
          aria-labelledby="quarter-slider"
        />
      </Box>

      {/* SVG del gráfico */}
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%">
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

        {/* Eje Y izquierdo (PIB normalizado) */}
        <g transform={`translate(${margin.left}, 0)`}>
          {yLeft.ticks().map((tick, i) => (
            <text
              key={i}
              x={margin.left - 10}
              y={yLeft(tick)}
              textAnchor="end"
              style={{ fontSize: "0.8rem" }}
            >
              {tick} M
            </text>
          ))}
        </g>

        {/* Eje Y derecho (Hipotecas normalizadas) */}
        <g transform={`translate(${width - margin.right}, 0)`}>
          {yRight.ticks().map((tick, i) => (
            <text
              key={i}
              x={0}
              y={yRight(tick)}
              textAnchor="start"
              style={{ fontSize: "0.8rem" }}
            >
              {tick}
            </text>
          ))}
        </g>

        {/* Línea para PIB */}
        <path
          d={linePIB(dataParsed) ?? ""}
          fill="none"
          stroke="blue"
          strokeWidth={2}
        />

        {/* Puntos para PIB */}
        {dataParsed.map((d, i) => (
          <circle
            key={`pib-${i}`}
            cx={x(d.year)}
            cy={yLeft(d.normalizedPIB)}
            r={4}
            fill="blue"
          >
            <title>{`${timeFormat("%Y")(d.year)} - PIB Normalizado: ${d.normalizedPIB}`}</title>
          </circle>
        ))}

        {/* Línea para Hipotecas */}
        <path
          d={lineHipotecas(dataParsed) ?? ""}
          fill="none"
          stroke="orange"
          strokeWidth={2}
        />

        {/* Puntos para Hipotecas */}
        {dataParsed.map((d, i) => (
          <circle
            key={`hipo-${i}`}
            cx={x(d.year)}
            cy={yRight(d.normalizedHipotecas)}
            r={4}
            fill="orange"
          >
            <title>{`${timeFormat("%Y")(d.year)} - Hipotecas Normalizadas: ${d.normalizedHipotecas}`}</title>
          </circle>
        ))}

        {/* Leyenda */}
        <g transform={`translate(${width - 3.5 * margin.right}, ${margin.top - 20})`}>
          <rect x={0} y={0} width={15} height={15} fill="blue" />
          <text x={20} y={12} style={{ fontSize: "0.8rem" }}>
            PIB (normalizado)
          </text>
          <rect x={0} y={20} width={15} height={15} fill="orange" />
          <text x={20} y={32} style={{ fontSize: "0.8rem" }}>
            Hipotecas (normalizado)
          </text>
        </g>
      </svg>
    </Box>
  );
};
