// HipotecasRentaDualAxisLineChart.tsx

import React, { useState, useMemo } from "react";
import { HipotecasRentaItem } from "../types";
import {
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  scaleTime,
  scaleLinear,
  line,
  extent,
  timeFormat,
} from "d3";

// Tipo para los datos agregados por año
interface AggregatedData {
  year: Date;
  avgHipotecas: number;
  avgRenta: number;
}

interface HipotecasRentaDualAxisLineChartProps {
  data: HipotecasRentaItem[];
}

export const HipotecasRentaDualAxisLineChart: React.FC<HipotecasRentaDualAxisLineChartProps> = ({ data }) => {
  // Dimensiones del gráfico
  const width = 800;
  const height = 500;
  const margin = { top: 40, right: 60, bottom: 60, left: 30 };

  // Extraer comunidades únicas y añadir "Todos"
  const communities = useMemo(() => {
    const uniques = Array.from(new Set(data.map(d => d.Comunidades_Autonomas)));
    uniques.sort();
    return ["Todos", ...uniques];
  }, [data]);

  // Estado para la comunidad seleccionada
  const [selectedCommunity, setSelectedCommunity] = useState<string>("Todos");

  // Filtrar datos según la comunidad seleccionada y descartar registros con valores NaN
  const filteredData = useMemo(() => {
    const base = selectedCommunity === "Todos"
      ? data
      : data.filter(d => d.Comunidades_Autonomas === selectedCommunity);
    return base.filter(d => 
      d.Hipotecas_Anual != null && !isNaN(d.Hipotecas_Anual) &&
      d.RentaMedia != null && !isNaN(d.RentaMedia)
    );
  }, [data, selectedCommunity]);

  // Agrupar datos por año y calcular promedios, filtrando posibles NaN
  const aggregatedData: AggregatedData[] = useMemo(() => {
    const grouped: { [year: string]: { hipotecas: number[]; renta: number[] } } = {};
    filteredData.forEach(d => {
      if (!grouped[d.Año]) {
        grouped[d.Año] = { hipotecas: [], renta: [] };
      }
      grouped[d.Año].hipotecas.push(d.Hipotecas_Anual);
      grouped[d.Año].renta.push(d.RentaMedia);
    });
    return Object.entries(grouped)
      .map(([year, values]) => ({
        year: new Date(parseInt(year), 0, 1),
        avgHipotecas:
          values.hipotecas.reduce((sum, val) => sum + val, 0) / values.hipotecas.length,
        avgRenta:
          values.renta.reduce((sum, val) => sum + val, 0) / values.renta.length,
      }))
      .filter(d => !isNaN(d.avgHipotecas) && !isNaN(d.avgRenta))
      .sort((a, b) => a.year.getTime() - b.year.getTime());
  }, [filteredData]);

  if (aggregatedData.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 2, m: 2 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Hipotecas Anuales vs Renta Media por Año
        </Typography>
        <Typography align="center" color="error">
          No hay datos para la comunidad {selectedCommunity}
        </Typography>
      </Paper>
    );
  }

  // Escala X para los años
  const xScale = scaleTime()
    .domain(extent(aggregatedData, d => d.year) as [Date, Date])
    .range([margin.left, width - margin.right]);

  // Escala Y izquierda para Hipotecas_Anual
  const yLeftMax = Math.max(...aggregatedData.map(d => d.avgHipotecas));
  const yLeftScale = scaleLinear()
    .domain([0, yLeftMax])
    .range([height - margin.bottom, margin.top]);

  // Escala Y derecha para RentaMedia
  const yRightMax = Math.max(...aggregatedData.map(d => d.avgRenta));
  const yRightScale = scaleLinear()
    .domain([0, yRightMax])
    .range([height - margin.bottom, margin.top]);

  // Generador de línea para Hipotecas_Anual
  const hipotecasLine = line<AggregatedData>()
    .x(d => xScale(d.year))
    .y(d => yLeftScale(d.avgHipotecas));

  // Generador de línea para RentaMedia
  const rentaLine = line<AggregatedData>()
    .x(d => xScale(d.year))
    .y(d => yRightScale(d.avgRenta));

  // Formateador de años
  const formatYear = timeFormat("%Y");

  return (
    <Paper elevation={3} sx={{ p: 2, m: 2 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Hipotecas Anuales vs Renta Media por Año
      </Typography>

      {/* Dropdown para seleccionar comunidad */}
      <FormControl sx={{ minWidth: 200, mb: 2 }}>
        <InputLabel id="community-select-label">Comunidad Autónoma</InputLabel>
        <Select
          labelId="community-select-label"
          value={selectedCommunity}
          label="Comunidad Autónoma"
          onChange={(e) => setSelectedCommunity(e.target.value as string)}
        >
          {communities.map((comm, idx) => (
            <MenuItem key={idx} value={comm}>
              {comm}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <svg width={width} height={height}>
        {/* Fondo */}
        <rect x={0} y={0} width={width} height={height} fill="#f9f9f9" />

        {/* Eje X */}
        <line
          x1={margin.left}
          y1={height - margin.bottom}
          x2={width - margin.right}
          y2={height - margin.bottom}
          stroke="black"
        />
        {aggregatedData.map((d, i) => (
          <g key={i}>
            <line
              x1={xScale(d.year)}
              y1={height - margin.bottom}
              x2={xScale(d.year)}
              y2={height - margin.bottom + 6}
              stroke="black"
            />
            <text
              x={xScale(d.year)}
              y={height - margin.bottom + 20}
              textAnchor="middle"
              fontSize="0.8rem"
            >
              {formatYear(d.year)}
            </text>
          </g>
        ))}

        {/* Eje Y izquierdo para Hipotecas */}
        <line
          x1={margin.left}
          y1={margin.top}
          x2={margin.left}
          y2={height - margin.bottom}
          stroke="black"
        />
        {yLeftScale.ticks(5).map((tick, i) => (
          <g key={i}>
            <line
              x1={margin.left - 6}
              y1={yLeftScale(tick)}
              x2={margin.left}
              y2={yLeftScale(tick)}
              stroke="black"
            />
            <text
              x={margin.left - 10}
              y={yLeftScale(tick) + 4}
              textAnchor="end"
              fontSize="0.8rem"
            >
              {tick}
            </text>
          </g>
        ))}

        {/* Eje Y derecho para RentaMedia */}
        <line
          x1={width - margin.right}
          y1={margin.top}
          x2={width - margin.right}
          y2={height - margin.bottom}
          stroke="black"
        />
        {yRightScale.ticks(5).map((tick, i) => (
          <g key={i}>
            <line
              x1={width - margin.right}
              y1={yRightScale(tick)}
              x2={width - margin.right + 6}
              y2={yRightScale(tick)}
              stroke="black"
            />
            <text
              x={width - margin.right + 10}
              y={yRightScale(tick) + 4}
              textAnchor="start"
              fontSize="0.8rem"
            >
              {tick}
            </text>
          </g>
        ))}

        {/* Etiquetas de ejes */}
        <text
          x={(width - margin.left - margin.right) / 2 + margin.left}
          y={height - 10}
          textAnchor="middle"
          fontSize="1rem"
        >
          Año
        </text>
        <text
          x={15}
          y={(height - margin.top - margin.bottom) / 2 + margin.top}
          textAnchor="middle"
          fontSize="1rem"
          transform={`rotate(-90, 15, ${(height - margin.top - margin.bottom) / 2 + margin.top})`}
        >
          Hipotecas Anuales
        </text>
        <text
          x={width - 10}
          y={(height - margin.top - margin.bottom) / 2 + margin.top}
          textAnchor="middle"
          fontSize="1rem"
          transform={`rotate(90, ${width - 12}, ${(height - margin.top - margin.bottom) / 2 + margin.top})`}
        >
          Renta Media
        </text>

        {/* Línea y puntos para Hipotecas */}
        <path
          d={hipotecasLine(aggregatedData) || ""}
          fill="none"
          stroke="green"
          strokeWidth={2}
        />
        {aggregatedData.map((d, i) => (
          <circle
            key={`hipo-${i}`}
            cx={xScale(d.year)}
            cy={yLeftScale(d.avgHipotecas)}
            r={4}
            fill="green"
          >
            <title>
              {`${formatYear(d.year)} – Hipotecas: ${Math.round(d.avgHipotecas)}`}
            </title>
          </circle>
        ))}

        {/* Línea y puntos para RentaMedia */}
        <path
          d={rentaLine(aggregatedData) || ""}
          fill="none"
          stroke="red"
          strokeWidth={2}
        />
        {aggregatedData.map((d, i) => (
          <circle
            key={`renta-${i}`}
            cx={xScale(d.year)}
            cy={yRightScale(d.avgRenta)}
            r={4}
            fill="red"
          >
            <title>
              {`${formatYear(d.year)} – Renta Media: ${Math.round(d.avgRenta)}`}
            </title>
          </circle>
        ))}
      </svg>
    </Paper>
  );
};
