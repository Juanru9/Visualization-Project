import React, { useState, useEffect } from "react";
import { Box, Grid, Paper, Typography } from "@mui/material";
import { ChoroplethMap } from "./ChoroplethMap";
import { SliderControls } from "./controls/SliderControls";
import {
  TourismDataPoint,
  SpainCommunitiesGeoJSON,
  ViviendasTuristicasComunidadesData,
} from "../types";

interface MapaViviendaTuristicaComunidadesProps {
  geoData: SpainCommunitiesGeoJSON;
  rawData: ViviendasTuristicasComunidadesData;
}

export const MapaViviendaTuristicaComunidades: React.FC<MapaViviendaTuristicaComunidadesProps> = ({
  geoData,
  rawData,
}) => {
  const [month, setMonth] = useState("08");
  const [year, setYear] = useState("2020");
  const [data, setData] = useState<TourismDataPoint[]>([]);
  const [selectedCommunity, setSelectedCommunity] = useState<{ name: string; total: number } | null>(null);

  useEffect(() => {
    // Filtrar los datos según mes y año
    const filtered = rawData.filter((d) => d.Mes === month && d.Anio === year);
    // Se asume que "Comunidades" está en formato "01 Andalucía"
    const dataPoints: TourismDataPoint[] = filtered.map((d) => {
      const parts = d.Comunidades.split(" ");
      const code = parts.length > 0 ? parts[0] : "00";
      const name = parts.length > 1 ? parts.slice(1).join(" ") : "";
      return { code, name, value: d.Total };
    });
    if (dataPoints.length === 0) {
      return;
    }
    setData(dataPoints);
  }, [month, year, rawData]);

  if (data.length === 0) {
    return <div>Cargando...</div>;
  }

  // Calcular el total de viviendas turísticas
  const totalViviendas = data.reduce((acc, dp) => acc + dp.value, 0);

  return (
    <Box sx={{ flexGrow: 1, p: 2, width: "100%", height: "100%" }}>
      {/* Título global */}
      <Typography variant="h4" align="center" gutterBottom>
        Número de viviendas turísticas: <b>{totalViviendas}</b>
      </Typography>
      <Grid container spacing={2} sx={{ height: "calc(100% - 60px)" }}>
        {/* Mapa a la izquierda */}
        <Grid sx={{ height: "90%" }}>
          <Paper elevation={3} sx={{ p: 2, height: "100%" }}>
            <ChoroplethMap
              mode="community"
              geoData={geoData}
              data={data}
              onRegionClick={setSelectedCommunity}
            />
          </Paper>
        </Grid>
        {/* Panel de controles a la derecha */}
        <Grid sx={{ height: "90%" }}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {selectedCommunity ? (
              <Typography variant="h6" gutterBottom align="center">
                {selectedCommunity.name} – Total: {selectedCommunity.total}
              </Typography>
            ) : (
              <Typography variant="h6" gutterBottom align="center">
                Haz click en una comunidad
              </Typography>
            )}
            <SliderControls month={month} setMonth={setMonth} year={year} setYear={setYear} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};