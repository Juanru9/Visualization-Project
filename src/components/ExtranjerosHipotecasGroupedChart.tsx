import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { SliderControls } from "./controls/SliderControls";
import { ExtranjerosHipotecasJSON, GroupedDataPoint } from "../types";
import { GroupedBarChart } from "./GroupedBarChart";

interface ExtranjerosHipotecasGroupedChartProps {
  data: ExtranjerosHipotecasJSON;
}

export const ExtranjerosHipotecasGroupedChart: React.FC<ExtranjerosHipotecasGroupedChartProps> = ({ data: jsonData }) => {
  const [month, setMonth] = useState("10");
  const [year, setYear] = useState("2016");
  const [groupedData, setGroupedData] = useState<GroupedDataPoint[]>([]);
  const [selectedCommunity, setSelectedCommunity] = useState<string>("Todos");

  // Extraer la lista de comunidades únicas y agregar "Todos"
  const communities = useMemo(() => {
    const unique = Array.from(new Set(jsonData.map(item => item.Comunidades)));
    unique.sort();
    return ["Todos", ...unique];
  }, [jsonData]);

  useEffect(() => {
    // Filtrar los registros según año, mes y comunidad (si se selecciona)
    const filtered = jsonData.filter(
      item =>
        item.Anio === year &&
        item.Mes === month &&
        (selectedCommunity === "Todos" || item.Comunidades === selectedCommunity)
    );
    // Mapear cada registro a un GroupedDataPoint
    const dataPoints: GroupedDataPoint[] = filtered.map(item => ({
      name: item.Comunidades,
      valueForeigners: item.NormalizedTurismo, // barra roja (extranjeros)
      valueHipotecas: item.NormalizedHipotecas,  // barra verde (hipotecas)
    }));
    setGroupedData(dataPoints);
  }, [month, year, selectedCommunity, jsonData]);

  return (
    <Box sx={{ width: "100%", height: "100%", p: 2 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Comparación de Extranjeros y nº Hipotecas
      </Typography>
      <Grid container spacing={2} sx={{ height: "calc(100% - 80px)" }}>
        {/* Gráfico a la izquierda: ocupa xs=12, md=8 */}
        <Grid sx={{ height: "90%" }}>
          <Paper elevation={3} sx={{ height: "100%", width: "100%", p: 2 }}>
            <GroupedBarChart data={groupedData} />
          </Paper>
        </Grid>
        {/* Panel de controles a la derecha: ocupa xs=12, md=4 */}
        <Grid sx={{ height: "60%" }}>
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
            <SliderControls
              month={month}
              setMonth={setMonth}
              year={year}
              setYear={setYear}
              yearRange={[2015, 2024]}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
