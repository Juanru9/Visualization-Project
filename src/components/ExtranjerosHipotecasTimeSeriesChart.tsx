import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
} from "@mui/material";
import { TimeSeriesChart } from "./TimeSeriesChart";
import { ExtranjerosHipotecasJSON, TimeSeriesDataPoints } from "../types";
import { rollup, sum } from "d3";

interface ExtranjerosHipotecasTimeSeriesChartProps {
  data: ExtranjerosHipotecasJSON;
}

export const ExtranjerosHipotecasTimeSeriesChart: React.FC<ExtranjerosHipotecasTimeSeriesChartProps> = ({
  data: jsonData,
}) => {
  const [selectedCommunity, setSelectedCommunity] = useState<string>("Todos");
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesDataPoints>([]);
  const [communities, setCommunities] = useState<string[]>([]);

  // Extraer la lista de comunidades únicas y agregar "Todos"
  useEffect(() => {
    const uniqueCommunities = Array.from(
      new Set(jsonData.map((item) => item.Comunidades))
    );
    uniqueCommunities.sort();
    setCommunities(["Todos", ...uniqueCommunities]);
  }, [jsonData]);

  useEffect(() => {
    // Filtrar datos según la comunidad seleccionada
    const filteredData =
      selectedCommunity === "Todos"
        ? jsonData
        : jsonData.filter((item) => item.Comunidades === selectedCommunity);

    // Agrupar los datos por año y calcular el promedio de TotalTurismo y TotalHipotecas
    const grouped = rollup(
      filteredData,
      v => {
        const count = v.length;
        return {
          avgTurismo: count > 0 ? sum(v, (d) => d.TotalTurismo) / count : 0,
          avgHipotecas: count > 0 ? sum(v, (d) => d.TotalHipotecas) / count : 0,
        };
      },
      d => d.Anio
    );

    // Convertir a array de TimeSeriesDataPoint y ordenar por año
    const dataPoints: TimeSeriesDataPoints = Array.from(grouped, ([year, values]) => ({
      year: year,
      totalTurismo: values.avgTurismo,
      totalHipotecas: values.avgHipotecas,
    })).sort((a, b) => a.year.localeCompare(b.year));

    setTimeSeriesData(dataPoints);
  }, [jsonData, selectedCommunity]);

  return (
    <Box sx={{ width: "100%", height: "100%", p: 2 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Serie Temporal de Extranjeros e Hipotecas
      </Typography>
      <Grid container spacing={2} sx={{ height: "calc(100% - 80px)" }}>
        {/* Gráfico a la izquierda: xs=12, md=8 */}
        <Grid sx={{ height: "100%" }}>
          <Paper elevation={3} sx={{ height: "100%", p: 2 }}>
            <TimeSeriesChart data={timeSeriesData} />
          </Paper>
        </Grid>
        {/* Panel de controles a la derecha: xs=12, md=4 */}
        <Grid sx={{ height: "100%", width: "14rem"}}>
          <Paper
            elevation={3}
            sx={{
              height: "100%",
              p: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
            }}
          >
            <FormControl fullWidth>
              <InputLabel id="community-select-label">
                Comunidad Autónoma
              </InputLabel>
              <Select
                labelId="community-select-label"
                value={selectedCommunity}
                label="Comunidad Autónoma"
                onChange={(e) =>
                  setSelectedCommunity(e.target.value as string)
                }
              >
                {communities.map((comm, idx) => (
                  <MenuItem key={idx} value={comm}>
                    {comm}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};