// HipotecasTipoInteresTimeSeriesChart.tsx

import React, { useState, useMemo } from "react";
import { HipotecasTiposInteresItem } from "../types";
import { Box, Typography, Slider, Paper } from "@mui/material";
import {
  scaleTime,
  scaleLinear,
  max,
  line,
  timeFormat
} from "d3";

interface HipotecasTipoInteresTimeSeriesChartProps {
  data: HipotecasTiposInteresItem[];
}

export const HipotecasTipoInteresTimeSeriesChart: React.FC<HipotecasTipoInteresTimeSeriesChartProps> = ({ data }) => {
  // Dimensiones del gráfico
  const width = 800;
  const height = 400;
  const margin = { top: 20, right: 60, bottom: 40, left: 50 };

  // Offsets para bajar los gráficos: uno para hipotecas y otro (mayor) para tipo de interés
  const offsetHipotecas = 10;
  const offsetTipoInteres = 20;

  // Extraer los años únicos y ordenarlos
  const years = useMemo(() => {
    const uniqueYears = Array.from(new Set(data.map(d => d.Anio)));
    uniqueYears.sort();
    return uniqueYears;
  }, [data]);

  // Estado para el año seleccionado (por defecto el primero)
  const [selectedYear, setSelectedYear] = useState<string>(years[0]);

  // Filtrar datos según el año seleccionado
  const filteredData = data.filter(d => d.Anio === selectedYear);

  // Si no hay datos para el año seleccionado, se muestra un mensaje
  if (filteredData.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 2, m: 2 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Hipotecas vs Tipo de Interés por Mes
        </Typography>
        <Typography align="center" color="error">
          No hay datos para el año {selectedYear}
        </Typography>
      </Paper>
    );
  }

  // Función para convertir el mes (string) a Date usando un año fijo (por ejemplo, 2000)
  const parseMonth = (mes: string): Date => new Date(2000, Number(mes) - 1, 1);

  // Mapear y ordenar los datos filtrados por mes
  const dataParsed = filteredData
    .map(d => ({
      month: parseMonth(d.Mes),
      hipotecas: d.Hipotecas_Nacional,
      tipoInteres: d.Tipo_Interes
    }))
    .sort((a, b) => a.month.getTime() - b.month.getTime());

  // Escala X: escala de tiempo para los meses (de enero a diciembre)
  const x = scaleTime()
    .domain([new Date(2000, 0, 1), new Date(2000, 11, 1)])
    .range([margin.left, width - margin.right]);

  // Escala Y izquierda para Hipotecas_Nacional (bajando el gráfico con offsetHipotecas)
  const maxHipotecas = max(dataParsed, d => d.hipotecas) || 0;
  const yLeft = scaleLinear()
    .domain([0, maxHipotecas])
    .nice()
    .range([height - margin.bottom - offsetHipotecas, margin.top - offsetHipotecas]);

  // Escala Y derecha para Tipo_Interes (bajando aún más usando offsetTipoInteres)
  const maxTipoInteres = max(dataParsed, d => d.tipoInteres) || 0;
  const yRight = scaleLinear()
    .domain([0, maxTipoInteres])
    .nice()
    .range([height - margin.bottom - offsetTipoInteres, margin.top - offsetTipoInteres]);

  // Generador de línea para Hipotecas_Nacional
  const lineHipotecas = line<typeof dataParsed[0]>()
    .x(d => x(d.month))
    .y(d => yLeft(d.hipotecas));

  // Generador de línea para Tipo_Interes
  const lineTipoInteres = line<typeof dataParsed[0]>()
    .x(d => x(d.month))
    .y(d => yRight(d.tipoInteres));

  return (
    <Paper elevation={3} sx={{ p: 2, m: 2 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Hipotecas vs Tipo de Interés por Mes (Año {selectedYear})
      </Typography>

      {/* Slider para cambiar el año */}
      <Box sx={{ width: "70%", mx: "auto", mb: 2 }}>
        <Typography id="year-slider" gutterBottom>
          Año: {selectedYear}
        </Typography>
        <Slider
          value={parseInt(selectedYear)}
          min={parseInt(years[0])}
          max={parseInt(years[years.length - 1])}
          step={1}
          marks={years.map(y => ({ value: parseInt(y), label: y }))}
          onChange={(e, value) => {
            const newValue = Array.isArray(value) ? value[0] : value;
            setSelectedYear(newValue.toString());
          }}
        />
      </Box>

      {/* Gráfico SVG */}
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%">
        {/* Fondo para visualizar el área del gráfico */}
        <rect x={0} y={0} width={width} height={height} fill="#f9f9f9" />

        {/* Eje X: etiquetas para cada mes */}
        <g transform={`translate(0, ${height - margin.bottom})`}>
          {dataParsed.map((d, i) => (
            <text
              key={i}
              x={x(d.month)}
              y={20}
              textAnchor="middle"
              style={{ fontSize: "0.8rem" }}
            >
              {timeFormat("%b")(d.month)}
            </text>
          ))}
        </g>

        {/* Eje Y izquierdo: Hipotecas_Nacional */}
        <g>
          {yLeft.ticks().map((tick, i) => (
            <text
              key={i}
              x={margin.left - 5}
              y={yLeft(tick)}
              textAnchor="end"
              style={{ fontSize: "0.8rem" }}
            >
              {tick}
            </text>
          ))}
        </g>

        {/* Eje Y derecho: Tipo_Interes */}
        <g>
          {yRight.ticks().map((tick, i) => (
            <text
              key={i}
              x={width - margin.right + 10}
              y={yRight(tick)}
              textAnchor="start"
              style={{ fontSize: "0.8rem" }}
            >
              {tick}%
            </text>
          ))}
        </g>

        {/* Línea y puntos para Hipotecas_Nacional */}
        <path
          d={lineHipotecas(dataParsed) || ""}
          fill="none"
          stroke="green"
          strokeWidth={2}
        />
        {dataParsed.map((d, i) => (
          <circle
            key={`hipo-${i}`}
            cx={x(d.month)}
            cy={yLeft(d.hipotecas)}
            r={4}
            fill="green"
          >
            <title>{`${timeFormat("%b")(d.month)}: ${d.hipotecas} hipotecas`}</title>
          </circle>
        ))}

        {/* Línea y puntos para Tipo_Interes */}
        <path
          d={lineTipoInteres(dataParsed) || ""}
          fill="none"
          stroke="red"
          strokeWidth={2}
        />
        {dataParsed.map((d, i) => (
          <circle
            key={`ti-${i}`}
            cx={x(d.month)}
            cy={yRight(d.tipoInteres)}
            r={4}
            fill="red"
          >
            <title>{`${timeFormat("%b")(d.month)}: ${d.tipoInteres}% tipo de interés`}</title>
          </circle>
        ))}

        {/* Leyenda */}
        <g transform={`translate(${width - margin.right - 150}, ${margin.top-20})`}>
          <rect x={0} y={0} width={15} height={15} fill="green" />
          <text x={20} y={12} style={{ fontSize: "0.8rem" }}>
            Hipotecas Nacional
          </text>
          <rect x={0} y={20} width={15} height={15} fill="red" />
          <text x={20} y={32} style={{ fontSize: "0.8rem" }}>
            Tipo de Interés
          </text>
        </g>
      </svg>
    </Paper>
  );
};
